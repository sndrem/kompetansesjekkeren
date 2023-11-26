import express from "express";
const slackRouter = express.Router();
import {slackNotifyer} from "../alerting/slack";
import {publicProcedure, router} from "../trpc";
import z from "zod";

export const slackRouterV2 = router({
  message: publicProcedure
    .input(z.object({message: z.string()}))
    .mutation(async (req) => {
      slackNotifyer.utvikling(req.input.message);
    }),
});

slackRouter.post("/", async function (req, res, next) {
  const organisasjonsnummer = req.body.organisasjonsnummer;
  if (organisasjonsnummer) {
    console.log("Sender melding om søk på orgnr til Slack");
    slackNotifyer.utvikling(
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
