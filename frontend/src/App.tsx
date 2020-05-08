import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "./App.scss";
import Feedback from "./components/feedback/feedback";
import Sokpage from "./pages/sokpage";
import Hovedmeny from "./components/menu/hovedmeny";
import Head2Head from "./pages/head2head";

const App: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default App;
