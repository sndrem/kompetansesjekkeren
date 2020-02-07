export interface Appstate {
  error: string;
  orgnr: string;
  loading: boolean;
  submitted: boolean;
  enhetsregisteret: EnhetsregisterEnhet | null;
}

export const initialState: Appstate = {
  error: "",
  orgnr: "",
  loading: false,
  submitted: false,
  enhetsregisteret: null
};

export interface Data {
  enhetsregisteret: EnhetsregisterEnhet | null;
  arbeidstilsynet: RenholdsregisterOrganisasjon | null;
  sentralgodkjenning: SentralGodkjenningResultat | null;
  vatromsregisteret: VatromregisterResultat | null;
  mesterbrev: MesterbrevResultat | null;
}

export interface EnhetsregisterEnhet {
  organisasjonsnummer: string;
  navn: string;
  hjemmeside?: string;
  organisasjonsform: Organisasjonsform;
  registreringsdatoEnhetsregisteret: string;
  registrertIMvaregisteret: boolean;
  naeringskode1?: {
    beskrivelse: string;
    kode: string;
  };
  antallAnsatte: number;
  forretningsadresse?: Adresse;
  stiftelsesdato?: string;
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
  overordnetEnhet?: string;
}

export interface Organisasjonsform {
  kode: string;
  beskrivelse: string;
}

export interface Lenke {
  target?: string;
  tekst: string;
  url: string;
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

export interface RenholdsregisterOrganisasjon {
  Organisasjonsnummer: string;
  Navn: string;
  Adresse: ArbeidstilsynetAdress;
  Underavdelinger?: {
    Avdeling:
      | Array<RenholdsregisterOrganisasjon>
      | RenholdsregisterOrganisasjon;
  };
  Status: string;
}

export interface ArbeidstilsynetAdress {
  Gateadresse: string;
  Postnummer: string;
  Poststed: string;
  Kommunenummer: string;
  Kommune: string;
  Fylkesnummer: string;
  Fylke: string;
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

export interface VatromregisterResultat {
  bedriftsnavn: string;
  fylke: string;
  poststed: string;
  typeVirksomhet: string;
  orgnr: string;
  adresse: string;
  tlf: string;
  nettside: string;
  navn: string;
  epost: string;
  mobnr: string;
  godkjent: boolean;
}

export interface MesterbrevResultat {
  sted: string;
  postnr: string;
  navn: string;
  antallMestereIBedriften: string;
  fag: string;
}

export type TypeTilbakemelding = "Bug" | "Ønske" | "Endring" | "Ros";

export interface Tilbakemelding {
  type: TypeTilbakemelding;
  tilbakemelding: string;
}
