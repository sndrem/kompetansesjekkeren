import React from "react";
import { Container } from "semantic-ui-react";
import "./App.scss";
import Sokpage from "./pages/sokpage";

const App: React.FC = () => {
  return (
    <Container>
      <Sokpage />
    </Container>
  );
};

export default App;
