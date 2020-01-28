var express = require("express");
var router = express.Router();
const slack = require("../alerting/slack").slackNotifiyer;
const dbService = require("../services/db-service");

router.post("/", function (req, res, next) {
    const organisasjonsnummer = req.body.organisasjonsnummer;
    if (organisasjonsnummer) {
        console.log("Lagrer organisasjonsnummer");
        slack.utvikling(`Nytt søk på organisasjonsnummer: ${organisasjonsnummer} - https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${organisasjonsnummer}`);
        dbService.lagreSok(organisasjonsnummer, null);
        res.status(200).json({ status: "ok" });
    } else {
        res.status(400).json({ status: "ikke ok", error: "Du må sende med organisasjonsnummer" });
    }
});

router.post("/feedback", function (req, res, next) {
    const { type, tilbakemelding } = req.body;
    if (!type || !tilbakemelding) {
        res.status(400).json({ status: "ikke ok", "error": "Du må sende med type tilbakemelding og tilbakemeldingstekst" });
    }

    try {
        slack.utvikling(`Ny tilbakemelding av typen: ${type}: - ${tilbakemelding}`);
        res.status(200).json({ status: "ok" });
    } catch (err) {
        console.log("Klarte ikke sende tilbakemelding til Slack", err);
        res.status(500).json({ status: "ikke ok", error: "Klarte ikke sende tilbakemelding til Slack" });
    }
});


module.exports = router;