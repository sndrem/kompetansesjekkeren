import React, { useState } from 'react';
import { Form, Header, Button, Message } from 'semantic-ui-react';

interface Props {
    onSubmit: (orgnr: string) => void;
}

function Sokefelt(props: Props) {
    const [orgnr, setOrgnr] = useState("");
    const [feilmelding, setFeilmelding] = useState("");

    function removeSpaces(value: string): string {
        return value.replace(/\W/g, "");
    }

    function validerInput(orgnr: string) {
        const spacesRemoved = removeSpaces(orgnr);
        if (spacesRemoved.length > 0 && spacesRemoved.length < 9) {
            setFeilmelding("Organisasjonsnummer må være 9 siffer");
        } else {
            setFeilmelding("");
            props.onSubmit(orgnr);
        }
    }

    return (
        <Form className="sokeform" action="#" onSubmit={(e) => e.preventDefault()}>
            <Header as="h1">Kompetansesjekkeren</Header>
            <p>Sjekk organisasjon opp mot <a target="_blank" rel="noopener noreferrer" href="https://www.brreg.no/">Brønnøysundregisteret (Enhetsregisteret)</a>, <a target="_blank" rel="noopener noreferrer" href="https://sgregister.dibk.no/">Sentral godkjenning</a> <a target="_blank" rel="noopener noreferrer" href="http://www.ffv.no/">Fagrådet for våtrom</a>, <a target="_blank" rel="noopener noreferrer" href="https://www.mesterbrev.no/sok-mesterregisteret/">Mesterbrevsregisteret</a> og Arbeidstilsynet sitt <a target="_blank" rel="noopener noreferrer" href="https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/">renholdsregister</a>.</p>
            {feilmelding && <Message negative>{feilmelding}</Message>}
            <Form.Field className="">
                <label>Søk på organisasjonsnummer</label>
                <input placeholder="Organisasjonsnummer - 9 siffer" value={orgnr} onChange={(e) => setOrgnr(removeSpaces(e.currentTarget.value))} type="text" id="orgnr" aria-describedby="orgnr-sok" />
            </Form.Field>
            <Button primary className="cta-btn" onClick={() => validerInput(orgnr)}>Søk</Button>
        </Form >
    )
}

export default Sokefelt;