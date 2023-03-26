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

const UGYLDIGE_STATUSER = ["Ikke godkjent"];

function gyldigBedrift(status: string): boolean {
  return !UGYLDIGE_STATUSER.includes(status);
}

function RenholdsregisteretStatuskort(props: Props) {
  const orgnr = useOrgnrFraUrl();
  const {data: resultat} = trpc.kompetansesjekker.renholdsregisteret.useQuery(
    orgnr,
    {enabled: !!orgnr}
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
        <p>Fant ingen data for {orgnr} i Renholdsregisteret.</p>
      </Message>
    );
  }

  const tekst = gyldigBedrift(resultat.Hovedenhet.Godkjenningsstatus)
    ? `${resultat.Hovedenhet.Navn} har status: ${resultat.Hovedenhet.Godkjenningsstatus}`
    : `${resultat.Hovedenhet.Navn} er ikke godkjent i Renholdsregisteret.`;
  let underavdelinger: any = null;
  if (resultat.Underenheter) {
    const avdeling = resultat.Underenheter?.Avdeling;

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
      erOkStatus={gyldigBedrift(resultat.Hovedenhet.Godkjenningsstatus)}
      orgnr={orgnr}
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
