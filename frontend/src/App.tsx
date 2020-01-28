import React from "react";
import { Container } from "semantic-ui-react";
import "./App.scss";
import Sokpage from "./pages/sokpage";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Feedback from "./components/feedback/feedback";

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
      <Feedback />
    </Container>
  );
};

export default App;
