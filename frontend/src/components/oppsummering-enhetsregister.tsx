import React, { useContext } from "react";
import { Item, Loader, Segment } from "semantic-ui-react";
import { StateContext } from "../pages/sokpage";
import { Appstate } from "../types/domain";

function OppsummeringEnhetsregister() {
    const state = useContext<Appstate>(StateContext);

    if (state.loading) {
        return <Loader active={state.loading} />;
    }

    if (!state.enhetsregisterResult) {
        return null;
    }

    const enhet = state.enhetsregisterResult;

    return (
        <Segment>
            <Item>
                <Item.Content>
                    <Item.Header>{enhet.navn} - Orgnr: {enhet.organisasjonsnummer}</Item.Header>
                    <Item.Meta>{enhet.organisasjonsform.beskrivelse}</Item.Meta>
                    <Item.Description>
                        <dl>
                            <dt>Registrert i MVA-registeret?</dt>
                            <dd>{enhet.registrertIMvaregisteret ? "Ja ✅" : "Nei ❌"}</dd>
                            <dt>Jobber med:</dt>
                            <dd>{enhet.naeringskode1.beskrivelse.toLowerCase()}</dd>
                            <dt>Antall ansatte:</dt>
                            <dd>{enhet.antallAnsatte}</dd>
                            <dt>Forretningsadresse</dt>
                            <dd>{enhet.forretningsadresse.adresse[0]}, {enhet.forretningsadresse.postnummer} {enhet.forretningsadresse.poststed}</dd>
                            <dt>Ble stiftet:</dt>
                            <dd>{enhet.stiftelsesdato}</dd>
                        </dl>
                    </Item.Description>
                </Item.Content>
            </Item>
        </Segment>
    );
}

export default OppsummeringEnhetsregister;
