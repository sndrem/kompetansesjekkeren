require("dotenv").config();
var express = require('express');
var rp = require('request-promise');
var router = express.Router();
const db = require("../database/db");
const scraper = require("../scraper/scraper");
require("../cron-jobs/scrape-job");

const ENHETSREGISTERET_HOST_AND_PORT = 'https://data.brreg.no/enhetsregisteret/api/enheter';
const ARBEIDSTILSYNET_HOST_AND_PORT = 'https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/GetRecordSearchModel';
const SENTRAL_GODKJENNING_HOST_AND_PORT = 'https://sgregister.dibk.no/api/enterprises/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/update", function (req, res, next) {
  scraper.scrapeAndPopulateDb();
});

router.get("/sok", function (req, res, next) {
  if (!req.query.organisasjonsnummer) {
    res.status(400).json({ status: 400, message: "Du mangler query-param 'organisasjonsnummer'" });
  }
  const organisasjonsnummer = req.query.organisasjonsnummer;
  const enhetsregisteret = rp(`${ENHETSREGISTERET_HOST_AND_PORT}?organisasjonsnummer=${organisasjonsnummer}`);
  const arbeidstilsynet = rp(`${ARBEIDSTILSYNET_HOST_AND_PORT}?query=${organisasjonsnummer}`);
  const sentralgodkjenning = rp(`${SENTRAL_GODKJENNING_HOST_AND_PORT}${organisasjonsnummer}`, { simple: false });
  const vatrom = db.get("bedrifter").find({ orgnr: organisasjonsnummer }).value();
  console.log(vatrom);
  Promise
    .all([enhetsregisteret, arbeidstilsynet, sentralgodkjenning])
    .then(data => {
      const enhetsregisteret = data[0] ? JSON.parse(data[0])["_embedded"]["enheter"][0] : null;
      const arbeidstilsynet = data[1] && data[1] !== "[]" ? JSON.parse(data[1])[0] : null;
      let sentralgodkjenning = data[2] ? JSON.parse(data[2])["dibk-sgdata"] : null;

      if (sentralgodkjenning === "Retry later") {
        sentralgodkjenning = null;
      }

      res.json({
        enhetsregisteret: enhetsregisteret ? enhetsregisteret : null,
        arbeidstilsynet: arbeidstilsynet ? arbeidstilsynet : null,
        sentralgodkjenning: sentralgodkjenning ? sentralgodkjenning : null,
        vatromsregisteret: vatrom ? vatrom : null
      });

    })
    .catch(err => {
      console.log("Noe gikk gale", err);
      res.json(err);
    })
});

module.exports = router;
