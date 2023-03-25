var express = require("express");
var rp = require("request-promise");
import {db} from "../database/db";
import scraper from "../scraper/scraper";
import {enhetsregisterService} from "../services/enhetsregister-service";
import {finanstilsynService} from "../services/finanstilsyn-service";
import {elvirksomhetsregisterService} from "../services/elvirksomhetsregister-service";
import {mesterbrevService} from "../services/mesterbrev-service";
import parser from "xml2json";
import {initTRPC} from "@trpc/server";
import {z} from "zod";
require("dotenv").config();

import {router, publicProcedure} from "../trpc";

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
});

// router.get("/sok/enhetsregisteret/detaljer", async function (req, res, next) {
//   const orgnr = sjekkForOrganisasjonsnummer(req, res);
//   const dataFraEnhetsregister = await enhetsService.hentEnhetsdata(orgnr);
//   const enhet = await enhetsService.hentDetaljer(orgnr);
//   if (!enhet) {
//     res.status(404).send(`Fant ikke enhet med orgnr: ${orgnr}`);
//   }
//   const detaljer = await scraper.scrapeEnhetsregisterDetaljer(enhet);
//   const mergedData = {...dataFraEnhetsregister, detaljer};
//   res.json(mergedData);
// });

// const slack = require("../alerting/slack").slackNotifiyer;
// require("../cron-jobs/scrape-job");

// const SENTRAL_GODKJENNING_HOST_AND_PORT =
//   "https://sgregister.dibk.no/api/enterprises/";

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", {title: "Express"});
// });

// router.get("/update", async function (req, res, next) {
//   const response = await scraper.scrapeAndPopulateDb();
//   res.json({status: "Update OK", data: response});
// });

// router.get("/sok/enhetsregisteret/detaljer", async function (req, res, next) {
//   const orgnr = sjekkForOrganisasjonsnummer(req, res);
//   const dataFraEnhetsregister = await enhetsService.hentEnhetsdata(orgnr);
//   const enhet = await enhetsService.hentDetaljer(orgnr);
//   if (!enhet) {
//     res.status(404).send(`Fant ikke enhet med orgnr: ${orgnr}`);
//   }
//   const detaljer = await scraper.scrapeEnhetsregisterDetaljer(enhet);
//   const mergedData = {...dataFraEnhetsregister, detaljer};
//   res.json(mergedData);
// });

// router.get("/sok/sentralgodkjenning", async function (req, res, next) {
//   const orgnr = sjekkForOrganisasjonsnummer(req, res);
//   const sentralgodkjenning = rp(
//     `${SENTRAL_GODKJENNING_HOST_AND_PORT}${orgnr}`,
//     {simple: false}
//   );

//   try {
//     const data = await sentralgodkjenning;
//     if (!data) {
//       res.status(404).json({
//         status: 404,
//         message: "Fant ikke bedrift hos sentral godkjenning",
//         body: null,
//       });
//       return;
//     }
//     try {
//       sentralgodkjenningData = JSON.parse(data)["dibk-sgdata"];
//       res.json(sentralgodkjenningData);
//       return;
//     } catch (error) {
//       console.log("Klarte ikke hente data fra sentralgodkjenning", error);
//       slack.utvikling(
//         `Klarte ikke hente data fra sentral godkjenning for orgnr: ${orgnr}`
//       );
//       sentralgodkjenningData = null;
//       res.status(500).json({
//         status: 500,
//         message: "Klarte ikke hente data fra sentral godkjenning.",
//         body: null,
//       });
//       return;
//     }
//   } catch (err) {
//     res.status(500).json({
//       status: 500,
//       message: "Klarte ikke hente data fra sentral godkjenning.",
//       body: null,
//     });
//     return;
//   }
// });

// router.get("/sok/renholdsregisteret", async function (req, res, next) {
//   const orgnr = sjekkForOrganisasjonsnummer(req, res);
//   const enhet = await enhetsService.hentEnhetsdata(orgnr);
//   // Hvis man har søkt på et org.nr som egentlig tilhører en overordnet enhet
//   if (enhet) {
//     const utledetdOrgnr =
//       enhet && enhet.overordnetEnhet ? enhet.overordnetEnhet : orgnr;
//     let arbeidstilsynetHovedenhet = await db
//       .get("renholdsregister")
//       .find({
//         Hovedenhet: {
//           Organisasjonsnummer: utledetdOrgnr,
//         },
//       })
//       .value();

//     if (!arbeidstilsynetHovedenhet) {
//       // Sjekk undernheter
//       arbeidstilsynetHovedenhet = await db
//         .get("renholdsregister")
//         .find({
//           Underenhet: {
//             Avdeling: {
//               Organisasjonsnummer: utledetdOrgnr,
//             },
//           },
//         })
//         .value();
//     }
//     res.json(arbeidstilsynetHovedenhet);
//   } else {
//     res.json(null);
//   }
// });

// router.get("/sok/vatrom", function (req, res, next) {
//   const orgnr = sjekkForOrganisasjonsnummer(req, res);
//   const vatrom = db.get("vatromsregister").find({orgnr}).value();
//   if (!vatrom) {
//     res.status(404).json(null);
//   } else {
//     res.json(vatrom);
//   }
// });

// router.get("/sok/mesterbrev", async function (req, res, next) {
//   const orgnr = sjekkForOrganisasjonsnummer(req, res);
//   const enhet = await enhetsService.hentEnhetsdata(orgnr);
//   if (enhet) {
//     const {navn} = enhet;
//     mesterbrevService.hentMesterbrevdata(navn, (error, data) => {
//       if (error) {
//         console.log(
//           "Det skjedde en feil ved henting av data fra Mesterbrev",
//           error
//         );
//         res.json(null);
//       }

//       if (data && data.hasOwnProperty("pResultat")) {
//         const parsedJson = parser.toJson(data.pResultat, {object: true});
//         const orgNrFraMesterbrev = parsedJson?.Firmaliste?.Firma?.OrgNr ?? "";
//         if (orgNrFraMesterbrev === orgnr) {
//           res.json({navn, harMesterbrev: true});
//         } else {
//           console.warn(`Fant ikke bedrift med orgnr: ${orgnr} hos Mesterbrev`);
//           res.json(null);
//         }
//       }
//     });
//   } else {
//     console.warn("Fant ingen enheter i Brreg med orgnr: ", orgnr);
//     res.json(null);
//   }
// });

// router.get("/sok/finanstilsyn", async function (req, res, next) {
//   const org = sjekkForOrganisasjonsnummer(req, res);
//   const data = await finanstilsynService.hentDataForEnhet(org);
//   res.json(data);
// });

// router.get("/sok/elvirksomhetsregisteret", async function (req, res, next) {
//   const org = sjekkForOrganisasjonsnummer(req, res);
//   const data = await elvirksomhetsregisterService.sokEtterVirksomhet(org);
//   res.json(data);
// });

// module.exports = router;
