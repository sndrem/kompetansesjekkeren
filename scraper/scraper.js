const cheerio = require("cheerio");
const rp = require("request-promise");
const db = require("../database/db");
const slack = require("../alerting/slack").slackNotifiyer;
const parser = require("xml2json");
const iconv = require("iconv");

const vatromUrl = "https://www.ffv.no/finn-godkjent-vatromsbedrift";
const arbeidstilsynetUrl =
  "https://www.arbeidstilsynet.no/opendata/renhold_register.xml";
const mesterBrevKompetanseUrl =
  "https://mreg.mesterbrev.no/scripts/mb.wsc/web/sengine.html";

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
    // Sett data fra scraping
    const data = {
      sistOppdatert: Date.now(),
      vatromsregister: vatromdata,
      renholdsregister: renholdsregisterdata,
    };

    db.setState(data).write();

    const now = new Date();
    // slack.utvikling(`Scraping ferdig ${now.toLocaleDateString()} kl. ${now.toLocaleTimeString()}. La til ${vatromdata.length} bedrifter fra våtromsregisteret og ${mesterbrevdata.length} fra mesterbrevregisteret i databasen.`);
    console.log(
      `Scraping ferdig ${now.toLocaleDateString()} kl. ${now.toLocaleTimeString()}. La til ${
        vatromdata.length
      } bedrifter fra våtromsregisteret og ${
        renholdsregisterdata.length
      } fra renholdsregisteret i databasen.`
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

async function postForm(options) {
  return await rp(options);
}

async function hentRenholdsregisterdata(url) {
  const rawXml = await rp.get(url);
  const parsedJson = parser.toJson(rawXml, {object: true});
  return parsedJson.Register.Virksomhet;
}

async function scrapeKompetansesjekk(url, navn) {
  try {
    const result = await rp(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "nb,en-US;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded; charset=utf-8",
        pragma: "no-cache",
        "upgrade-insecure-requests": "1",
        Referer: "https://mreg.mesterbrev.no/scripts/mb.wsc/web/sengine.html",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `valg=mb&text_s=${navn
        .replaceAll("Ø", "%D8")
        .replaceAll("ø", "%D8")
        .replaceAll("Æ", "%C6")
        .replaceAll("æ", "%C6")
        .replaceAll("Å", "%C5")
        .replaceAll("å", "%C5")
        .replaceAll(" ", "+")}`,
      method: "POST",
      encoding: null,
    });
    var ic = new iconv.Iconv("iso-8859-1", "utf-8");
    var buf = ic.convert(result);
    var utf8String = buf.toString("utf-8");
    console.log(utf8String);
    const $ = cheerio.load(utf8String);
    const name = $(".result tbody tr td").eq(2).text();
    return name;
  } catch (error) {
    console.log(
      "Det var problemer ved kobling til mesterbrevregisteret",
      error
    );
    return null;
  }
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

function clean(text) {
  const x = text.replace(/\n|\t|^\s+|\s+$/g, "");
  const y = x.replace("&nbsp;", " ");
  if (y.includes("Daglig leder")) {
    return "Daglig_leder";
  }
  return y;
}

module.exports = {
  scrapeVatromgodkjenning,
  scrapeAndPopulateDb,
  mesterBrevKompetanseUrl,
  scrapeKompetansesjekk,
  scrapeEnhetsregisterDetaljer,
};
