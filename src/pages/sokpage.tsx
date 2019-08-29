import React, { useState, useReducer } from 'react';
import { reducer } from "../types/reducer";
import { Button, InputLabel, Input, Grid, CircularProgress } from '@material-ui/core';
import { initialState, Appstate } from '../types/domain';
import OppsummeringEnhetsregister from '../components/oppsummering-enhetsregister';

export const StateContext = React.createContext<Appstate>(initialState);
export const DispatchContext = React.createContext({});

function Sokpage() {
    const [orgnr, setOrgnr] = useState<string>("");
    const [state, dispatch] = useReducer(reducer, initialState);

    function sokIEnhetsregisteret() {
        if (orgnr.length === 9) {
            dispatch({ type: "ENHETSREGISTER/HENT_FRA_ENHETSREGISTER" });
            fetch(`https://data.brreg.no/enhetsregisteret/api/enheter?organisasjonsnummer=${orgnr}`)
                .then(data => data.json())
                .then(data => {
                    dispatch({ type: "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK", data: data["_embedded"] })
                })
                .catch(err => {
                    dispatch({ type: "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_ERROR", error: "Klarte ikke hente data fra enhetsregisteret" })
                    console.warn("Klarte ikke hente data fra enhetsregisteret", err);
                })

        }
    }


    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                <Grid>
                    <form name="sokeform" action="#" onSubmit={(e) => e.preventDefault()}>
                        <InputLabel htmlFor="orgnr">Søk på organisasjonsnummer</InputLabel>
                        <Input value={orgnr} onChange={(e) => setOrgnr(e.currentTarget.value)} type="number" id="orgnr" aria-describedby="orgnr-sok" />
                        <Button onClick={sokIEnhetsregisteret}>Søk</Button>
                    </form>
                    {state.loading && <CircularProgress />}
                </Grid>
                <OppsummeringEnhetsregister />
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
}

export default Sokpage;