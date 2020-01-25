import React, { useContext, useEffect, useState } from 'react';
import { Appstate, VatromregisterResultat } from '../../types/domain';
import { StateContext, hentData } from '../../pages/sokpage';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';
import { SOK_VATROM } from '../../konstanter';

interface Props {
    size: MessageSizeProp;
}

function VatromregisterStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { submitted, orgnr } = state;
    const [resultat, setResultat] = useState<VatromregisterResultat | null>(null);

    useEffect(() => {
        hentData<VatromregisterResultat>(SOK_VATROM, orgnr).then(data => {
            setResultat(data);
        }).catch(err => {
            setResultat(null);
        })
    }, [submitted])

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