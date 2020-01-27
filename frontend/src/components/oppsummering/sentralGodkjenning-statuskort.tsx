import React, { useContext } from 'react';
import { Appstate, SentralGodkjenningResultat } from '../../types/domain';
import { StateContext } from '../../pages/sokpage';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';
import { loggKlikk } from '../../analytics/google-analytics';
import { SOK_SENTRALGODKJENNING } from '../../konstanter';
import { useFetch } from '../../hooks/useFetch';
import { genererSokeurl } from '../../utils/utils';


interface Props {
    size: MessageSizeProp;
}

function SentralGodkjenningStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { orgnr } = state;
    const { response: resultat } = useFetch<SentralGodkjenningResultat>(genererSokeurl(SOK_SENTRALGODKJENNING, orgnr));

    if (!resultat) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Sentral godkjenning</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Sentral godkjenning.</p>
            </Message>
        );
    }

    const tekst = resultat.status.approved ? `${resultat.enterprise.name} finnes i Sentral godkjenning ✅` : `${resultat.enterprise.name} er ikke sentralt godkjent ❌.`;
    return (
        <Kort
            size={props.size}
            tittel="Sentral godkjenning"
            erOkStatus={resultat.status.approved}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
            <p><a onClick={() => loggKlikk({ url: resultat.status.approval_certificate, tekst: "Lenke til sertifikat" })} href={resultat.status.approval_certificate}>Lenke til sertifikat</a></p>
        </Kort>
    )
}

export default SentralGodkjenningStatuskort;