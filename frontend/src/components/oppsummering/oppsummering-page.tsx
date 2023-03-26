import React from "react";
import {Grid} from "semantic-ui-react";
import ElvirksomhetsregisterStatuskort from "./elvirksomhetsregister-statuskort";
import EnhetsregisterStatuskort from "./enhetsregister-statuskort";
import FinanstilsynStatuskort from "./finanstilsyn-statuskort";
import MesterbrevStatuskort from "./mesterbrev-statuskort";
import OppsummeringEnhetsregister from "./oppsummering-enhetsregister";
import RenholdsregisteretStatuskort from "./renholdsregisteret-statuskort";
import SentralGodkjenningStatuskort from "./sentralGodkjenning-statuskort";
import VatromregisterStatuskort from "./vatromregister-statuskort";

function OppsummeringPage() {
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
