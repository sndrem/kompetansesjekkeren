import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "./App.scss";
import Feedback from "./components/feedback/feedback";
import Sokpage from "./pages/sokpage";
import Hovedmeny from "./components/menu/hovedmeny";
import Head2Head from "./pages/head2head";
import { SWRConfig } from "swr";

function fetcher(resource: any, init: any) {
  return fetch(resource, init).then(res => {
    if(res.status === 404) {
      return Promise.resolve(null);
    }
    
    if(!res.ok) {
      throw new Error(`Could not fetch resource: ${resource}`)
    }
    return res.json();
  }).catch(err => {
    throw new Error(err)
  })
}

const App: React.FC = () => {
  return (
    <>
        <SWRConfig value={{
          fetcher,
        }}>
          <Container>
            <HashRouter>
              <Hovedmeny />
              <Switch>
                <Route path="/" exact component={Sokpage} />
                <Route path="/orgnr/:orgnr" exact component={Sokpage} />
                <Route path="/sammenligning" exact component={Head2Head} />
                <Redirect from="*" to="/" />
              </Switch>
            </HashRouter>
            <Feedback />
          </Container>
      </SWRConfig>
    </>
  );
};

export default App;
