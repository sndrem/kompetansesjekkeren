import dotenv from "dotenv";
import rp from "request-promise";
import parser from "xml2json";
import {z} from "zod";
import "../cron-jobs/scrape-job";
import {db} from "../database/db";
import scraper from "../scraper/scraper";
import {elvirksomhetsregisterService} from "../services/elvirksomhetsregister-service";
import {enhetsregisterService} from "../services/enhetsregister-service";
import {finanstilsynService} from "../services/finanstilsyn-service";
import {mesterbrevService} from "../services/mesterbrev-service";
dotenv.config();

import {slackNotifyer} from "../alerting/slack";
import {publicProcedure, router} from "../trpc";
import {
  RenholdsregisterOrganisasjon,
  VatromregisterResultat,
} from "../types/domain";

const HarOrgNr = z.string().length(9);

export const kompetansesjekkerRouter = router({
  update: publicProcedure.mutation(async (req) => {
    console.log("Scraper og populerer database");
    const data = await scraper.scrapeAndPopulateDb();
    return {status: "Update OK", data};
  }),
  enhetsregisteret: publicProcedure.input(HarOrgNr).query(async (req) => {
    const {input} = req;
    console.log(`Søker etter enhet med orgnr: ${input}`);
    return await enhetsregisterService.hentEnhetsdata(input);
  }),
  enhetsregisteretDetaljer: publicProcedure
    .input(HarOrgNr)
    .query(async (req) => {
      const {input} = req;
      const dataFraEnhetsregister = await enhetsregisterService.hentEnhetsdata(
        input
      );
      const enhet = await enhetsregisterService.hentDetaljer(input);
      if (!enhet) {
        throw new Error(`Fant ikke enhet med orgnr: ${input}`);
      }
      const detaljer = await scraper.scrapeEnhetsregisterDetaljer(enhet);
      const mergedData = {...dataFraEnhetsregister, detaljer};
      return mergedData;
    }),
  finanstilsynet: publicProcedure.input(HarOrgNr).query(async (req) => {
    const {input} = req;
    return await finanstilsynService.hentDataForEnhet(input);
  }),
  elvirksomhetsregisteret: publicProcedure
    .input(HarOrgNr)
    .query(async (req) => {
      const {input} = req;
      return await elvirksomhetsregisterService.sokEtterVirksomhet(input);
    }),
  vatrom: publicProcedure.input(HarOrgNr).query(async (req) => {
    const {input} = req;
    const vatrom = db.get("vatromsregister").find({orgnr: input}).value();
    if (!vatrom) {
      console.log(`Fant ingen bedrift for orgnr: ${input} i Våtromsregisteret`);
      return null;
    } else {
      return vatrom as VatromregisterResultat;
    }
  }),
  renholdsregisteret: publicProcedure.input(HarOrgNr).query(async (req) => {
    const {input} = req;
    const enhet = await enhetsregisterService.hentEnhetsdata(input);
    // Hvis man har søkt på et org.nr som egentlig tilhører en overordnet enhet
    if (enhet) {
      const utledetdOrgnr =
        enhet && enhet.overordnetEnhet ? enhet.overordnetEnhet : input;
      let arbeidstilsynetHovedenhet = await db
        .get("renholdsregister")
        .find({
          Hovedenhet: {
            Organisasjonsnummer: utledetdOrgnr,
          },
        })
        .value();

      if (!arbeidstilsynetHovedenhet) {
        // Sjekk underenheter
        arbeidstilsynetHovedenhet = await db
          .get("renholdsregister")
          .find({
            Underenhet: {
              Avdeling: {
                Organisasjonsnummer: utledetdOrgnr,
              },
            },
          })
          .value();
      }

      return arbeidstilsynetHovedenhet
        ? (arbeidstilsynetHovedenhet as RenholdsregisterOrganisasjon)
        : null;
    } else {
      return null;
    }
  }),
  sentralgodkjenning: publicProcedure.input(HarOrgNr).query(async (req) => {
    const {input} = req;
    console.log(
      `Søker etter enhet hos Sentral godkjenning med orgnr: ${input}`
    );
    const SENTRAL_GODKJENNING_HOST_AND_PORT =
      "https://sgregister.dibk.no/api/enterprises/";
    const sentralgodkjenning = rp(
      `${SENTRAL_GODKJENNING_HOST_AND_PORT}${input}`,
      {simple: false}
    );

    try {
      const data = await sentralgodkjenning;
      if (!data) {
        console.log(
          `Fant ingen data hos sentral godkjenning for orgnr: ${input}`
        );
        return null;
      }
      try {
        return JSON.parse(data)["dibk-sgdata"];
      } catch (error) {
        console.log("Klarte ikke hente data fra sentralgodkjenning", error);
        slackNotifyer.utvikling(
          `Klarte ikke hente data fra sentral godkjenning for orgnr: ${input}`
        );
        return null;
      }
    } catch (err) {
      console.log("Klarte ikke hente data fra sentral godkjenning", err);
      return null;
    }
  }),
  mesterbrev: publicProcedure.input(HarOrgNr).query(async (req) => {
    const {input} = req;
    const enhet = await enhetsregisterService.hentEnhetsdata(input);
    if (enhet) {
      const {navn}: {navn: string} = enhet;
      const data: any = await mesterbrevService.hentMesterbrevdata(navn);

      if (data && data.hasOwnProperty("pResultat")) {
        const parsedJson = parser.toJson(data.pResultat, {object: true});
        const orgNrFraMesterbrev = parsedJson?.Firmaliste?.Firma?.OrgNr ?? "";
        if (orgNrFraMesterbrev === input) {
          return {navn: navn, harMesterbrev: true};
        } else {
          console.warn(`Fant ikke bedrift med orgnr: ${input} hos Mesterbrev`);
          return null;
        }
      } else {
        return null;
      }
    } else {
      console.warn("Fant ingen enheter i Brreg med orgnr: ", input);
      return null;
    }
  }),
});
