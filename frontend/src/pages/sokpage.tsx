import React, { useReducer, useState } from "react";
import { Button, Divider, Form, Grid, Header, Message } from "semantic-ui-react";
import OppsummeringEnhetsregister from "../components/oppsummering-enhetsregister";
import EnhetsregisterStatuskort from "../components/enhetsregister-statuskort";
import { ARBEIDSTILSYNET_HOST_AND_PORT, ENHETSREGISTERET_HOST_AND_PORT, SENTRAL_GODKJENNING_HOST_AND_PORT } from "../konstanter";
import { Appstate, initialState } from "../types/domain";
import { reducer } from "../types/reducer";
import ArbeidstilsynetStatuskort from "../components/arbeidstilsynet-statuskort";
import SentralGodkjenningStatuskort from "../components/sentralGodkjenning-statuskort";

export const StateContext = React.createContext<Appstate>(initialState);
export const DispatchContext = React.createContext({});

function Sokpage() {
    const [orgnr, setOrgnr] = useState<string>("");
    const [state, dispatch] = useReducer(reducer, initialState);

    function sokIEnhetsregisteret() {
        if (orgnr.length === 9) {
            dispatch({ type: "DATA/HENTER_DATA" });
            fetch(`${ENHETSREGISTERET_HOST_AND_PORT}?organisasjonsnummer=${orgnr}`)
                .then((data) => data.json())
                .then((data) => {
                    const parsed = JSON.parse(data);
                    dispatch({ type: "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK", data: parsed._embedded.enheter.length > 0 ? parsed._embedded.enheter[0] : null });
                })
                .catch((err) => {
                    dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: "Klarte ikke hente data fra enhetsregisteret" });
                    console.warn("Klarte ikke hente data fra enhetsregisteret", err);
                });
        }
    }

    function sokHosArbeidstilsynet() {
        if (orgnr.length === 9) {
            dispatch({ type: "DATA/HENTER_DATA" });
            fetch(`${ARBEIDSTILSYNET_HOST_AND_PORT}?organisasjonsnummer=${orgnr}`)
                .then((data) => {
                    return data.json();
                })
                .then((data) => {
                    const parsed = JSON.parse(data);
                    dispatch({ type: "ARBEIDSTILSYNET/HENTET_FRA_ARBEIDSTILSYNET_OK", data: parsed.length > 0 ? parsed[0] : null });
                })
                .catch((err) => {
                    dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: "Klarte ikke hente data fra Arbeidstilsynet" });
                    console.warn("Klarte ikke hente data fra Arbeidstilsynet", err);
                });
        }
    }

    function sokHosSentralGodkjenning() {
        if (orgnr.length === 9) {
            dispatch({ type: "DATA/HENTER_DATA" });
            fetch(`${SENTRAL_GODKJENNING_HOST_AND_PORT}?organisasjonsnummer=${orgnr}`)
                .then((data) => {
                    return data.json();
                })
                .then((data) => {
                    if (data) {
                        const parsed = JSON.parse(data);
                        dispatch({ type: "SENTRAL_GODKJENNING/HENTET_FRA_SENTRAL_GODKJENNING_OK", data: parsed["dibk-sgdata"] });
                    }
                })
                .catch((err) => {
                    dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: "Klarte ikke hente data fra Sentral godkjenning" });
                    console.warn("Klarte ikke hente data fra Sentral godkjenning", err);
                });
        }
    }

    function hentData() {
        sokIEnhetsregisteret();
        sokHosArbeidstilsynet();
        sokHosSentralGodkjenning();
    }

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                <Form action="#" onSubmit={(e) => e.preventDefault()}>
                    <Form.Field width={4}>
                        <label>Søk på organisasjonsnummer</label>
                        <input value={orgnr} onChange={(e) => setOrgnr(e.currentTarget.value)} type="number" id="orgnr" aria-describedby="orgnr-sok" />

                    </Form.Field>
                    <Button className="cta-btn" onClick={hentData}>Søk</Button>
                </Form>
                <Divider />
                {state.error && <Message color="red"><Message.Header>Feil</Message.Header>{state.error}</Message>}

                {state.enhetsregisterResult && <Header as="h3">Du har søkt på {state.enhetsregisterResult.navn} med orgnr: {state.enhetsregisterResult.organisasjonsnummer}</Header>}
                <Grid>
                    <Grid.Column width={10}>
                        {state.submitted && <EnhetsregisterStatuskort orgnr={orgnr} />}
                        {state.submitted && <ArbeidstilsynetStatuskort orgnr={orgnr} />}
                        {state.submitted && <SentralGodkjenningStatuskort orgnr={orgnr} />}
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <OppsummeringEnhetsregister />
                    </Grid.Column>
                </Grid>
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
}

export default Sokpage;
