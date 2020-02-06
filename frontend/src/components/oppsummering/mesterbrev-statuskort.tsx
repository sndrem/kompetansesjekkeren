import React, { useContext } from "react";
import { Appstate, MesterbrevResultat } from "../../types/domain";
import { StateContext } from "../../pages/sokpage";
import { Message, MessageSizeProp } from "semantic-ui-react";
import Kort from "./kort";
import { SOK_MESTERBREV } from "../../konstanter";
import { useFetch } from "../../hooks/useFetch";
import { genererSokeurl } from "../../utils/utils";

interface Props {
  size: MessageSizeProp;
}

function MesterbrevStatuskort(props: Props) {
  const state = useContext<Appstate>(StateContext);
  const { orgnr } = state;
  const { response: resultat } = useFetch<MesterbrevResultat>(
    genererSokeurl(SOK_MESTERBREV, orgnr)
  );

  const problemer = true;
  if (problemer) {
    return (
      <Kort
        size={props.size}
        tittel="Mesterbrevsregisteret"
        erOkStatus={resultat !== null}
        orgnr={state.orgnr}
      >
        <p>Det er problemer med uthenting av data fra Mesterbrevsregisteret.</p>
        <a href="https://www.mesterbrev.no/sok-mesterregisteret/">
          Sjekk manuelt hos Mesterbrevregisteret
        </a>
      </Kort>
    );
  }

  if (!resultat) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>Mesterbrevsregisteret</Message.Header>
        <p>Fant ingen data for {state.orgnr} hos Mesterbrevsregisteret.</p>
      </Message>
    );
  }

  const tekst = `${resultat.bedrift} finnes i Mesterbrevsregisteret ✅`;
  return (
    <Kort
      size={props.size}
      tittel="Mesterbrevsregisteret"
      erOkStatus={resultat !== null}
      orgnr={state.orgnr}
    >
      <p>{tekst}</p>
    </Kort>
  );
}

export default MesterbrevStatuskort;
