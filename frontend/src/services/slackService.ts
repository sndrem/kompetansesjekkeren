export function notifySlack(organisasjonsnummer: string) {
  if (import.meta.env.PROD) {
    fetch("/slack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({organisasjonsnummer}),
    });
  } else {
    console.info("Sender ikke slack-notifikasjon ved utvikling");
  }
}
