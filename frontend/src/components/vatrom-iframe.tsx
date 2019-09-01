import React from 'react';
import { Message } from 'semantic-ui-react';

function VatromIframe() {
    return (
        <>
            <Message color="blue">
                <Message.Header>Info</Message.Header>
                <p>Per dags dato har ikke Fagrådet for våtrom en tjeneste for å søke etter organisasjoner programatisk. Du kan allikevel benytte deg av søket deres på deres egen nettside under her.</p>
            </Message>
            <iframe title="Våtrom" className="iframe" src="http://www.ffv.no/finn-godkjent-vatromsbedrift"></iframe>
        </>
    )
}

export default VatromIframe;