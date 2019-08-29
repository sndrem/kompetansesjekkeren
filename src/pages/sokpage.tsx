import React from 'react';
import { Button, InputLabel, Input, Grid } from '@material-ui/core';

function Sokpage() {


    return (
        <Grid>
            <form name="sokeform" action="#" onSubmit={(e) => e.preventDefault()}>
                <InputLabel htmlFor="orgnr">Søk på organisasjonsnummer</InputLabel>
                <Input type="number" id="orgnr" aria-describedby="orgnr-sok" />
                <Button>Søk</Button>
            </form>
        </Grid>
    );
}

export default Sokpage;