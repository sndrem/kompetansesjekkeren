import { Tilbakemelding } from "./../types/domain";
export function notifySlack(organisasjonsnummer: string) {
  if (process.env.REACT_APP_MILJO !== "dev") {
    fetch("/slack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organisasjonsnummer }),
    });
  } else {
    console.info("Sender ikke slack-notifikasjon ved utvikling");
  }
}

export function sendTilbakemelding(
  tilbakemelding: Tilbakemelding
): Promise<Response> {
  return fetch("/slack/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tilbakemelding),
  });
}
