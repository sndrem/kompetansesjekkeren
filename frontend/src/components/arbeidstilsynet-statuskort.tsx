import React, { useContext } from 'react';
import { StateContext } from '../pages/sokpage';
import { Appstate } from '../types/domain';
import { Message } from 'semantic-ui-react';
import Kort from './kort';

function ArbeidstilsynetStatuskort() {
    const state = useContext<Appstate>(StateContext);
    const { arbeidstilsynet } = state.data;

    if (!arbeidstilsynet) {
        return (
            <Message color="red">
                <Message.Header>Arbeidstilsynet</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Arbeidstilsynet.</p>
            </Message>
        );
    }

    const tekst = arbeidstilsynet.RecordStatus.Valid ? `${arbeidstilsynet.Organisation.Name} har status: ${arbeidstilsynet.RecordStatus.Status} - ${arbeidstilsynet.RecordStatus.Description}` : `${arbeidstilsynet.Organisation.Name} er ikke godkjent i renholdsregisteret.`;

    return (
        <Kort
            tittel="Renholdsregisteret"
            erOkStatus={arbeidstilsynet.RecordStatus.Valid}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
        </Kort>
    )

}

export default ArbeidstilsynetStatuskort;