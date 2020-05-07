const rp = require("request-promise");

const ENHETSREGISTERET_HOST_AND_PORT_HOVEDENHETER =
  "https://data.brreg.no/enhetsregisteret/api/enheter";

const ENHETSREGISTERET_HOST_AND_PORT_UNDERENHETER =
  "https://data.brreg.no/enhetsregisteret/api/underenheter";

const enhetsregisterService = {
  hentEnhetsdata: async function (orgnr) {
    const hovedenhet = rp(
      `${ENHETSREGISTERET_HOST_AND_PORT_HOVEDENHETER}?organisasjonsnummer=${orgnr}`
    );

    const underenhet = rp(
      `${ENHETSREGISTERET_HOST_AND_PORT_UNDERENHETER}?organisasjonsnummer=${orgnr}`
    );

    try {
      const data = await hovedenhet;
      const parsed = JSON.parse(data);
      if (parsed["_embedded"] && parsed["_embedded"]["enheter"]) {
        return JSON.parse(data)["_embedded"]["enheter"][0];
      } else {
        // Prøv å lete i underenheter
        const data = await underenhet;
        const parsedUnderenhet = JSON.parse(data);
        if (
          parsedUnderenhet["_embedded"] &&
          parsedUnderenhet["_embedded"]["underenheter"]
        ) {
          return JSON.parse(data)["_embedded"]["underenheter"][0];
        }
        return null;
      }
    } catch (err) {
      console.log("Klarte ikke hente data fra enhetsregisteret", err);
      return null;
    }
  },

  hentDetaljer: async function (orgnr) {
    const url = `https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${orgnr}`;
    const response = rp(url);
    const data = await response;
    return data;
  },
};

module.exports = enhetsregisterService;
