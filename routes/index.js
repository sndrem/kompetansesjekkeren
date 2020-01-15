var express = require("express");
var rp = require("request-promise");
var router = express.Router();
const db = require("../database/db");
const scraper = require("../scraper/scraper");
const dbService = require("../services/db-service");
const slack = require("../alerting/slack").slackNotifiyer;
require("../cron-jobs/scrape-job");

const ENHETSREGISTERET_HOST_AND_PORT =
  "https://data.brreg.no/enhetsregisteret/api/enheter";

const SENTRAL_GODKJENNING_HOST_AND_PORT =
  "https://sgregister.dibk.no/api/enterprises/";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/update", async function (req, res, next) {
  const response = await scraper.scrapeAndPopulateDb();
  res.json({ status: "Update OK", data: response });
});

router.get("/sok", function (req, res, next) {
  if (!req.query.organisasjonsnummer) {
    res.status(400).json({
      status: 400,
      message: "Du mangler query-param 'organisasjonsnummer'"
    });
  }

  const organisasjonsnummer = req.query.organisasjonsnummer;
  dbService.lagreSok(organisasjonsnummer, null);
  slack.utvikling(`Nytt søk på organisasjonsnummer: ${organisasjonsnummer} - https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${organisasjonsnummer}`);

  const enhetsregisteret = rp(
    `${ENHETSREGISTERET_HOST_AND_PORT}?organisasjonsnummer=${organisasjonsnummer}`
  );
  const sentralgodkjenning = rp(
    `${SENTRAL_GODKJENNING_HOST_AND_PORT}${organisasjonsnummer}`,
    { simple: false }
  );

  const arbeidstilsynet = db.get("renholdsregister").find({ Organisasjonsnummer: organisasjonsnummer }).value();
  const vatrom = db
    .get("bedrifter")
    .find({ orgnr: organisasjonsnummer })
    .value();

  Promise.all([enhetsregisteret, sentralgodkjenning])
    .then(data => {
      let enhetsregisteret = null;

      try {
        enhetsregisteret = JSON.parse(data[0])["_embedded"]["enheter"][0]
      } catch (error) {
        console.log("Klarte ikke hente data fra enhetsregisteret", error);
        slack.utvikling(`Klarte ikke hente data fra enhetsregisteret for orgnr: ${organisasjonsnummer}`);
        enhetsregisteret = null;
      }

      let sentralgodkjenning = null;
      try {
        sentralgodkjenning = JSON.parse(data[1])["dibk-sgdata"];
      } catch (error) {
        console.log("Klarte ikke hente data fra sentralgodkjenning", error);
        slack.utvikling(`Klarte ikke hente data fra sentral godkjenning for orgnr: ${organisasjonsnummer}`);
        sentralgodkjenning = null;
      }
      let mesterbrev = null;
      // Hent ut navn fra enhetsregisteret og sjekk mot mesterbrev
      if (enhetsregisteret) {
        const { navn } = enhetsregisteret;
        const mesterbrevData = db
          .get("mesterbrev")
          .find({ bedrift: navn.toUpperCase() })
          .value();
        if (mesterbrevData) {
          // Vi fant en match!
          mesterbrev = mesterbrevData;
        }
      }

      if (sentralgodkjenning === "Retry later") {
        slack.utvikling(`Sentral godkjenning melder om 'Retry later'...`);
        sentralgodkjenning = null;
      }

      res.json({
        enhetsregisteret: enhetsregisteret ? enhetsregisteret : null,
        arbeidstilsynet: arbeidstilsynet ? arbeidstilsynet : null,
        sentralgodkjenning: sentralgodkjenning,
        vatromsregisteret: vatrom ? vatrom : null,
        mesterbrev: mesterbrev ? mesterbrev : null
      });
    })
    .catch(err => {
      console.log("Noe gikk gale ved henting av data", err);
      res.status(500).json({ error: err.toString() });
    });
});

module.exports = router;
