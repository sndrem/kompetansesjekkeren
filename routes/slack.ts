import express from "express";
const slackRouter = express.Router();
import {slackNotifiyer} from "../alerting/slack";

slackRouter.post("/", function (req, res, next) {
  const organisasjonsnummer = req.body.organisasjonsnummer;
  if (organisasjonsnummer) {
    console.log("Lagrer organisasjonsnummer");
    slackNotifiyer.utvikling(
      `Nytt søk på organisasjonsnummer: ${organisasjonsnummer} - https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${organisasjonsnummer}`
    );
    res.status(200).json({status: "ok"});
  } else {
    res.status(400).json({
      status: "ikke ok",
      error: "Du må sende med organisasjonsnummer",
    });
  }
});

export {slackRouter};
