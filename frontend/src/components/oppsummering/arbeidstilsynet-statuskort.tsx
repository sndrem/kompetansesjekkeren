import React, { useContext, useState, useEffect } from 'react';
import { StateContext, hentData } from '../../pages/sokpage';
import { Appstate, RenholdsregisterOrganisasjon, VatromregisterResultat } from '../../types/domain';
import { Message, MessageSizeProp } from 'semantic-ui-react';
import Kort from './kort';
import { SOK_VATROM, SOK_RENHOLDSREGISTERET } from '../../konstanter';

interface Props {
    size: MessageSizeProp;
}

const UGYLDIGE_STATUSER = ["Ikke godkjent"]

function gyldigBedrift(status: string): boolean {
    return !UGYLDIGE_STATUSER.includes(status);
}

function RenholdsregisteretStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { submitted, orgnr } = state;
    const [resultat, setResultat] = useState<RenholdsregisterOrganisasjon | null>(null);

    useEffect(() => {
        hentData<RenholdsregisterOrganisasjon>(SOK_RENHOLDSREGISTERET, orgnr).then(data => {
            setResultat(data);
        }).catch(err => {
            setResultat(null);
        })
    }, [submitted, orgnr])

    if (!resultat) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Renholdsregisteret</Message.Header>
                <p>Fant ingen data for {state.orgnr} i Renholdsregisteret.</p>
            </Message>
        );
    }

    const tekst = gyldigBedrift(resultat.Status) ? `${resultat.Navn} har status: ${resultat.Status}` : `${resultat.Navn} er ikke godkjent i Renholdsregisteret.`;
    console.log(resultat);
    const underavdelinger = resultat.Underavdelinger.Avdeling?.map(avd => {
        return <li>{avd.Navn}</li>
    });

    return (
        <Kort
            size={props.size}
            tittel="Renholdsregisteret"
            erOkStatus={gyldigBedrift(resultat.Status)}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
            <>
                <p>Underavdelinger til hovedenhet</p>
                {underavdelinger ? <ul>{underavdelinger}</ul> : ""}
            </>
        </Kort>
    )

}

export default RenholdsregisteretStatuskort;