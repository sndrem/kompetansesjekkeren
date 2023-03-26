import rp from "request-promise";
import {FinanstilsynResultat} from "../types/domain";

const FINANSTILSYN_API_URL = "https://api.finanstilsynet.no/registry/v1";

export const finanstilsynService = {
  hentDataForEnhet: async (orgnr): Promise<FinanstilsynResultat> => {
    const query = `${FINANSTILSYN_API_URL}/legal-entities/search?query=${orgnr}`;
    const data = await rp.get(query);
    return JSON.parse(data);
  },
};
