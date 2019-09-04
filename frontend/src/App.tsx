import React from "react";
import { Container } from "semantic-ui-react";
import "./App.scss";
import Sokpage from "./pages/sokpage";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Container>
      <HashRouter>
        <Switch>
          <Route path="/" exact component={Sokpage} />
          <Route path="/orgnr/:orgnr" exact component={Sokpage} />
          <Redirect from="*" to="/" />
        </Switch>
      </HashRouter>
    </Container>
  );
};

export default App;
