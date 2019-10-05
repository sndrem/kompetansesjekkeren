import React, { useContext } from 'react';
import { Appstate } from '../../types/domain';
import { StateContext } from '../../pages/sokpage';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';


interface Props {
    size: MessageSizeProp;
}

function VatromregisterStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { vatromsregisteret } = state.data;

    if (!vatromsregisteret) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Fagrådet for våtrom</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Fagrådet for våtrom.</p>
            </Message>
        );
    }

    const tekst = vatromsregisteret.godkjent ? `${vatromsregisteret.bedriftsnavn} finnes i Fagrådet for våtrom ✅` : `${vatromsregisteret} finnes ikke i Fagrådet for våtrom ❌.`;
    return (
        <Kort
            size={props.size}
            tittel="Fagrådet for våtrom"
            erOkStatus={vatromsregisteret.godkjent}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
        </Kort>
    )
}

export default VatromregisterStatuskort;