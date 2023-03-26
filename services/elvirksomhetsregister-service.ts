import {ElvirksomhetsregisterResult} from "../types/domain";

const rp = require("request-promise");

const DSB_SEARCH_URL =
  "https://elvirksomhetsregisteret.dsb.no/elreg/api/v1/electricianbusinesses/search";

export const elvirksomhetsregisterService = {
  sokEtterVirksomhet: async function (
    orgnr: string
  ): Promise<ElvirksomhetsregisterResult | null> {
    try {
      const response = await rp(
        "https://elvirksomhetsregisteret.dsb.no/elreg/api/v1/electricianbusinesses/search",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "nb,en-US;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            "referrer-policy": "strict-origin-when-cross-origin",
            "sec-ch-ua": '"Not A(Brand";v="24", "Chromium";v="110"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            Referer: `https://elvirksomhetsregisteret.dsb.no/elreg-ui/search?term=${orgnr}`,
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          body: `{"term":"${orgnr}","taskTypes":[],"facilityTypes":[],"equipmentTypes":[],"skipped":0,"hitsToReturn":10}`,
          method: "POST",
        }
      );
      return JSON.parse(response);
    } catch (error) {
      console.log(
        "Klarte ikke søke etter virksomhet i Elvirksomhetsregisteret"
      );
      return null;
    }
  },
};
