import React, { useState } from 'react';
import { Form, Header, Button, Message } from 'semantic-ui-react';

interface Props {
    onSubmit: (orgnr: string) => void;
}

function Sokefelt(props: Props) {
    const [orgnr, setOrgnr] = useState("");
    const [feilmelding, setFeilmelding] = useState("");

    function validerInput(orgnr: string) {
        if (orgnr.length > 0 && orgnr.length < 9) {
            setFeilmelding("Organisasjonsnummer må være 9 siffer");
        } else {
            setFeilmelding("");
            props.onSubmit(orgnr);
        }
    }

    return (
        <Form className="sokeform" action="#" onSubmit={(e) => e.preventDefault()}>
            <Header as="h1">Kompetansesjekk</Header>
            <p>Sjekk organisasjon opp mot <a target="_blank" rel="noopener noreferrer" href="https://www.brreg.no/">Brønnøysundregisteret (Enhetsregisteret)</a>, <a target="_blank" rel="noopener noreferrer" href="https://sgregister.dibk.no/">Sentral godkjenning</a> og Arbeidstilsynet sitt <a target="_blank" rel="noopener noreferrer" href="https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/">renholdsregister</a>.</p>
            {feilmelding && <Message negative>{feilmelding}</Message>}
            <Form.Field>
                <label>Søk på organisasjonsnummer</label>
                <input placeholder="Organisasjonsnummer - 9 siffer" value={orgnr} onChange={(e) => setOrgnr(e.currentTarget.value)} type="text" id="orgnr" maxLength={9} aria-describedby="orgnr-sok" />
            </Form.Field>
            <Button primary className="cta-btn" onClick={() => validerInput(orgnr)}>Søk</Button>
        </Form>
    )
}

export default Sokefelt;