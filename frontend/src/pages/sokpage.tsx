import React, { useReducer, Context, createContext, Dispatch, useEffect } from "react";
import { Divider, Grid, Header, Message, Loader } from "semantic-ui-react";
import OppsummeringEnhetsregister from "../components/oppsummering-enhetsregister";
import EnhetsregisterStatuskort from "../components/enhetsregister-statuskort";
import { SOK } from "../konstanter";
import { Appstate, initialState } from "../types/domain";
import { reducer } from "../types/reducer";
import ArbeidstilsynetStatuskort from "../components/arbeidstilsynet-statuskort";
import SentralGodkjenningStatuskort from "../components/sentralGodkjenning-statuskort";
import { EnhetsregisterActions } from "../types/actions";
import Sokefelt from "../components/sokefelt/sokefelt";
import "./sokpage.scss";
import { RouteComponentProps } from "react-router";

export const StateContext = createContext<Appstate>(initialState);
export const DispatchContext: Context<Dispatch<EnhetsregisterActions>> = createContext({} as any);

interface MatchParams {
    orgnr: string;
}

function sok(orgnr: string, dispatch: Dispatch<EnhetsregisterActions>) {
    if (orgnr.length === 9) {
        dispatch({ type: "SETT_ORGNR", data: orgnr });
        dispatch({ type: "DATA/HENTER_DATA" });
        fetch(`${SOK}?organisasjonsnummer=${orgnr}`)
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                if (data) {
                    dispatch({ type: "DATA/HENTET_DATA_OK", data })
                }
            })
            .catch((err) => {
                dispatch({ type: "DATA/HENTING_AV_DATA_ERROR", error: `Klarte ikke hente data om orgnr: ${orgnr}. Prøv igjen senere.` });
            });
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
                <Divider />

                {state.loading && <Loader active={state.loading} />}
                {state.error && <Message color="red"><Message.Header>Oisann <span role="img" aria-label="Oisann-ikon">🙈</span></Message.Header>{state.error}</Message>}
                {state.data.enhetsregisteret && <Header as="h3">Du har søkt på {state.data.enhetsregisteret.navn} med orgnr: {state.data.enhetsregisteret.organisasjonsnummer}</Header>}
                <Grid>
                    <Grid.Column width={10}>
                        {state.submitted && <EnhetsregisterStatuskort />}
                        {state.submitted && <ArbeidstilsynetStatuskort />}
                        {state.submitted && <SentralGodkjenningStatuskort />}
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
