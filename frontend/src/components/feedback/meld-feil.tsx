import React from 'react';
import { Message } from 'semantic-ui-react';

function MeldFeil() {
    return (
        <Message size="small" compact>
            <Message.Header>Feil på siden?</Message.Header>
            <p>Ser du noe på siden som ikke stemmer, <a href="mailto:sndrem@gmail.com">send en mail til utvikler</a>. Legg gjerne med hvilket organisasjonsnummer du søkte på og eventuelt hva som skjedde. Skjermbilder hvis feil har oppstått er også fint.</p>
        </Message>
    )
}

export default MeldFeil;