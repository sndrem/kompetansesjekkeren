import React, { useContext } from 'react';
import { StateContext } from '../../pages/sokpage';
import { Appstate, ArbeidstilsynetContact } from '../../types/domain';
import { Message, MessageSizeProp, List } from 'semantic-ui-react';
import Kort from './kort';
import { oppdaterWebadresse } from '../../utils/utils';

interface Props {
    size: MessageSizeProp;
}

function ArbeidstilsynetStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);
    const { arbeidstilsynet } = state.data;

    if (!arbeidstilsynet) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Renholdsregisteret</Message.Header>
                <p>Fant ingen data for {state.orgnr} i Renholdsregisteret.</p>
            </Message>
        );
    }

    function formaterKontaktinformasjon(kontaktinfo: ArbeidstilsynetContact): JSX.Element {
        return (
            <List>
                <List.Item>Tlf: {kontaktinfo.MobileNumber}</List.Item>
                <List.Item>Epost: <a target="_blank" rel="noopener noreferrer" href={oppdaterWebadresse(kontaktinfo.WebAddress)}>{oppdaterWebadresse(kontaktinfo.WebAddress)}</a></List.Item>
            </List>
        )
    }

    const tekst = arbeidstilsynet.RecordStatus.Valid ? `${arbeidstilsynet.Organisation.Name} har status: ${arbeidstilsynet.RecordStatus.Status} - ${arbeidstilsynet.RecordStatus.Description}` : `${arbeidstilsynet.Organisation.Name} er ikke godkjent i Renholdsregisteret.`;

    return (
        <Kort
            size={props.size}
            tittel="Renholdsregisteret"
            erOkStatus={arbeidstilsynet.RecordStatus.Valid}
            orgnr={state.orgnr}
        >
            <p>{tekst}</p>
            {formaterKontaktinformasjon(arbeidstilsynet.Organisation.Contact)}
        </Kort>
    )

}

export default ArbeidstilsynetStatuskort;