var express = require("express");
var rp = require("request-promise");
var router = express.Router();
const db = require("../database/db");
const scraper = require("../scraper/scraper");
require("../cron-jobs/scrape-job");
const dbService = require("../services/db-service");
const slack = require("../alerting/slack").slackNotifiyer;

const ENHETSREGISTERET_HOST_AND_PORT =
  "https://data.brreg.no/enhetsregisteret/api/enheter";
const ARBEIDSTILSYNET_HOST_AND_PORT =
  "https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/GetRecordSearchModel";
const SENTRAL_GODKJENNING_HOST_AND_PORT =
  "https://sgregister.dibk.no/api/enterprises/";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/update", function (req, res, next) {
  scraper.scrapeAndPopulateDb();
  res.json({ status: "Update OK" });
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
  const arbeidstilsynet = rp(
    `${ARBEIDSTILSYNET_HOST_AND_PORT}?query=${organisasjonsnummer}`
  );
  const sentralgodkjenning = rp(
    `${SENTRAL_GODKJENNING_HOST_AND_PORT}${organisasjonsnummer}`,
    { simple: false }
  );
  const vatrom = db
    .get("bedrifter")
    .find({ orgnr: organisasjonsnummer })
    .value();

  Promise.all([enhetsregisteret, arbeidstilsynet, sentralgodkjenning])
    .then(data => {
      let enhetsregisteret = null;

      try {
        enhetsregisteret = JSON.parse(data[0])["_embedded"]["enheter"][0]
      } catch (error) {
        console.log("Klarte ikke hente data fra enhetsregisteret", error);
        slack.utvikling(`Klarte ikke hente data fra enhetsregisteret for orgnr: ${organisasjonsnummer}`);
        enhetsregisteret = null;
      }

      let arbeidstilsynet = null;

      try {
        arbeidstilsynet =
          data[1] && data[1] !== "[]" ? JSON.parse(data[1])[0] : null;
      } catch (error) {
        console.log("Klarte ikke hente data fra arbeidstilsynet", error);
        slack.utvikling(`Klarte ikke hente data fra arbeidstilsynet for orgnr: ${organisasjonsnummer}`);
        arbeidstilsynet = null;
      }
      let sentralgodkjenning = null;
      try {
        sentralgodkjenning = JSON.parse(data[2])["dibk-sgdata"];
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
        arbeidstilsynet: arbeidstilsynet,
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
