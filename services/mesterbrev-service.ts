import {createClientAsync} from "soap";
const wsdlUrl =
  "https://mreg.mesterbrev.no/wsa/wsa1/wsdl?targetURI=urn:mbrev-org";

export const mesterbrevService = {
  hentMesterbrevdata: async function (firmanavn) {
    try {
      const client = await createClientAsync(wsdlUrl, {});
      const response = await new Promise((resolve, reject) => {
        return client.Kompetansesjekk(
          {
            pAksessKode: process.env.MESTERBREV_API_TOKEN,
            pFirmanavn: firmanavn,
          },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      });
      return response;
    } catch (error) {
      console.log("Klarte ikke hente mesterbrevsdata", error);
      return null;
    }
  },
};
