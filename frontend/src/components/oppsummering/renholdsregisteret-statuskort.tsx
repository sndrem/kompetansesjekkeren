import React, { useContext } from "react";
import { StateContext } from "../../pages/sokpage";
import { Appstate, RenholdsregisterOrganisasjon } from "../../types/domain";
import { Message, MessageSizeProp } from "semantic-ui-react";
import Kort from "./kort";
import { SOK_RENHOLDSREGISTERET } from "../../konstanter";
import { useFetch } from "../../hooks/useFetch";
import { genererSokeurl } from "../../utils/utils";
import { useHentToggle } from "../../featureToggles/client";
import Feilmelding from "../feilmeldinger/feilmelding";

interface Props {
  size: MessageSizeProp;
}

const UGYLDIGE_STATUSER = ["Ikke godkjent"];

function gyldigBedrift(status: string): boolean {
  return !UGYLDIGE_STATUSER.includes(status);
}

function RenholdsregisteretStatuskort(props: Props) {
  const state = useContext<Appstate>(StateContext);
  const { orgnr } = state;
  const { response: resultat } = useFetch<RenholdsregisterOrganisasjon>(
    genererSokeurl(SOK_RENHOLDSREGISTERET, orgnr)
  );

  const erFeil = useHentToggle("feil_for_renholdsregisteret", false);

  if (erFeil) {
    return (
      <Feilmelding
        size={props.size}
        headerTekst="Renholdsregisteret"
        bodyTekst="Det er for øyeblikket ikke mulig å sjekke bedrifter hos Renholdsregisteret"
      ></Feilmelding>
    );
  }

  if (!resultat) {
    return (
      <Message size={props.size} color="red">
        <Message.Header>Renholdsregisteret</Message.Header>
        <p>Fant ingen data for {state.orgnr} i Renholdsregisteret.</p>
      </Message>
    );
  }

  const tekst = gyldigBedrift(resultat.Status)
    ? `${resultat.Navn} har status: ${resultat.Status}`
    : `${resultat.Navn} er ikke godkjent i Renholdsregisteret.`;
  let underavdelinger = null;
  if (resultat.Underavdelinger) {
    const avdeling = resultat.Underavdelinger?.Avdeling;

    if (Array.isArray(avdeling)) {
      underavdelinger = avdeling.map((avd) => {
        return (
          <li key={avd.Organisasjonsnummer}>
            {avd.Navn} - Orgnr: {avd.Organisasjonsnummer}
          </li>
        );
      });
    } else {
      if (avdeling) {
        underavdelinger = (
          <li key={avdeling.Organisasjonsnummer}>
            {avdeling.Navn} - Orgnr: {avdeling.Organisasjonsnummer}
          </li>
        );
      }
    }
  }

  return (
    <Kort
      size={props.size}
      tittel="Renholdsregisteret"
      erOkStatus={gyldigBedrift(resultat.Status)}
      orgnr={state.orgnr}
    >
      <p>{tekst}</p>
      <>
        {underavdelinger ? (
          <>
            <p>Underavdelinger til hovedenhet</p>
            <ul>{underavdelinger}</ul>
          </>
        ) : (
          ""
        )}
      </>
    </Kort>
  );
}

export default RenholdsregisteretStatuskort;
