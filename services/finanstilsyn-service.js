const rp = require("request-promise");

const FINANSTILSYN_API_URL = "https://api.finanstilsynet.no/registry/v1";

const finanstilsynService = {
  hentDataForEnhet: async (orgnr) => {
    const query = `${FINANSTILSYN_API_URL}/legal-entities/search?query=${orgnr}`;
    const data = await rp.get(query);
    return JSON.parse(data);
  },
};

module.exports = finanstilsynService;
