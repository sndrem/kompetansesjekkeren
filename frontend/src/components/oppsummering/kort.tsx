import React, { ReactNode } from "react";
import { Message, MessageSizeProp } from "semantic-ui-react";

interface Props {
  tittel: string;
  erOkStatus: boolean;
  children: ReactNode;
  orgnr: string;
  size: MessageSizeProp;
}

function Kort(props: Props) {
  const color = props.erOkStatus ? "green" : "red";

  return (
    <Message size={props.size} color={color}>
      <Message.Header>{props.tittel}</Message.Header>
      {props.children}
    </Message>
  );
}

export default Kort;
