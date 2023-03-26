import React, {useEffect} from "react";
import {RouteComponentProps} from "react-router";
import {Divider, Grid, Header, Loader, Message} from "semantic-ui-react";
import {trpc} from "../api/trpcApi";
import NyttigeLenker from "../components/nyttige-lenker/nyttige-lenker";
import OppsummeringPage from "../components/oppsummering/oppsummering-page";
import Sokefelt from "../components/sokefelt/sokefelt";
import {useOrgnrFraUrl} from "../hooks/useOrgnrFraUrl";
import {nyttigeLenker} from "../konstanter/konstanter";
import {notifySlack} from "../services/slackService";
import "./sokpage.scss";

interface MatchParams {
  orgnr: string;
}

function Sokpage(props: RouteComponentProps<MatchParams>) {
  const orgnr = useOrgnrFraUrl();
  const {data, isInitialLoading, error} =
    trpc.kompetansesjekker.enhetsregisteret.useQuery(orgnr, {
      enabled: !!orgnr,
    });

  useEffect(() => {
    if (orgnr) {
      notifySlack(orgnr);
    }
  }, [orgnr]);

  function sokPaOrgnr(orgnr: string) {
    props.history.push(`/orgnr/${orgnr}`);
  }

  return (
    <>
      <div className="sokeside">
        <Sokefelt onSubmit={sokPaOrgnr} />
      </div>
      <NyttigeLenker lenker={nyttigeLenker} />
      <Divider />
      <div className="container">
        <Loader active={isInitialLoading}>Laster data...</Loader>
        {error && (
          <Message color="red">
            <Message.Header>
              Oisann{" "}
              <span role="img" aria-label="Oisann-ikon">
                🙈
              </span>
            </Message.Header>
            {error?.message}
          </Message>
        )}
        {data ? (
          <Grid>
            <Grid.Column width="16">
              {data && (
                <Header as="h3">
                  Du har søkt på {data?.navn} med orgnr: {orgnr}
                </Header>
              )}
            </Grid.Column>
            <div className="container">
              <OppsummeringPage />
            </div>
          </Grid>
        ) : null}
      </div>
    </>
  );
}

export default Sokpage;
