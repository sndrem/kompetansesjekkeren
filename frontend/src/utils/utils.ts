export function oppdaterWebadresse(adresse: string): string {
    if (adresse.indexOf("http") === -1) {
        return `http://${adresse}`;
    }
    return adresse;
}