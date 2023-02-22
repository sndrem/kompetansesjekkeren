var express = require("express");
var rp = require("request-promise");
var router = express.Router();
const db = require("../database/db");
const scraper = require("../scraper/scraper");
const enhetsService = require("../services/enhetsregister-service");
const finanstilsynService = require("../services/finanstilsyn-service");
const elvirksomhetsregisterService = require("../services/elvirksomhetsregister-service");
const {mesterBrevKompetanseUrl} = require("../scraper/scraper");

const slack = require("../alerting/slack").slackNotifiyer;
require("../cron-jobs/scrape-job");

const SENTRAL_GODKJENNING_HOST_AND_PORT =
  "https://sgregister.dibk.no/api/enterprises/";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {title: "Express"});
});

router.get("/update", async function (req, res, next) {
  const response = await scraper.scrapeAndPopulateDb();
  res.json({status: "Update OK", data: response});
});

function sjekkForOrganisasjonsnummer(req, res) {
  if (!req.query.organisasjonsnummer) {
    res.status(400).json({
      status: 400,
      message: "Du mangler query-param 'organisasjonsnummer'",
    });
  } else {
    return req.query.organisasjonsnummer;
  }
}

router.get("/sok/enhetsregisteret", async function (req, res, next) {
  const orgnr = sjekkForOrganisasjonsnummer(req, res);
  const enhet = await enhetsService.hentEnhetsdata(orgnr);
  res.json(enhet);
});

router.get("/sok/enhetsregisteret/detaljer", async function (req, res, next) {
  const orgnr = sjekkForOrganisasjonsnummer(req, res);
  const dataFraEnhetsregister = await enhetsService.hentEnhetsdata(orgnr);
  const enhet = await enhetsService.hentDetaljer(orgnr);
  if (!enhet) {
    res.status(404).send(`Fant ikke enhet med orgnr: ${orgnr}`);
  }
  const detaljer = await scraper.scrapeEnhetsregisterDetaljer(enhet);
  const mergedData = {...dataFraEnhetsregister, detaljer};
  res.json(mergedData);
});

router.get("/sok/sentralgodkjenning", async function (req, res, next) {
  const orgnr = sjekkForOrganisasjonsnummer(req, res);
  const sentralgodkjenning = rp(
    `${SENTRAL_GODKJENNING_HOST_AND_PORT}${orgnr}`,
    {simple: false}
  );

  try {
    const data = await sentralgodkjenning;
    if (!data) {
      res.status(404).json({
        status: 404,
        message: "Fant ikke bedrift hos sentral godkjenning",
        body: null,
      });
      return;
    }
    try {
      sentralgodkjenningData = JSON.parse(data)["dibk-sgdata"];
      res.json(sentralgodkjenningData);
      return;
    } catch (error) {
      console.log("Klarte ikke hente data fra sentralgodkjenning", error);
      slack.utvikling(
        `Klarte ikke hente data fra sentral godkjenning for orgnr: ${orgnr}`
      );
      sentralgodkjenningData = null;
      res.status(500).json({
        status: 500,
        message: "Klarte ikke hente data fra sentral godkjenning.",
        body: null,
      });
      return;
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Klarte ikke hente data fra sentral godkjenning.",
      body: null,
    });
    return;
  }
});

router.get("/sok/renholdsregisteret", async function (req, res, next) {
  const orgnr = sjekkForOrganisasjonsnummer(req, res);
  const enhet = await enhetsService.hentEnhetsdata(orgnr);
  // Hvis man har søkt på et org.nr som egentlig tilhører en overordnet enhet
  if (enhet) {
    const utledetdOrgnr =
      enhet && enhet.overordnetEnhet ? enhet.overordnetEnhet : orgnr;
    let arbeidstilsynetHovedenhet = await db
      .get("renholdsregister")
      .find({
        Hovedenhet: {
          Organisasjonsnummer: utledetdOrgnr,
        },
      })
      .value();

    if (!arbeidstilsynetHovedenhet) {
      // Sjekk undernheter
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
    res.json(arbeidstilsynetHovedenhet);
  } else {
    res.json(null);
  }
});

router.get("/sok/vatrom", function (req, res, next) {
  const orgnr = sjekkForOrganisasjonsnummer(req, res);
  const vatrom = db.get("vatromsregister").find({orgnr}).value();
  if (!vatrom) {
    res.status(404).json(null);
  } else {
    res.json(vatrom);
  }
});

router.get("/sok/mesterbrev", async function (req, res, next) {
  const orgnr = sjekkForOrganisasjonsnummer(req, res);
  const enhet = await enhetsService.hentEnhetsdata(orgnr);
  if (enhet) {
    const {navn} = enhet;
    console.log("Scraper", `${mesterBrevKompetanseUrl}`);
    const navnFraMesterregister = await scraper.scrapeKompetansesjekk(
      `${mesterBrevKompetanseUrl}`,
      navn
    );

    if (!navnFraMesterregister) {
      console.log("Fant ikke navn hos Mesterregisteret");
      res.status(500).json(null);
      return;
    }

    const fantMester = navnFraMesterregister
      .toLowerCase()
      .includes(navn.toLowerCase());

    if (fantMester) {
      // Vi fant en match!
      res.json({navn, harMesterbrev: true});
    } else {
      console.warn(
        `Fant ingen match mellom enhetsnavn fra Brreg og Mesterbrevregisteret for orgnr: ${orgnr}`
      );
      res.json(null);
    }
  } else {
    console.warn("Fant ingen enheter i Brreg med orgnr: ", orgnr);
    res.json(null);
  }
});

router.get("/sok/finanstilsyn", async function (req, res, next) {
  const org = sjekkForOrganisasjonsnummer(req, res);
  const data = await finanstilsynService.hentDataForEnhet(org);
  res.json(data);
});

router.get("/sok/elvirksomhetsregisteret", async function (req, res, next) {
  const org = sjekkForOrganisasjonsnummer(req, res);
  const data = await elvirksomhetsregisterService.sokEtterVirksomhet(org);
  res.json(data);
});

router.get("/update/mesterbrev", async function (req, res, next) {
  scraper.scrapeMesterbrevregisteret(mesterbrevUrl);
  res.json({});
});

module.exports = router;
