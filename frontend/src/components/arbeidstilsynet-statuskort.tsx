import React, { useContext } from 'react';
import { StateContext } from '../pages/sokpage';
import { Appstate } from '../types/domain';
import { Message } from 'semantic-ui-react';
import Kort from './kort';

interface Props {
    orgnr: string;
}

function ArbeidstilsynetStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { arbeidstilsynResult } = state;

    if (!arbeidstilsynResult) {
        return (
            <Message color="grey">
                <Message.Header>Arbeidstilsynet</Message.Header>
                <p>Fant ingen data for {props.orgnr} hos Arbeidstilsynet.</p>
            </Message>
        );
    }

    const tekst = arbeidstilsynResult.RecordStatus.Valid ? `${arbeidstilsynResult.Organisation.Name} har status: ${arbeidstilsynResult.RecordStatus.Status} - ${arbeidstilsynResult.RecordStatus.Description}` : `${arbeidstilsynResult.Organisation.Name} er ikke godkjent i renholdsregisteret.`;

    return (
        <Kort
            tittel="Renholdsregisteret"
            erOkStatus={arbeidstilsynResult.RecordStatus.Valid}
            orgnr={props.orgnr}
        >
            <p>{tekst}</p>
        </Kort>
    )

}

export default ArbeidstilsynetStatuskort;