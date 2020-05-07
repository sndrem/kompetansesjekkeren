import React, { useState } from "react";
import { Modal, Button, Icon, Form, Select } from "semantic-ui-react";
import { TypeTilbakemelding } from "../../types/domain";
import { sendTilbakemelding } from "../../services/slackService";

interface Props {
  onClick: () => void;
}

function FeedbackTrigger(props: Props) {
  return (
    <Button className="feedback-btn" onClick={props.onClick}>
      <Icon name="heart" />
      Tilbakemelding
    </Button>
  );
}

function Feedback() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TypeTilbakemelding>("Ros");
  const [tilbakemelding, setTilbakemelding] = useState("");
  const [submitOk, setSubmitOk] = useState(false);
  const [laster, setLaster] = useState(false);
  const options = [
    { key: "ros", value: "Ros", text: "Ros" },
    { key: "bug", value: "Bug", text: "Bug" },
    { key: "onske", value: "Ønske", text: "Ønske" },
    { key: "endring", value: "Endring", text: "Endring" },
  ];

  function submitTilbakemelding(e: React.MouseEvent) {
    e.preventDefault();
    if (type && tilbakemelding) {
      setLaster(true);
      sendTilbakemelding({ type, tilbakemelding })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Klarte ikke gi tilbakemelding");
          }
          return response.json();
        })
        .then((data) => {
          setSubmitOk(true);
          setType("Ros");
          setTilbakemelding("");
          setLaster(false);
        })
        .catch(() => {
          setSubmitOk(false);
          setType("Ros");
          setTilbakemelding("");
          setLaster(false);
        });
    }
  }

  return (
    <Modal
      trigger={<FeedbackTrigger onClick={() => setOpen(true)} />}
      open={open}
      onClose={() => {
        setOpen(false);
        setSubmitOk(false);
        setLaster(false);
        setTilbakemelding("");
      }}
      closeIcon
    >
      <Modal.Header>Tilbakemelding</Modal.Header>
      <Modal.Content>
        {!laster && submitOk && <p>Takk for din tilbakemelding</p>}
        {!laster && !submitOk && (
          <Modal.Description>
            <p>
              Du som bruker vet best hva som fungerer og hva som ikke fungerer.
              Har du ønsker om endringer eller ny funksjonalitet? Send av gårde
              en melding da vel{" "}
              <span role="img" aria-label="Emoji med stjerneøyne">
                🤩
              </span>
            </p>
            <Form>
              <Form.Field>
                <label>Type tilbakemelding:</label>
                <Select
                  value={type}
                  onChange={(e, data) =>
                    setType(data.value as TypeTilbakemelding)
                  }
                  placeholder="Velg type tilbakemelding"
                  options={options}
                />
              </Form.Field>
              <Form.Field>
                <label>Tilbakemelding</label>
                <textarea
                  value={tilbakemelding}
                  onChange={(e) => setTilbakemelding(e.currentTarget.value)}
                  rows={5}
                  cols={10}
                  placeholder="Din tilbakemelding her..."
                ></textarea>
              </Form.Field>
              <Form.Field>
                <Button
                  type="button"
                  onClick={(e) => submitTilbakemelding(e)}
                  primary
                >
                  Send tilbakemelding
                </Button>
              </Form.Field>
            </Form>
          </Modal.Description>
        )}
      </Modal.Content>
    </Modal>
  );
}

export default Feedback;
