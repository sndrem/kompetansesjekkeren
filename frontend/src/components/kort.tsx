import React from 'react';
import { Message } from 'semantic-ui-react';

interface Props {
    tittel: string;
    erOkStatus: boolean;
    children?: JSX.Element[] | JSX.Element;
    orgnr: string;
}

function Kort(props: Props) {

    const color = props.erOkStatus ? "green" : "red";

    if (!props.erOkStatus) {
        return (
            <Message color={color}>
                <Message.Header>{props.tittel}</Message.Header>
                {props.children}
            </Message>
        );
    }

    return (
        <Message color={color}>
            <Message.Header>{props.tittel}</Message.Header>
            {props.children}
        </Message>
    );
}

export default Kort;