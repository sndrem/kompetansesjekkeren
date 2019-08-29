import React, { useContext, useState } from 'react';
import { StateContext } from '../pages/sokpage';
import { Appstate } from '../types/domain';
import { Typography } from '@material-ui/core';

function OppsummeringEnhetsregister() {
    const state = useContext<Appstate>(StateContext);

    if (!state.enhetsregisterResult) {
        return null;
    }

    const [enhet] = state.enhetsregisterResult.enheter;
    return (
        <>
            <Typography variant="h4" gutterBottom>
                {enhet.navn} ({enhet.organisasjonsform.beskrivelse})
                </Typography>
            <Typography variant="body1" gutterBottom>
                {enhet.registrertIMvaregisteret ? "Er i MVA-registeret! ✅" : "Er ikke i MVA-registeret"}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {enhet.navn} driver med {enhet.naeringskode1.beskrivelse.toLowerCase()}. De ble stiftet {enhet.stiftelsesdato} og har i dag {enhet.antallAnsatte} antall ansatte.
            </Typography>
        </>
    )
}

export default OppsummeringEnhetsregister;