import React from "react";
import Sokefelt from "../components/sokefelt/sokefelt";
import Enhetsregistersok from "../components/enhetsregistersok/enhetsregistersok";
import styled from "styled-components";

const Sokegrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;
  grid-template-rows: 1fr auto;
`;

function Head2Head() {
  return (
    <>
      <h1>Sammenlign to bedrifter i Enhetsregisteret</h1>
      <Sokegrid>
        <Enhetsregistersok tittel="Bedrift A" />
        <Enhetsregistersok tittel="Bedrift B" />
      </Sokegrid>
    </>
  );
}

export default Head2Head;
