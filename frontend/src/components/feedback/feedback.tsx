import React, { useState } from 'react';
import { Modal, Button, Header, Icon, Form, Select, Label } from 'semantic-ui-react';
import "./feedback.scss";

interface Props {
    onClick: () => void;
}

function FeedbackTrigger(props: Props) {
    return (
        <Button onClick={props.onClick}><Icon name="heart" />Tilbakemelding</Button>
    )
}

function Feedback() {
    const [open, setOpen] = useState(false);
    const [tilbakemelding, setTilbakemelding] = useState({}); // TODO Definer  tilbakemeldingsdomeneobjekt 
    const options = [
        { key: "bug", value: "Bug", text: "Bug" },
        { key: "onske", value: "Ønske", text: "Ønske" },
        { key: "endring", value: "Endring", text: "Endring" },
    ]


    return (
        <Modal trigger={<FeedbackTrigger onClick={() => setOpen(true)} />}
            open={open}
            onClose={() => setOpen(false)}
            closeIcon
        >
            <Modal.Header>Tilbakemelding</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>
                        Du som bruker vet best hva som fungerer og hva som ikke fungerer. Har du ønsker om endringer eller ny funksjonalitet?
                    </p>
                    <Form>
                        <Form.Field>
                            <label>Type tilbakemelding:</label>
                            <Select onChange={} placeholder="Velg type tilbakemelding" options={options} />
                        </Form.Field>
                        <Form.Field>
                            <label>Tilbakemelding</label>
                            <textarea rows={5} cols={10} placeholder="Din tilbakemelding her..."></textarea>
                        </Form.Field>
                        <Form.Field>
                            <Button primary>Send tilbakemelding</Button>
                        </Form.Field>
                    </Form>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default Feedback;