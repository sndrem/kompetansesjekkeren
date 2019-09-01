import React, { useContext } from 'react';
import { Appstate } from '../types/domain';
import { StateContext } from '../pages/sokpage';
import { Message } from 'semantic-ui-react';
import Kort from './kort';

interface Props {
    orgnr: string;
}

function SentralGodkjenningStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { sentralGodkjenningResultat } = state;

    if (!sentralGodkjenningResultat) {
        return (
            <Message color="grey">
                <Message.Header>Sentral godkjenning</Message.Header>
                <p>Fant ingen data for {props.orgnr} hos Sentral godkjenning.</p>
            </Message>
        );
    }

    const tekst = sentralGodkjenningResultat.status.approved ? `${sentralGodkjenningResultat.enterprise.name} finnes i Sentral godkjenning ✅` : `${sentralGodkjenningResultat.enterprise.name} er ikke sentralt godkjent ❌.`;
    return (
        <Kort
            tittel="Sentral godkjenning"
            erOkStatus={sentralGodkjenningResultat.status.approved}
            orgnr={props.orgnr}
        >
            <p>{tekst}</p>
            <p><a href={sentralGodkjenningResultat.status.approval_certificate}>Lenke til sertifikat</a></p>
        </Kort>
    )
}

export default SentralGodkjenningStatuskort;