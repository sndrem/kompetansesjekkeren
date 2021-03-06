import React, { useContext } from "react";
import { Message, MessageSizeProp } from "semantic-ui-react";
import useSWR from "swr";
import { useHentToggle } from "../../featureToggles/client";
import { SOK_VATROM } from "../../konstanter";
import { StateContext } from "../../pages/sokpage";
import { Appstate, VatromregisterResultat } from "../../types/domain";
import { genererSokeurl } from "../../utils/utils";
import Feilmelding from "../feilmeldinger/feilmelding";
import Kort from "./kort";

interface Props {
  size: MessageSizeProp;
}

function VatromregisterStatuskort(props: Props) {
  const state = useContext<Appstate>(StateContext);
  const { orgnr } = state;

  const { data } = useSWR<VatromregisterResultat>(
    genererSokeurl(SOK_VATROM, orgnr)
  );

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
        <p>Fant ingen data for {state.orgnr} hos Fagrådet for våtrom.</p>
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
      orgnr={state.orgnr}
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
