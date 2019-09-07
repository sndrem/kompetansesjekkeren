import React, { useContext } from 'react';
import { StateContext } from '../../pages/sokpage';
import { Grid } from 'semantic-ui-react';
import EnhetsregisterStatuskort from './enhetsregister-statuskort';
import ArbeidstilsynetStatuskort from './arbeidstilsynet-statuskort';
import SentralGodkjenningStatuskort from './sentralGodkjenning-statuskort';
import OppsummeringEnhetsregister from './oppsummering-enhetsregister';

function OppsummeringPage() {
    const state = useContext(StateContext);

    return (
        <>
            <Grid.Column width={8}>
                {state.submitted && <EnhetsregisterStatuskort size="large" />}
                {state.submitted && <ArbeidstilsynetStatuskort size="large" />}
                {state.submitted && <SentralGodkjenningStatuskort size="large" />}
            </Grid.Column>
            <Grid.Column width={5}>
                <OppsummeringEnhetsregister />
            </Grid.Column>
        </>
    )
}

export default OppsummeringPage;