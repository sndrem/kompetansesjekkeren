import React from 'react';
import Container from "@material-ui/core/Container";
import './App.scss';
import { Typography } from '@material-ui/core';
import Sokpage from './pages/sokpage';

const App: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Sokpage />
    </Container>
  );
}

export default App;
