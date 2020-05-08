import React, { useEffect, useState } from "react";
import {
  Button,
  Dimmer,
  Header,
  Icon,
  Input,
  Loader,
  Segment,
} from "semantic-ui-react";
import styled from "styled-components";
import Oppsummeringstabell from "../components/oppsummering/oppsummeringstabell";
import { removeSpaces } from "../components/sokefelt/sokefelt";
import { SOK_DETALJERT_ENHET } from "../konstanter";
import { EnhetsregisterDetaljer } from "../types/domain";
import { hentData } from "./sokpage";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
`;

const Center = styled.div`
  text-align: center;
`;

function Head2Head() {
  const [bedriftAOrgnr, setBedriftAOrgnr] = useState("");
  const [bedriftBOrgnr, setBedriftBOrgnr] = useState("");
  const [bedriftA, setBedriftA] = useState<undefined | EnhetsregisterDetaljer>(
    undefined
  );
  const [bedriftB, setBedriftB] = useState<undefined | EnhetsregisterDetaljer>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  function swapSok() {
    const a = bedriftAOrgnr;
    const b = bedriftBOrgnr;
    setBedriftAOrgnr(b);
    setBedriftBOrgnr(a);
  }

  useEffect(() => {
    if (bedriftAOrgnr.length === 9 && bedriftBOrgnr.length === 9) {
      hentOrganisasjonsdata(bedriftAOrgnr, bedriftBOrgnr);
    }

    async function hentOrganisasjonsdata(orgnrA: string, orgnrB: string) {
      const fetchBedriftA = hentData<EnhetsregisterDetaljer>(
        SOK_DETALJERT_ENHET,
        orgnrA
      );
      const fetchBedriftB = hentData<EnhetsregisterDetaljer>(
        SOK_DETALJERT_ENHET,
        orgnrB
      );
      setLoading(true);
      const [responseA, responseB] = await Promise.all([
        fetchBedriftA,
        fetchBedriftB,
      ]);
      setLoading(false);
      setBedriftA(responseA);
      setBedriftB(responseB);
    }
  }, [bedriftAOrgnr, bedriftBOrgnr]);

  return (
    <>
      <Center>
        <h1>Sammenlign to bedrifter i Enhetsregisteret</h1>
      </Center>
      <Wrapper>
        <div>
          <Header as="h3">Organisasjonsnummer for bedrift A</Header>
          <Input
            placeholder="Organisasjonsnummer - 9 siffer"
            value={bedriftAOrgnr}
            onChange={(e) =>
              setBedriftAOrgnr(removeSpaces(e.currentTarget.value))
            }
            type="text"
            aria-describedby="orgnr-sok"
          />
        </div>
        <div>
          <Button onClick={swapSok}>
            <Icon name="arrows alternate horizontal" />
            Omvendt
          </Button>
        </div>
        <div>
          <Header as="h3">Organisasjonsnummer for bedrift B</Header>
          <Input
            placeholder="Organisasjonsnummer - 9 siffer"
            value={bedriftBOrgnr}
            onChange={(e) =>
              setBedriftBOrgnr(removeSpaces(e.currentTarget.value))
            }
            type="text"
            aria-describedby="orgnr-sok"
          />
        </div>
      </Wrapper>
      <Segment>
        <Dimmer inverted active={loading}>
          <Loader>Laster data...</Loader>
        </Dimmer>
        <Oppsummeringstabell bedriftA={bedriftA} bedriftB={bedriftB} />
      </Segment>
    </>
  );
}

export default Head2Head;
