export function oppdaterWebadresse(adresse: string): string {
  if (adresse.indexOf("http") === -1) {
    return `http://${adresse}`;
  }
  return adresse;
}

export function genererSokeurl(url: string, orgnr: string) {
  return `${url}?organisasjonsnummer=${orgnr}`;
}
