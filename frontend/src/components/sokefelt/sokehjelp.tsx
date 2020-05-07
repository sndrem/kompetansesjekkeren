import React from "react";
import { Header } from "semantic-ui-react";

function Sokehjelp() {
  return (
    <>
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
    </>
  );
}

export default Sokehjelp;
