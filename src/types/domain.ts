export interface Appstate {
    error: string;
    loading: boolean;
    enhetsregisterResult: EnhetsregisterEnheter | null;
}

export const initialState: Appstate = {
    error: "",
    loading: false,
    enhetsregisterResult: null
}

export interface EnhetsregisterEnheter {
    enheter: Array<EnhetsregisterEnhet>;
}

export interface EnhetsregisterEnhet {
    organisasjonsnummer: string;
    navn: string;
    organisasjonsform: Organisasjonsform;
    registreringsdatoEnhetsregisteret: string;
    registrertIMvaregisteret: boolean;
    naeringskode1: {
        beskrivelse: string;
        kode: string;
    }
    antallAnsatte: number;
    forretningsadresse: Adresse;
    stiftelsesdato: string;
    institusjonellSektorkode: {
        kode: string;
        beskrivelse: string;
    }
    registrertIForetaksregisteret: boolean;
    registrertIStiftelsesregisteret: boolean;
    registrertIFrivillighetsregisteret: boolean;
    sisteInnsendteAarsregnskap: string;
    konkurs: boolean;
    underAvvikling: boolean;
    underTvangsavviklingEllerTvangsopplosning: boolean;
    maalform: string;
}

export interface Organisasjonsform {
    kode: string;
    beskrivelse: string;
}

export interface Adresse {
    land: string;
    landkode: string;
    postnummer: string;
    poststed: string;
    adresse: Array<string>;
    kommune: string;
    kommunenummer: string;
}
