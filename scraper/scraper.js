const cheerio = require("cheerio");
const rp = require("request-promise");
const db = require("../database/db");
const slack = require("../alerting/slack").slackNotifiyer;
const parser = require("xml2json");

async function scrapeAndPopulateDb() {
    const vatromUrl = "http://www.ffv.no/finn-godkjent-vatromsbedrift";
    const mesterbrevUrl = "https://mreg.nhosp.no/scripts/cgiip.wsc/web/search.html";
    const arbeidstilsynetUrl = "https://www.arbeidstilsynet.no/opendata/renhold.xml";
    try {
        // slack.utvikling(`Henter data fra ${vatromUrl} og legger til i databasen :clock12:`)
        console.log(`Henter data fra ${vatromUrl} og legger til i databasen :clock12:`);
        const vatromdata = await scrapeVatromgodkjenning(vatromUrl);
        const mesterbrevdata = await scrapeMesterbrevregisteret(mesterbrevUrl);
        const renholdsregisterdata = await hentRenholdsregisterdata(arbeidstilsynetUrl);
        // Sett data fra scraping
        const data = {
            sistOppdatert: Date.now(),
            bedrifter: vatromdata,
            mesterbrev: mesterbrevdata,
            renholdsregister: renholdsregisterdata
        }

        db.setState(data).write();

        const now = new Date();
        // slack.utvikling(`Scraping ferdig ${now.toLocaleDateString()} kl. ${now.toLocaleTimeString()}. La til ${vatromdata.length} bedrifter fra våtromsregisteret og ${mesterbrevdata.length} fra mesterbrevregisteret i databasen.`);
        console.log(`Scraping ferdig ${now.toLocaleDateString()} kl. ${now.toLocaleTimeString()}. La til ${vatromdata.length} bedrifter fra våtromsregisteret, ${mesterbrevdata.length} fra mesterbrevregisteret og ${renholdsregisterdata.length} fra renholdsregisteret i databasen.`);
        return data;
    } catch (e) {
        console.log(e);
        slack.utvikling(`:fire: Det var problemer med scraping av ${vatromUrl}. Det bør sees på... :bug:`);
        slack.utvikling(`Stacktrace: ${JSON.stringify(e)}`);
    }
}

// Må repopulere databasen når vi deployer appen
if (db.get("bedrifter").size().value() === 0) {
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


async function scrapeMesterbrevregisteret(url) {
    const htmlString = await getHtmlString(url);
    const $ = cheerio.load(htmlString);
    const areas = $("#area option");

    const omrader = hentOmradekoderForMesterbrev($, areas);

    const promises = omrader.map(async (omr) => {
        const { kode } = omr;
        const data = await hentMestereFraOmrade(kode);
        return data;
    });

    const data = await Promise.all(promises);
    return data.flatMap(d => d);
}


async function hentMestereFraOmrade(omradeid) {
    const options = {
        method: 'POST',
        uri: 'https://mreg.nhosp.no/scripts/cgiip.wsc/web/search.html',
        encoding: "binary",
        form: {
            area: omradeid,
            noshow: 'alternativt',
            search_type: 'form',
            text_s: '',
            search_type_alt: 'firm',
            buisness: '0'
        }
    };

    return await rp(options)
        .then(async data => {
            return await parseMestereFraOmrade(data);
        })
        .catch(err => {
            console.log("Kunne ikke hente data fra område", err);
            return [];
        });

}

async function parseMestereFraOmrade(html) {
    const $ = cheerio.load(html);
    const mestere = $("table.result tr");
    const results = [];
    mestere.map((index, element) => {
        const rader = $(element).find("td");
        const data = [];
        rader.each((index, rad) => {
            data.push($(rad).text())
        })
        if (data.length > 0) {
            const [sted, bedrift, tlf, ...rest] = data;
            results.push({
                sted,
                bedrift,
                tlf
            })
        }
    });
    return results;
}

function hentOmradekoderForMesterbrev($, html) {
    const omradekoder = [];
    html.map((index, element) => {
        const htmlElement = $(element);
        const areacode = htmlElement.attr("value");

        // Hent bare ut verdier som slutter på 00
        if (areacode.endsWith("00")) {
            const omrade = htmlElement.text();
            omradekoder.push({
                kode: parseInt(areacode),
                omrade
            })
        }
    });
    return omradekoder;
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
            if ($(elem).text().length > 0) {
                data.push($(elem).text());
            }
        })
        const [bedriftsnavn,
            fylke,
            poststed,
            _,
            typeVirksomhet,
            orgnr,
            adresse,
            tlf,
            nettside,
            navn,
            epost,
            mobnr
        ] = data;

        const virksomhetsdata = {
            bedriftsnavn,
            fylke,
            poststed,
            typeVirksomhet,
            orgnr,
            adresse,
            tlf,
            nettside,
            navn,
            epost,
            mobnr,
            godkjent: true
        }
        result.push(virksomhetsdata);
    });

    return result;
}

module.exports = { scrapeVatromgodkjenning, scrapeAndPopulateDb };