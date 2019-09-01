import { Organisasjonsform } from "./domain";
export interface Appstate {
    error: string;
    loading: boolean;
    submitted: boolean;
    enhetsregisterResult: EnhetsregisterEnhet | null;
    arbeidstilsynResult: ArbeidstilsynResult | null;
    sentralGodkjenningResultat: SentralGodkjenningResultat | null;
}

export interface Sokeresultat {
    organisasjonsnummer: string;
    navn: string;
    organisasjonsform: Organisasjonsform;
    registreringsdatoEnhetsregisteret: string;
    registrertIMvaregisteret: boolean;
    naeringskode1: {
        beskrivelse: string;
        kode: string;
    };
    antallAnsatte: number;
    forretningsadresse: Adresse;
    stiftelsesdato: string;
    institusjonellSektorkode: {
        kode: string;
        beskrivelse: string;
    };
    registrertIForetaksregisteret: boolean;
    registrertIStiftelsesregisteret: boolean;
    registrertIFrivillighetsregisteret: boolean;
    sisteInnsendteAarsregnskap: string;
    konkurs: boolean;
    underAvvikling: boolean;
    underTvangsavviklingEllerTvangsopplosning: boolean;
    maalform: string;

}

export const initialState: Appstate = {
    error: "",
    loading: false,
    submitted: false,
    enhetsregisterResult: null,
    arbeidstilsynResult: null,
    sentralGodkjenningResultat: null
};

export interface EnhetsregisterEnhet {
    organisasjonsnummer: string;
    navn: string;
    organisasjonsform: Organisasjonsform;
    registreringsdatoEnhetsregisteret: string;
    registrertIMvaregisteret: boolean;
    naeringskode1: {
        beskrivelse: string;
        kode: string;
    };
    antallAnsatte: number;
    forretningsadresse: Adresse;
    stiftelsesdato: string;
    institusjonellSektorkode: {
        kode: string;
        beskrivelse: string;
    };
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
    adresse: string[];
    kommune: string;
    kommunenummer: string;
}

export interface ArbeidstilsynResult {
    Organisation: ArbeidstilsynsOrganisasjon;
    RecordStatus: ArbeidstilsynetRecordStatus;
}

export interface ArbeidstilsynsOrganisasjon {
    OrganisationNumber: string;
    OrganisationForm: string;
    Name: string;
    Contact: ArbeidstilsynetContact;
    PostalAdress: ArbeidstilsynetAdress;
    BusinessAdress: ArbeidstilsynetAdress;
    Status: string;
    Link: string;
}

export interface ArbeidstilsynetContact {
    PhoneNumber: string;
    MobileNumber: string;
    WebAddress: string;
}

export interface ArbeidstilsynetAdress {
    Street: string;
    PostalCode: string;
    City: string;
    Municipal: {
        Name: string;
        Number: string;
    };
    County: {
        Name: string;
        Number: string;
    };
    Country: {
        Name: string;
        Number: string;
    };
}

export interface ArbeidstilsynetRecordStatus {
    Id: {
        ExternalId: string;
        StoreId: string;
    };
    OriginalStatus: string;
    Status: string;
    Description: string;
    OrganisationType: number;
    Valid: boolean;
}

export interface SentralGodkjenningResultat {
    status: {
        approved: boolean;
        approval_period_to: string;
        approval_certificate: string;
    };
    enterprise: {
        organizational_number: string;
        name: string;
        www: string | null;
        email: string | null;
        phone: string | null;
    };
}
