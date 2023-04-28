import React from "react";
import {Message, MessageSizeProp} from "semantic-ui-react";
import {trpc} from "../../api/trpcApi";
import {useHentToggle} from "../../featureToggles/client";
import {useOrgnrFraUrl} from "../../hooks/useOrgnrFraUrl";
import Feilmelding from "../feilmeldinger/feilmelding";
import Kort from "./kort";

interface Props {
  size: MessageSizeProp;
}

function EnaRegisterStatusKort(props: Props) {
  const registernavn = "Ekomnettautorisasjoner";
  const orgnr = useOrgnrFraUrl();

  const {data} = trpc.kompetansesjekker.ekomregisteret.useQuery(
    {
      orgnr: orgnr,
      kategori: "ENA",
    },
    {
      enabled: !!orgnr,
    }
  );

  const erFeil = useHentToggle("feil_for_ekomregister", false);

  if (erFeil) {
    return (
      <Feilmelding
        size={props.size}
        headerTekst={registernavn}
        bodyTekst={`Det er for øyeblikket ikke mulig å sjekke ${registernavn}`}
      />
    );
  }

  if (!data) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>{registernavn}</Message.Header>
        <p>
          Fant ingen data for {orgnr} hos {registernavn}
        </p>
      </Message>
    );
  }

  const tekst = data
    ? `${data.firmanavn} har ekomnettautorisasjon ✅`
    : `${orgnr} har ingen ekomnettautorisasjon ❌.`;
  return (
    <Kort
      size={props.size}
      tittel={registernavn}
      erOkStatus={!!data}
      orgnr={orgnr}
    >
      <p>{tekst}</p>
    </Kort>
  );
}

export default EnaRegisterStatusKort;
