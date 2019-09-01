var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/enhetsregisteret", function (req, res, next) {
  const ENHETSREGISTERET_HOST_AND_PORT = 'https://data.brreg.no/enhetsregisteret/api/enheter';
  const organisasjonsnummer = req.query.organisasjonsnummer;
  request(`${ENHETSREGISTERET_HOST_AND_PORT}?organisasjonsnummer=${organisasjonsnummer}`, function (err, response, body) {
    if (err) {
      res.error("Kunne ikke hente data fra Enhetsregisteret", err);
    }
    res.json(body);
  });
});

router.get("/arbeidstilsynet", function (req, res, next) {
  const ARBEIDSTILSYNET_HOST_AND_PORT = 'https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/GetRecordSearchModel';
  const organisasjonsnummer = req.query.organisasjonsnummer;
  request(`${ARBEIDSTILSYNET_HOST_AND_PORT}?query=${organisasjonsnummer}`, function (err, response, body) {
    if (err) {
      res.error("Kunne ikke hente data fra Arbeidstilsynet", err);
    }
    res.json(body);
  });
});

router.get("/sentralgodkjenning", function (req, res, next) {
  const SENTRAL_GODKJENNING_HOST_AND_PORT = 'https://sgregister.dibk.no/api/enterprises/';
  const organisasjonsnummer = req.query.organisasjonsnummer;
  request(`${SENTRAL_GODKJENNING_HOST_AND_PORT}/${organisasjonsnummer}`, function (err, response, body) {
    if (err) {
      res.error("Kunne ikke hente data fra Sentral godkjenning", err);
    }
    res.json(body);
  });
});

module.exports = router;
