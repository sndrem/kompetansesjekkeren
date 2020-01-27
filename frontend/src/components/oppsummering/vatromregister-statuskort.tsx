import React, { useContext } from 'react';
import { Appstate, VatromregisterResultat } from '../../types/domain';
import { StateContext } from '../../pages/sokpage';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';
import { SOK_VATROM } from '../../konstanter';
import { useFetch } from '../../hooks/useFetch';
import { genererSokeurl } from '../../utils/utils';

interface Props {
    size: MessageSizeProp;
}

function VatromregisterStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { orgnr } = state;
    const { response: resultat } = useFetch<VatromregisterResultat>(genererSokeurl(SOK_VATROM, orgnr));


    if (!resultat) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Fagrådet for våtrom</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Fagrådet for våtrom.</p>
            </Message>
        );
    }

    const tekst = resultat.godkjent ? `${resultat.bedriftsnavn} finnes i Fagrådet for våtrom ✅` : `${resultat} finnes ikke i Fagrådet for våtrom ❌.`;
    return (
        <Kort
            size={props.size}
            tittel="Fagrådet for våtrom"
            erOkStatus={resultat.godkjent}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
        </Kort>
    )
}

export default VatromregisterStatuskort;