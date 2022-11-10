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

function OppsummeringPage() {
  const state = useContext(StateContext);

  return (
    <>
      <Grid.Column width={8} style={{marginBottom: "2rem"}}>
        {state.submitted && <EnhetsregisterStatuskort size="large" />}
        {state.submitted && <RenholdsregisteretStatuskort size="large" />}
        {state.submitted && <SentralGodkjenningStatuskort size="large" />}
        {state.submitted && <VatromregisterStatuskort size="large" />}
        {state.submitted && <MesterbrevStatuskort size="large" />}
        {state.submitted && <FinanstilsynStatuskort size="large" />}
      </Grid.Column>
      <Grid.Column width={5}>
        <OppsummeringEnhetsregister />
      </Grid.Column>
    </>
  );
}

export default OppsummeringPage;
