import React, { useContext } from "react";
import { Message, MessageSizeProp } from "semantic-ui-react";
import useSWR from "swr";
import { loggKlikk } from "../../analytics/google-analytics";
import { useHentToggle } from "../../featureToggles/client";
import { SOK_SENTRALGODKJENNING } from "../../konstanter";
import { StateContext } from "../../pages/sokpage";
import { Appstate, SentralGodkjenningResultat } from "../../types/domain";
import { genererSokeurl } from "../../utils/utils";
import Feilmelding from "../feilmeldinger/feilmelding";
import Kort from "./kort";

interface Props {
  size: MessageSizeProp;
}

function SentralGodkjenningStatuskort(props: Props) {
  const state = useContext<Appstate>(StateContext);
  const { orgnr } = state;
  const { data: resultat } = useSWR<SentralGodkjenningResultat>(
    genererSokeurl(SOK_SENTRALGODKJENNING, orgnr)
  );

  const erFeil = useHentToggle("feil_for_sentralgodkjenning", false);

  if (erFeil) {
    return (
      <Feilmelding
        size={props.size}
        headerTekst="Sentral godkjenning"
        bodyTekst="Det er for øyeblikket ikke mulig å sjekke bedrifter hos Sentral godkjenning."
      ></Feilmelding>
    );
  }

  if (!resultat) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>Sentral godkjenning</Message.Header>
        <p>Fant ingen data for {state.orgnr} hos Sentral godkjenning.</p>
      </Message>
    );
  }
console.log(resultat);
  const tekst = resultat.status.approved
    ? `${resultat.enterprise.name} finnes i Sentral godkjenning ✅`
    : `${resultat.enterprise.name} er ikke sentralt godkjent ❌.`;
  return (
    <Kort
      size={props.size}
      tittel="Sentral godkjenning"
      erOkStatus={resultat.status.approved}
      orgnr={state.orgnr}
    >
      <p>{tekst}</p>
      <p>
        <a
          onClick={() =>
            loggKlikk({
              url: resultat.status.approval_certificate,
              tekst: "Lenke til sertifikat"
            })
          }
          href={resultat.status.approval_certificate}
        >
          Lenke til sertifikat
        </a>
      </p>
    </Kort>
  );
}

export default SentralGodkjenningStatuskort;
