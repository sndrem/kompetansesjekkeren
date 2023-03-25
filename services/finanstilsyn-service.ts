import rp from "request-promise";

const FINANSTILSYN_API_URL = "https://api.finanstilsynet.no/registry/v1";

export const finanstilsynService = {
  hentDataForEnhet: async (orgnr) => {
    const query = `${FINANSTILSYN_API_URL}/legal-entities/search?query=${orgnr}`;
    const data = await rp.get(query);
    return JSON.parse(data);
  },
};
