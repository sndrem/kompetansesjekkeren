export async function notifySlack(organisasjonsnummer: string) {
  if (import.meta.env.PROD) {
    const response = await fetch("/slack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({organisasjonsnummer}),
    });
    if (!response.ok) {
      console.log("Klarte ikke sende til Slack");
    }
    const data = await response.json();
    console.log("Slack-response: ", JSON.stringify(data, null, 2));
  } else {
    console.info("Sender ikke slack-notifikasjon ved utvikling");
  }
}
