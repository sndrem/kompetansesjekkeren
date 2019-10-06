const cheerio = require("cheerio");
const rp = require("request-promise");
const db = require("../database/db");
const slack = require("../alerting/slack").slackNotifiyer;

async function scrapeAndPopulateDb() {
    try {
        const vatromUrl = "http://www.ffv.no/finn-godkjent-vatromsbedrift";
        slack.bugs(`Henter data fra ${vatromUrl} og legger til i databasen :clock12:`)
        vatromdata = await scrapeVatromgodkjenning(vatromUrl);
        // Sett data fra scraping
        db.setState({
            sistOppdatert: Date.now(),
            bedrifter: vatromdata
        }).write();

        const now = new Date();
        slack.bugs(`Scraping ferdig ${now.toLocaleDateString()} kl. ${now.toLocaleTimeString()}. La til ${vatromdata.length} bedrifter i databasen.`);
    } catch (e) {
        slack.bugs(`:fire: Det var problemer med scraping av ${vatromUrl}. Det bør sees på... :bug:`);
    }
}

// Må repopulere databasen når vi deployer appen
if (db.get("bedrifter").size().value() === 0) {
    scrapeAndPopulateDb();
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