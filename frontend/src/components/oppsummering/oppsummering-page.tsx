import React, {useContext} from "react";
import {StateContext} from "../../pages/sokpage";
import {Grid} from "semantic-ui-react";
import EnhetsregisterStatuskort from "./enhetsregister-statuskort";
import RenholdsregisteretStatuskort from "./renholdsregisteret-statuskort";
import SentralGodkjenningStatuskort from "./sentralGodkjenning-statuskort";
import OppsummeringEnhetsregister from "./oppsummering-enhetsregister";
import VatromregisterStatuskort from "./vatromregister-statuskort";
import MesterbrevStatuskort from "./mesterbrev-statuskort";
import FinanstilsynStatuskort from "./finanstilsyn-statuskort";
import ElvirksomhetsregisterStatuskort from "./elvirksomhetsregister-statuskort";

function OppsummeringPage() {
  const state = useContext(StateContext);

  return (
    <>
      <Grid.Column width={8} style={{marginBottom: "2rem"}}>
        <EnhetsregisterStatuskort size="large" />
        <RenholdsregisteretStatuskort size="large" />
        <SentralGodkjenningStatuskort size="large" />
        <VatromregisterStatuskort size="large" />
        <MesterbrevStatuskort size="large" />
        <FinanstilsynStatuskort size="large" />
        <ElvirksomhetsregisterStatuskort size="large" />
      </Grid.Column>
      <Grid.Column width={5}>
        <OppsummeringEnhetsregister />
      </Grid.Column>
    </>
  );
}

export default OppsummeringPage;
