//@ts-nocheck
// TODO Fjern ts-nocheck og typ opp skikkelig
import * as cheerio from "cheerio";
import rp from "request-promise";
import {db} from "../database/db";
import slack from "../alerting/slack";
import parser from "xml2json";

const vatromUrl = "https://www.ffv.no/finn-godkjent-vatromsbedrift";
const arbeidstilsynetUrl =
  "https://www.arbeidstilsynet.no/opendata/renhold_register.xml";
const ekomUrl =
  "https://stenonicprdnoea01.blob.core.windows.net/enonicpubliccontainer/autosys/alleAutorisasjoner.htm";

async function scrapeAndPopulateDb() {
  try {
    // slack.utvikling(`Henter data fra ${vatromUrl} og legger til i databasen :clock12:`)
    console.log(
      `Henter data fra ${vatromUrl} og legger til i databasen :clock12:`
    );
    const vatromdata = await scrapeVatromgodkjenning(vatromUrl);
    console.log(`Henting av data fra ${vatromUrl} ok!`);
    console.log(
      `Henter data fra ${arbeidstilsynetUrl} og legger til i databasen :clock12:`
    );
    const renholdsregisterdata = await hentRenholdsregisterdata(
      arbeidstilsynetUrl
    );
    console.log(
      `Henter data for Ekom ${ekomUrl} og legger til i databasen :clock12:`
    );
    const ekomdata = await hentEkomData(ekomUrl);
    // Sett data fra scraping
    const data = {
      sistOppdatert: Date.now(),
      vatromsregister: vatromdata,
      renholdsregister: renholdsregisterdata,
      ekomregister: {...ekomdata},
    };

    db.setState(data).write();

    const now = new Date();
    // slack.utvikling(`Scraping ferdig ${now.toLocaleDateString()} kl. ${now.toLocaleTimeString()}. La til ${vatromdata.length} bedrifter fra våtromsregisteret og ${mesterbrevdata.length} fra mesterbrevregisteret i databasen.`);
    console.log(
      `Scraping ferdig ${now.toLocaleDateString()} kl. ${now.toLocaleTimeString()}. La til ${
        vatromdata.length
      } bedrifter fra våtromsregisteret, ${
        renholdsregisterdata.length
      } fra renholdsregisteret og ${
        ekomdata.length
      } bedrifter for Ekom i databasen.`
    );
    return data;
  } catch (e) {
    console.log(e);
    slack.utvikling(
      `:fire: Det var problemer med scraping av ${vatromUrl}. Det bør sees på... :bug:`
    );
    slack.utvikling(`Stacktrace: ${JSON.stringify(e)}`);
  }
}

// Må repopulere databasen når vi deployer appen
if (db.get("vatromsregister").size().value() === 0) {
  scrapeAndPopulateDb();
}

async function hentRenholdsregisterdata(url: string) {
  const rawXml = await rp.get(url);
  const parsedJson = parser.toJson(rawXml, {object: true});
  return parsedJson.Register.Virksomhet;
}

async function scrapeVatromgodkjenning(url) {
  const htmlString = await rp.get(url);
  const $ = cheerio.load(htmlString);
  const result = [];
  const virksomheter = $("#table_company tbody tr");
  virksomheter.map((index, element) => {
    const tabledata = $(element).find("td");
    const data = [];
    tabledata.each((i, elem) => {
      const text = $(elem).text();
      if (text.length > 0 && text !== "Vis info") {
        data.push($(elem).text());
      }
    });

    const erMobnr = new RegExp(/^\d{2} \d{2} \d{2} \d{2}$/);
    const erOrgnr = new RegExp(/^\d{9}$/);
    const navn = data[0];
    const bransje = data[3];
    const orgData = data.reduce(
      function (prev, next) {
        if (erMobnr.test(next.trim())) {
          return {
            ...prev,
            mobnr: next,
          };
        } else if (next.includes("@")) {
          return {
            ...prev,
            epost: next,
          };
        } else if (next.startsWith("www")) {
          return {
            ...prev,
            nettside: next,
          };
        } else if (erOrgnr.test(next.trim())) {
          return {
            ...prev,
            orgnr: next,
          };
        }
        return prev;
      },
      {godkjent: true, navn, bransje}
    );

    result.push(orgData);
  });

  return result;
}

async function scrapeEnhetsregisterDetaljer(htmlString) {
  const $ = cheerio.load(htmlString);
  const result = {};
  const beskrivelse = $(".row");
  if (htmlString.includes("ble slettet")) {
    const sletteTekst = $("#pagecontent p").text();
    result.slettet = sletteTekst;
  }
  beskrivelse.map((index, element) => {
    const definisjon = $(element).find(".col-sm-4");
    const verdi = $(element).find(".col-sm-8");
    if (definisjon.length === verdi.length && definisjon.length > 0) {
      for (let i = 0; i < definisjon.length; i++) {
        const elem = definisjon[i];
        const verdiElem = verdi[i];
        const definisjonstekst = clean($(elem).text());
        const verditekst = clean($(verdiElem).text());
        result[definisjonstekst.replace(" ", "_").replace(":", "")] =
          verditekst;
      }
    }
  });

  return result;
}

async function hentEkomData(ekomUrl: string) {
  const htmlString = await rp.get(ekomUrl);
  const $ = cheerio.load(htmlString);
  const rows = $("#autorisasjonstabell tbody tr");
  const bedrifter = {
    KIA: [],
    TIA: [],
    RIA: [],
    ENA: [],
  };
  rows.map((_, td) => {
    const autorisasjonsnummer = $(td).children().eq(0).text();
    const kategori = $(td).children().eq(1).text();
    const firmanavn = $(td).children().eq(2).text();
    const organisasjonsnummer = $(td).children().eq(3).text();
    const underenhet = $(td).children().eq(4).text();
    const bedrift = {
      autorisasjonsnummer,
      kategori,
      firmanavn,
      organisasjonsnummer,
      underenhet,
    };
    bedrifter[bedrift.kategori].push(bedrift);
  });
  return bedrifter;
}

function clean(text) {
  const x = text.replace(/\n|\t|^\s+|\s+$/g, "");
  const y = x.replace("&nbsp;", " ");
  if (y.includes("Daglig leder")) {
    return "Daglig_leder";
  }
  return y;
}

export = {
  scrapeVatromgodkjenning,
  scrapeAndPopulateDb,
  scrapeEnhetsregisterDetaljer,
};
