import React, {useState} from "react";
import {Button, Form, Header, Message} from "semantic-ui-react";
import styled from "styled-components";
import {useOrgnrFraUrl} from "../../hooks/useOrgnrFraUrl";

interface Props {
  onSubmit: (orgnr: string) => void;
}

const Knapp = styled(Button)`
  background: #2185d0;
  color: white;
  padding: 1rem;
  border-radius: 15px;

  &:hover {
    cursor: pointer;
  }
`;

export function removeSpaces(value: string): string {
  return value.replace(/\W/g, "");
}

function Sokefelt(props: Props) {
  const [orgnr, setOrgnr] = useState(useOrgnrFraUrl());
  const [feilmelding, setFeilmelding] = useState("");

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
      <p>
        Sjekk organisasjon opp mot{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.brreg.no/"
        >
          Brønnøysundregisteret (Enhetsregisteret)
        </a>
        ,{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://sgregister.dibk.no/"
        >
          Sentral godkjenning
        </a>{" "}
        <a target="_blank" rel="noopener noreferrer" href="http://www.ffv.no/">
          Fagrådet for våtrom
        </a>
        ,{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.mesterbrev.no/sok-mesterregisteret/"
        >
          Mesterbrevsregisteret
        </a>{" "}
        og Arbeidstilsynet sitt{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/"
        >
          renholdsregister
        </a>
        .
      </p>
      {feilmelding && <Message negative>{feilmelding}</Message>}
      <Form.Field className="">
        <label>Søk på organisasjonsnummer</label>
        <input
          placeholder="Organisasjonsnummer - 9 siffer"
          value={orgnr}
          onChange={(e) => setOrgnr(removeSpaces(e.currentTarget.value))}
          type="text"
          id="orgnr"
          aria-describedby="orgnr-sok"
        />
      </Form.Field>
      <Knapp onClick={() => validerInput(orgnr)}>Søk</Knapp>
    </Form>
  );
}

const spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
};

export default Sokefelt;
