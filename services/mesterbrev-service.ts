import soap from "soap";
const wsdlUrl =
  "https://mreg.mesterbrev.no/wsa/wsa1/wsdl?targetURI=urn:mbrev-org";

export const mesterbrevService = {
  hentMesterbrevdata: async function (firmanavn, cb) {
    try {
      const client = await soap.createClientAsync(wsdlUrl, {});
      client.Kompetansesjekk(
        {
          pAksessKode: process.env.MESTERBREV_API_TOKEN,
          pFirmanavn: firmanavn,
        },
        cb
      );
    } catch (error) {
      console.log("Klarte ikke hente mesterbrevsdata", error);
      return null;
    }
  },
};
