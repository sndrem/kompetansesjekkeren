import { motion } from "framer-motion";
import React, { useState } from "react";
import { Form, Message } from "semantic-ui-react";
import styled from "styled-components";

interface Props {
  onSubmit: (orgnr: string) => void;
}

const Knapp = styled(motion.button)`
  background: #2185d0;
  color: white;
  padding: 1rem;
  border-radius: 15px;

  &:hover {
    cursor: pointer;
  }
`;

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
    <Form action="#" onSubmit={(e) => e.preventDefault()}>
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
      <Knapp
        whileHover={{ scale: 1.1 }}
        transition={spring}
        onClick={() => validerInput(orgnr)}
      >
        Søk
      </Knapp>
    </Form>
  );
}

const spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
};

export default Sokefelt;
