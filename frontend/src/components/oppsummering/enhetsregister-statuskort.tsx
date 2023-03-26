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

function EnhetsregisterStatuskort(props: Props) {
  const erFeil = useHentToggle("feil_for_enhetsregister", false);
  const orgnr = useOrgnrFraUrl();
  const data = trpc.kompetansesjekker.enhetsregisteret.useQuery(orgnr, {
    enabled: !!orgnr,
  });

  if (erFeil) {
    return (
      <Feilmelding
        size={props.size}
        headerTekst="Enhetsregisteret"
        bodyTekst="Det er for øyeblikket ikke mulig å sjekke bedrifter hos Enhetsregisteret."
      ></Feilmelding>
    );
  }

  const enhetsregisteret = data.data;
  if (!enhetsregisteret) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>Enhetsregisteret</Message.Header>
        <p>Fant ingen data for {orgnr} i Enhetsregisteret</p>
      </Message>
    );
  }

  const erMvaRegistrert = enhetsregisteret.registrertIMvaregisteret;
  const tekst = erMvaRegistrert
    ? `${enhetsregisteret.navn} er registrert i MVA-registeret ✅`
    : `${enhetsregisteret.navn} er ikke registrert i MVA-registeret ❌`;
  return (
    <Kort
      size={props.size}
      orgnr={orgnr}
      tittel="MVA-register (Brønnøysundregistrene)"
      erOkStatus={erMvaRegistrert ? true : false}
    >
      <p>{tekst}</p>
    </Kort>
  );
}

export default EnhetsregisterStatuskort;
