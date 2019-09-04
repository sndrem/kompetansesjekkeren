import React, { useContext } from "react";
import { Message } from "semantic-ui-react";
import { StateContext } from "../pages/sokpage";
import { Appstate } from "../types/domain";
import Kort from "./kort";

function EnhetsregisterStatuskort() {
    const state = useContext<Appstate>(StateContext);

    const { enhetsregisteret } = state.data;

    if (!enhetsregisteret) {
        return (
            <Message color="red">
                <Message.Header>Enhetsregisteret</Message.Header>
                <p>Fant ingen data for {state.orgnr} i Enhetsregisteret</p>
            </Message>
        );
    }

    const erMvaRegistrert = enhetsregisteret.registrertIMvaregisteret;
    const tekst = erMvaRegistrert ? `${enhetsregisteret.navn} er registrert i MVA-registeret ✅` : `${enhetsregisteret.navn} er ikke registrert i MVA-registeret ❌`;
    return (
        <Kort
            orgnr={state.orgnr} tittel="MVA-register"
            erOkStatus={erMvaRegistrert ? true : false}
        >
            <p>{tekst}</p>

        </Kort>
    );
}

export default EnhetsregisterStatuskort;