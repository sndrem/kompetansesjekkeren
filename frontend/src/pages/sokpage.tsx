import React, {Context, createContext, Dispatch, useEffect} from "react";
import {RouteComponentProps} from "react-router";
import {Divider, Grid, Header, Loader, Message} from "semantic-ui-react";
import {trpc} from "../api/trpcApi";
import NyttigeLenker from "../components/nyttige-lenker/nyttige-lenker";
import OppsummeringPage from "../components/oppsummering/oppsummering-page";
import Sokefelt from "../components/sokefelt/sokefelt";
import {useOrgnrFraUrl} from "../hooks/useOrgnrFraUrl";
import {nyttigeLenker} from "../konstanter/konstanter";
import {notifySlack} from "../services/slackService";
import {EnhetsregisterActions} from "../types/actions";
import {Appstate, initialState} from "../types/domain";
import "./sokpage.scss";

export const StateContext = createContext<Appstate>(initialState);
export const DispatchContext: Context<Dispatch<EnhetsregisterActions>> =
  createContext({} as any);

interface MatchParams {
  orgnr: string;
}

export function hentData<T>(url: string, orgnr: string): Promise<T> {
  return fetch(`${url}?organisasjonsnummer=${orgnr}`).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

function Sokpage(props: RouteComponentProps<MatchParams>) {
  const orgnr = useOrgnrFraUrl();
  const {data, isLoading, error} =
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
        <Loader active={isLoading}>Laster data...</Loader>
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
      </div>
    </>
  );
}

export default Sokpage;
