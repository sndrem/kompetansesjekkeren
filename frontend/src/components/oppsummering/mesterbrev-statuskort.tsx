import React, { useContext, useState, useEffect } from 'react';
import { Appstate, MesterbrevResultat } from '../../types/domain';
import { StateContext, hentData } from '../../pages/sokpage';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';
import { SOK_MESTERBREV } from '../../konstanter';


interface Props {
    size: MessageSizeProp;
}

function MesterbrevStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { orgnr, submitted } = state;
    const [resultat, setResultat] = useState<MesterbrevResultat | null>(null);

    useEffect(() => {
        hentData<MesterbrevResultat>(SOK_MESTERBREV, orgnr).then(data => {
            setResultat(data);
        }).catch(err => {
            setResultat(null);
        })
    }, [orgnr, submitted])

    if (!resultat) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Mesterbrevsregisteret</Message.Header>
                <p>Fant ingen data for {state.orgnr} hos Mesterbrevsregisteret.</p>
            </Message>
        );
    }

    const tekst = `${resultat.bedrift} finnes i Mesterbrevsregisteret ✅`;
    return (
        <Kort
            size={props.size}
            tittel="Mesterbrevsregisteret"
            erOkStatus={resultat !== null}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
        </Kort>
    )
}

export default MesterbrevStatuskort;