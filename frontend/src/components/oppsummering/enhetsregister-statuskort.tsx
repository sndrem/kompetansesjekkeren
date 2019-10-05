import React, { useContext } from "react";
import { Message, MessageSizeProp } from "semantic-ui-react";
import { StateContext } from "../../pages/sokpage";
import { Appstate } from "../../types/domain";
import Kort from "./kort";

interface Props {
    size: MessageSizeProp;
}

function EnhetsregisterStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);

    const { enhetsregisteret } = state.data;

    if (!enhetsregisteret) {
        return (
            <Message size={props.size} color="red">
                <Message.Header>Enhetsregisteret</Message.Header>
                <p>Fant ingen data for {state.orgnr} i Enhetsregisteret</p>
            </Message>
        );
    }

    const erMvaRegistrert = enhetsregisteret.registrertIMvaregisteret;
    const tekst = erMvaRegistrert ? `${enhetsregisteret.navn} er registrert i MVA-registeret ✅` : `${enhetsregisteret.navn} er ikke registrert i MVA-registeret ❌`;
    return (
        <Kort
            size={props.size}
            orgnr={state.orgnr} tittel="MVA-register (Brønnøysundregistrene)"
            erOkStatus={erMvaRegistrert ? true : false}
        >
            <p>{tekst}</p>

        </Kort>
    );
}

export default EnhetsregisterStatuskort;