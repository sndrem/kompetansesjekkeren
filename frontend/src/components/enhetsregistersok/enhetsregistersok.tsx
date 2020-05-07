import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sokefelt from "../sokefelt/sokefelt";
import { SOK_ENHET } from "../../konstanter";
import { hentData } from "../../pages/sokpage";
import { EnhetsregisterEnhet } from "../../types/domain";
import { Table, Label, Menu, Icon, Segment, Item } from "semantic-ui-react";
import { oppdaterWebadresse } from "../../utils/utils";
import { loggKlikk } from "../../analytics/google-analytics";
import { OverordnetEnhet } from "../oppsummering/oppsummering-enhetsregister";

interface Props {
  tittel: string;
}

const Wrapper = styled.div`
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid black;
`;

interface OppsummerProps {
  enhet?: EnhetsregisterEnhet;
}

function Oppsummersok({ enhet }: OppsummerProps) {
  if (!enhet) return null;

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
                  url: `https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${enhet.organisasjonsnummer}`,
                  tekst: "Se mer om bedriften hos Brønnøysundregistrene",
                })
              }
              target="_blank"
              rel="noopener noreferrer"
              href={`https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${enhet.organisasjonsnummer}`}
            >
              Se mer om bedriften hos Brønnøysundregistrene
            </a>
          </Item.Meta>
        </Item.Content>
      </Item>
    </Segment>
  );
}

function Enhetsregistersok({ tittel }: Props) {
  const [orgnr, setOrgnr] = useState("");
  const [enhet, setEnhet] = useState<undefined | EnhetsregisterEnhet>(
    undefined
  );

  useEffect(() => {
    if (orgnr) {
      hentOrganisasjonsdata(orgnr);
    }

    async function hentOrganisasjonsdata(orgnr: string) {
      const response = await hentData<EnhetsregisterEnhet>(SOK_ENHET, orgnr);
      setEnhet(response);
    }
  }, [orgnr]);
  return (
    <Wrapper>
      <h3>{tittel}</h3>
      <Sokefelt onSubmit={setOrgnr} />
      <Oppsummersok enhet={enhet} />
    </Wrapper>
  );
}

export default Enhetsregistersok;
