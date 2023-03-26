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

function ElvirksomhetsregisterStatuskort(props: Props) {
  const orgnr = useOrgnrFraUrl();
  const {data} = trpc.kompetansesjekker.elvirksomhetsregisteret.useQuery(
    orgnr,
    {enabled: !!orgnr}
  );

  const erFeil = useHentToggle("feil_for_elvirksomhetsregisteret", false);

  if (erFeil) {
    return (
      <Feilmelding
        size={props.size}
        headerTekst="DSB - Elvirksomhetsregister"
        bodyTekst={
          <>
            <p>
              Det er for øyeblikket ikke mulig å sjekke bedrifter hos DSBs
              Elvirksomhetsregister
            </p>
          </>
        }
      ></Feilmelding>
    );
  }

  if (!data || data?.hits.length === 0) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>Elvirksomhetsregister</Message.Header>
        <p>Fant ingen data for {orgnr} hos Elvirksomhetsregisteret.</p>
      </Message>
    );
  }
  const bedrift = data?.hits?.[0];
  const tekst = bedrift
    ? `${bedrift.name} finnes i Elvirksomhetsregisteret`
    : `Fant ingen data for ${orgnr} hos Elvirksomhetsregisteret`;
  return (
    <Kort
      size={props.size}
      tittel="DSB - Elvirksomhetsregisteret"
      erOkStatus={bedrift !== null}
      orgnr={orgnr}
    >
      <p>{tekst}</p>
    </Kort>
  );
}

export default ElvirksomhetsregisterStatuskort;
