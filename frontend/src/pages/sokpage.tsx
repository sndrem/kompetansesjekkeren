import React, { useReducer, Context, createContext, Dispatch, useEffect } from "react";
import { Divider, Grid, Header, Message, Icon, Loader } from "semantic-ui-react";
import { SOK_ENHET } from "../konstanter";
import { Appstate, initialState, EnhetsregisterEnhet } from "../types/domain";
import { reducer } from "../types/reducer";
import { EnhetsregisterActions } from "../types/actions";
import Sokefelt from "../components/sokefelt/sokefelt";
import "./sokpage.scss";
import { RouteComponentProps } from "react-router";
import OppsummeringPage from "../components/oppsummering/oppsummering-page";
import { nyttigeLenker } from "../konstanter/konstanter";
import NyttigeLenker from "../components/nyttige-lenker/nyttige-lenker";
import { ReactGA } from "../analytics/google-analytics";
import MeldFeil from "../components/feedback/meld-feil";

ReactGA.pageview("/søk");

export const StateContext = createContext<Appstate>(initialState);
export const DispatchContext: Context<Dispatch<EnhetsregisterActions>> = createContext({} as any);

interface MatchParams {
    orgnr: string;
}

export function hentData<T>(url: string, orgnr: string): Promise<T> {
    return fetch(`${url}?organisasjonsnummer=${orgnr}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json() as Promise<T>;
        })
}

async function sok(orgnr: string, dispatch: Dispatch<EnhetsregisterActions>) {
    if (orgnr.length === 9) {
        ReactGA.event({
            category: "søk",
            action: "Bruker søkte på orgnr"
        });
        dispatch({ type: "SETT_ORGNR", data: orgnr });
        dispatch({ type: "DATA/HENTER_DATA" });
        hentData<EnhetsregisterEnhet>(SOK_ENHET, orgnr).then(data => {
            dispatch({ type: "HENTET_ENHET", data: data })
        }).catch(err => {
            dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: "Klarte ikke hente data fra enhetsregisteret" })
        })
    } else {
        dispatch({ type: "SOK/RESET" });
    }
}

function Sokpage(props: RouteComponentProps<MatchParams>) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const { orgnr } = props.match.params;
        if (orgnr) {
            sok(orgnr, dispatch);
        }
    }, [props.match.params]);

    function sokPaOrgnr(orgnr: string) {
        props.history.push(`/orgnr/${orgnr}`);
    }

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                <div className="sokeside">
                    <Sokefelt onSubmit={sokPaOrgnr} />
                </div>
                <NyttigeLenker lenker={nyttigeLenker} />
                <Divider />
                <div className="container">
                    <Loader active={state.loading}>Laster data...</Loader>
                    {state.error && <Message color="red"><Message.Header>Oisann <span role="img" aria-label="Oisann-ikon">🙈</span></Message.Header>{state.error}</Message>}

                    <Grid>
                        <Grid.Column width="16">
                            {state.enhetsregisteret && <Header as="h3">Du har søkt på {state.enhetsregisteret.navn} med orgnr: {state.enhetsregisteret.organisasjonsnummer}</Header>}
                        </Grid.Column>
                        <div className="container">
                            <OppsummeringPage />

                        </div>
                    </Grid>
                </div>
                <MeldFeil />
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
}

export default Sokpage;
