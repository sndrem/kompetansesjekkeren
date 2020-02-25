import React, { useContext } from "react";
import { Item, Segment, Message } from "semantic-ui-react";
import { StateContext } from "../../pages/sokpage";
import { Appstate } from "../../types/domain";
import { oppdaterWebadresse } from "../../utils/utils";
import { loggKlikk } from "../../analytics/google-analytics";

interface Props {
  orgnr: string;
}

function OverordnetEnhet({ orgnr }: Props) {
  return (
    <Message warning>
      <Message.Header>Denne bedriften har en overordnet enhet</Message.Header>
      <p>
        <a href={`#/orgnr/${orgnr}`}>
          Klikk her for å se informasjon om overordnet enhet
        </a>
      </p>
    </Message>
  );
}

function OppsummeringEnhetsregister() {
  const state = useContext<Appstate>(StateContext);

  if (!state.enhetsregisteret) {
    return null;
  }

  const enhet = state.enhetsregisteret;

  return (
    <Segment>
      <Item>
        <Item.Content>
          {enhet.overordnetEnhet ? (
            <OverordnetEnhet orgnr={enhet.overordnetEnhet} />
          ) : null}
          <Item.Header>
            {enhet.navn} - Orgnr: {enhet.organisasjonsnummer}
          </Item.Header>
          <Item.Meta>{enhet.organisasjonsform.beskrivelse}</Item.Meta>
          {enhet.hjemmeside && (
            <Item.Meta>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={oppdaterWebadresse(enhet.hjemmeside)}
              >
                {oppdaterWebadresse(enhet.hjemmeside)}
              </a>
            </Item.Meta>
          )}
          <Item.Description>
            <dl>
              <dt>Jobber med:</dt>
              <dd>
                {enhet.naeringskode1
                  ? enhet.naeringskode1.beskrivelse.toLowerCase()
                  : "Data ikke tilgjengelig"}
              </dd>
              <dt>Registrert i MVA-registeret?</dt>
              <dd>{enhet.registrertIMvaregisteret ? "Ja ✅" : "Nei ❌"}</dd>
              <dt>Registrert i Foretaksregisteret</dt>
              <dd>
                {enhet.registrertIForetaksregisteret ? "Ja ✅" : "Nei ❌"}
              </dd>
              <dt>Registrert i Stiftelsesregisteret?</dt>
              <dd>
                {enhet.registrertIStiftelsesregisteret ? "Ja ✅" : "Nei ❌"}
              </dd>
              <dt>Registrert i Frivillighetsregisteret?</dt>
              <dd>
                {enhet.registrertIFrivillighetsregisteret ? "Ja ✅" : "Nei ❌"}
              </dd>
              <dt>Under avvikling?</dt>
              <dd>{enhet.underAvvikling ? "Ja ✅" : "Nei ❌"}</dd>
              <dt>Under tvangsavvikling eller tvangsoppløsning?</dt>
              <dd>
                {enhet.underTvangsavviklingEllerTvangsopplosning
                  ? "Ja ✅"
                  : "Nei ❌"}
              </dd>
              <dt>Siste innsendte årsregnskap</dt>
              <dd>{enhet.sisteInnsendteAarsregnskap}</dd>
              <dt>Antall ansatte:</dt>
              <dd>{enhet.antallAnsatte}</dd>
              <dt>Forretningsadresse</dt>
              <dd>
                {enhet.forretningsadresse?.adresse[0]},{" "}
                {enhet.forretningsadresse?.postnummer}{" "}
                {enhet.forretningsadresse?.poststed}
              </dd>
              <dt>Registrert i Enhetsregisteret</dt>
              <dd>{enhet.registreringsdatoEnhetsregisteret}</dd>
              <dt>Ble stiftet:</dt>
              <dd>
                {enhet.stiftelsesdato
                  ? enhet.stiftelsesdato
                  : "Data ikke tilgjengelig"}
              </dd>
            </dl>
          </Item.Description>
          <Item.Meta>
            <a
              onClick={() =>
                loggKlikk({
                  url: `https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${state.orgnr}`,
                  tekst: "Se mer om bedriften hos Brønnøysundregistrene"
                })
              }
              target="_blank"
              rel="noopener noreferrer"
              href={`https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${state.orgnr}`}
            >
              Se mer om bedriften hos Brønnøysundregistrene
            </a>
          </Item.Meta>
        </Item.Content>
      </Item>
    </Segment>
  );
}

export default OppsummeringEnhetsregister;
