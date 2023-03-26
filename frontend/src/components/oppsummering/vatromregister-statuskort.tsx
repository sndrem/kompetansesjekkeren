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

function VatromregisterStatuskort(props: Props) {
  const orgnr = useOrgnrFraUrl();

  const {data} = trpc.kompetansesjekker.vatrom.useQuery(orgnr, {
    enabled: !!orgnr,
  });

  const erFeil = useHentToggle("feil_for_vatrom", false);

  if (erFeil) {
    return (
      <Feilmelding
        size={props.size}
        headerTekst="Fagrådet for våtrom"
        bodyTekst="Det er for øyeblikket ikke mulig å sjekke bedrifter i Fagrådet for våtrom."
      />
    );
  }

  if (!data) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>Fagrådet for våtrom</Message.Header>
        <p>Fant ingen data for {orgnr} hos Fagrådet for våtrom.</p>
      </Message>
    );
  }

  const tekst = data.godkjent
    ? `${data.navn} finnes i Fagrådet for våtrom ✅`
    : `${data} finnes ikke i Fagrådet for våtrom ❌.`;
  return (
    <Kort
      size={props.size}
      tittel="Fagrådet for våtrom"
      erOkStatus={data.godkjent}
      orgnr={orgnr}
    >
      <p>{tekst}</p>
      {data.nettside && (
        <a target="_blank" rel="noopener noreferrer" href={data.nettside}>
          {data.nettside}
        </a>
      )}
    </Kort>
  );
}

export default VatromregisterStatuskort;
