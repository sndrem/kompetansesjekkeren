const cheerio = require("cheerio");
const rp = require("request-promise");
const db = require("../database/db");
const slack = require("../alerting/slack").slackNotifiyer;
const parser = require("xml2json");

const vatromUrl = "http://www.ffv.no/finn-godkjent-vatromsbedrift";
const arbeidstilsynetUrl =
  "https://www.arbeidstilsynet.no/opendata/renhold.xml";
const mesterBrevKompetanseUrl =
  "http://www.kompetansesjekk.no/soekeresultat/?companyname=";

async function scrapeAndPopulateDb() {
  try {
    // slack.utvikling(`Henter data fra ${vatromUrl} og legger til i databasen :clock12:`)
    console.log(
      `Henter data fra ${vatromUrl} og legger til i databasen :clock12:`
    );
    const vatromdata = await scrapeVatromgodkjenning(vatromUrl);
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

async function getHtmlString(url) {
  return await rp.get(url);
}

async function hentRenholdsregisterdata(url) {
  const rawXml = await rp.get(url);
  const parsedJson = parser.toJson(rawXml, { object: true });
  return parsedJson.ArrayOfRenholdsvirksomhet.Renholdsvirksomhet;
}

async function scrapeKompetansesjekk(url) {
  const htmlString = await getHtmlString(url);
  const $ = cheerio.load(htmlString);
  const heading = $(".block-container .block-text h3").first().text();
  const certification = $(".block-container .block-text").first().text();
  return {
    heading,
    certification,
  };
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
      { godkjent: true, navn, bransje }
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
        result[
          definisjonstekst.replace(" ", "_").replace(":", "")
        ] = verditekst;
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
