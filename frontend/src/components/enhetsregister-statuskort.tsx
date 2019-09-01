import React, { useContext } from "react";
import { Grid, Header, Loader, Message } from "semantic-ui-react";
import { StateContext } from "../pages/sokpage";
import { Appstate } from "../types/domain";
import Kort from "./kort";

interface Props {
    orgnr: string;
}

function EnhetsregisterStatuskort(props: Props) {
    const state = useContext<Appstate>(StateContext);

    if (state.loading) {
        return <Loader active={state.loading} />;
    }

    const { enhetsregisterResult } = state;

    if (!enhetsregisterResult) {
        return (
            <Message color="grey">
                <Message.Header>Enhetsregisteret</Message.Header>
                <p>Fant ingen data for {props.orgnr} i Enhetsregisteret</p>
            </Message>
        );
    }

    const erMvaRegistrert = enhetsregisterResult.registrertIMvaregisteret;
    const tekst = erMvaRegistrert ? `${enhetsregisterResult.navn} er registrert i MVA-registeret ✅` : `${enhetsregisterResult.navn} er ikke registrert i MVA-registeret ❌`;
    return (
        <Kort
            orgnr={props.orgnr} tittel="MVA-register"
            erOkStatus={erMvaRegistrert ? true : false}
        >
            <p>{tekst}</p>

        </Kort>
    );
}

export default EnhetsregisterStatuskort;
