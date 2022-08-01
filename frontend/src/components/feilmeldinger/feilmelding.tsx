import React from "react";
import {Message, Icon, MessageSizeProp} from "semantic-ui-react";

interface Props {
  size: MessageSizeProp;
  headerTekst: string;
  bodyTekst: React.ReactNode;
}

function Feilmelding({size, headerTekst, bodyTekst}: Props) {
  return (
    <Message size={size} color="grey">
      <Message.Header>
        {headerTekst} <Icon name="warning sign" />
      </Message.Header>
      {bodyTekst}
    </Message>
  );
}

export default Feilmelding;
