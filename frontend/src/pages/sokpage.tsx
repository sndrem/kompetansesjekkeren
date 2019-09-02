import React, { useReducer, useState } from "react";
import { Button, Divider, Form, Grid, Header, Message, Loader } from "semantic-ui-react";
import OppsummeringEnhetsregister from "../components/oppsummering-enhetsregister";
import EnhetsregisterStatuskort from "../components/enhetsregister-statuskort";
import { ARBEIDSTILSYNET_HOST_AND_PORT, ENHETSREGISTERET_HOST_AND_PORT, SENTRAL_GODKJENNING_HOST_AND_PORT } from "../konstanter";
import { Appstate, initialState } from "../types/domain";
import { reducer } from "../types/reducer";
import ArbeidstilsynetStatuskort from "../components/arbeidstilsynet-statuskort";
import SentralGodkjenningStatuskort from "../components/sentralGodkjenning-statuskort";
import "./sokpage.scss";

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
                    dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: "Klarte ikke hente data fra Enhetsregisteret. Prøv igjen om en liten stund." });
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
                    dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: "Klarte ikke hente data fra Arbeidstilsynet .Prøv igjen om en liten stund." });
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
                    dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: "Klarte ikke hente data fra Sentral godkjenning. Prøv igjen om en liten stund." });
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
                <div className="sokeside">
                    <Form className="sokeform" action="#" onSubmit={(e) => e.preventDefault()}>
                        <Header as="h1">Kompetansesjekk</Header>
                        <p>Sjekk organisasjon opp mot <a target="_blank" rel="noopener noreferrer" href="https://www.brreg.no/">Brønnøysundregisteret (Enhetsregisteret)</a>, <a target="_blank" rel="noopener noreferrer" href="https://sgregister.dibk.no/">Sentral godkjenning</a> og Arbeidstilsynet sitt <a target="_blank" rel="noopener noreferrer" href="https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/">renholdsregister</a>.</p>
                        <Form.Field>
                            <label>Søk på organisasjonsnummer</label>
                            <input placeholder="Organisasjonsnummer - 9 siffer" value={orgnr} onChange={(e) => setOrgnr(e.currentTarget.value)} type="text" id="orgnr" maxLength={9} required aria-describedby="orgnr-sok" />
                        </Form.Field>
                        <Button primary className="cta-btn" onClick={hentData}>Søk</Button>
                    </Form>
                </div>
                <Divider />
                {state.loading && <Loader active={state.loading} />}
                {state.error && <Message color="red"><Message.Header>Oisann <span role="img" aria-label="Oisann-ikon">🙈</span></Message.Header>{state.error}</Message>}
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
