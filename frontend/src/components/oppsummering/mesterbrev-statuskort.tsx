import React, { useContext } from "react";
import { Message, MessageSizeProp } from "semantic-ui-react";
import useSWR from "swr";
import { useHentToggle } from "../../featureToggles/client";
import { SOK_MESTERBREV } from "../../konstanter";
import { StateContext } from "../../pages/sokpage";
import { Appstate, MesterbrevResultat } from "../../types/domain";
import { genererSokeurl } from "../../utils/utils";
import Feilmelding from "../feilmeldinger/feilmelding";
import Kort from "./kort";

interface Props {
  size: MessageSizeProp;
}

function MesterbrevStatuskort(props: Props) {
  const state = useContext<Appstate>(StateContext);
  const { orgnr } = state;
  const { data } = useSWR<MesterbrevResultat>(
    genererSokeurl(SOK_MESTERBREV, orgnr)
  );

  const erFeil = useHentToggle("feil_for_mesterbrev", false);

  if (erFeil) {
    return (
      <Feilmelding
        size={props.size}
        headerTekst="Mesterbrevsregisteret"
        bodyTekst="Det er for øyeblikket ikke mulig å sjekke bedrifter hos Mesterbrevsregisteret"
      ></Feilmelding>
    );
  }

  if (!data) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>Mesterbrevsregisteret</Message.Header>
        <p>Fant ingen data for {state.orgnr} hos Mesterbrevsregisteret.</p>
      </Message>
    );
  }

  const tekst = `${data.navn} finnes i Mesterbrevsregisteret ✅`;
  return (
    <Kort
      size={props.size}
      tittel="Mesterbrevsregisteret"
      erOkStatus={data !== null}
      orgnr={state.orgnr}
    >
      <p>{tekst}</p>
    </Kort>
  );
}

export default MesterbrevStatuskort;
