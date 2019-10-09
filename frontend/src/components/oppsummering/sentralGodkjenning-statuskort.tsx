import React, { useContext } from 'react';
import { Appstate } from '../../types/domain';
import { StateContext } from '../../pages/sokpage';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';
import { loggKlikk } from '../../analytics/google-analytics';


interface Props {
    size: MessageSizeProp;
}

function SentralGodkjenningStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { sentralgodkjenning } = state.data;

    if (!sentralgodkjenning) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Sentral godkjenning</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Sentral godkjenning.</p>
            </Message>
        );
    }

    const tekst = sentralgodkjenning.status.approved ? `${sentralgodkjenning.enterprise.name} finnes i Sentral godkjenning ✅` : `${sentralgodkjenning.enterprise.name} er ikke sentralt godkjent ❌.`;
    return (
        <Kort
            size={props.size}
            tittel="Sentral godkjenning"
            erOkStatus={sentralgodkjenning.status.approved}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
            <p><a onClick={() => loggKlikk({ url: sentralgodkjenning.status.approval_certificate, tekst: "Lenke til sertifikat" })} href={sentralgodkjenning.status.approval_certificate}>Lenke til sertifikat</a></p>
        </Kort>
    )
}

export default SentralGodkjenningStatuskort;