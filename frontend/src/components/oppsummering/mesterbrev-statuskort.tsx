import React, { useContext } from 'react';
import { Appstate } from '../../types/domain';
import { StateContext } from '../../pages/sokpage';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';


interface Props {
    size: MessageSizeProp;
}

function MesterbrevStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { mesterbrev } = state.data;

    if (!mesterbrev) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Mesterbrevsregisteret</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Mesterbrevsregisteret.</p>
            </Message>
        );
    }

    const tekst = `${mesterbrev.bedrift} finnes i Mesterbrevsregisteret ✅`;
    return (
        <Kort
            size={props.size}
            tittel="Mesterbrevsregisteret"
            erOkStatus={mesterbrev !== null}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
        </Kort>
    )
}

export default MesterbrevStatuskort;