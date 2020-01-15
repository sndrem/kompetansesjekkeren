import React, { useContext } from 'react';
import { StateContext } from '../../pages/sokpage';
import { Appstate } from '../../types/domain';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';

interface Props {
    size: MessageSizeProp;
}

const UGYLDIGE_STATUSER = ["Ikke godkjent"]

function gyldigBedrift(status: string): boolean {
    return !UGYLDIGE_STATUSER.includes(status);
}

function ArbeidstilsynetStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { arbeidstilsynet } = state.data;
    console.log(arbeidstilsynet);

    if (!arbeidstilsynet) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Renholdsregisteret</Message.Header>
                <p>Fant ingen data for {state.orgnr} i Renholdsregisteret.</p>
            </Message>
        );
    }


    const tekst = gyldigBedrift(arbeidstilsynet.Status) ? `${arbeidstilsynet.Navn} har status: ${arbeidstilsynet.Status}` : `${arbeidstilsynet.Navn} er ikke godkjent i Renholdsregisteret.`;

    return (
        <Kort
            size={props.size}
            tittel="Renholdsregisteret"
            erOkStatus={gyldigBedrift(arbeidstilsynet.Status)}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
        </Kort>
    )

}

export default ArbeidstilsynetStatuskort;