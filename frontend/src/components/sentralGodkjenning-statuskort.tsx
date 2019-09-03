import React, { useContext } from 'react';
import { Appstate } from '../types/domain';
import { StateContext } from '../pages/sokpage';
import { Message } from 'semantic-ui-react';
import Kort from './kort';


function SentralGodkjenningStatuskort() {
    const state = useContext<Appstate>(StateContext);
    const { sentralgodkjenning } = state.data;

    if (!sentralgodkjenning) {
        return (
            <Message color="red">
                <Message.Header>Sentral godkjenning</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Sentral godkjenning.</p>
            </Message>
        );
    }

    const tekst = sentralgodkjenning.status.approved ? `${sentralgodkjenning.enterprise.name} finnes i Sentral godkjenning ✅` : `${sentralgodkjenning.enterprise.name} er ikke sentralt godkjent ❌.`;
    return (
        <Kort
            tittel="Sentral godkjenning"
            erOkStatus={sentralgodkjenning.status.approved}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
            <p><a href={sentralgodkjenning.status.approval_certificate}>Lenke til sertifikat</a></p>
        </Kort>
    )
}

export default SentralGodkjenningStatuskort;