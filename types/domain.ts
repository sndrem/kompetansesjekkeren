export interface EnhetsregisterEnhet {
  organisasjonsnummer: string;
  navn: string;
  hjemmeside?: string;
  organisasjonsform: Organisasjonsform;
  registreringsdatoEnhetsregisteret: string;
  registrertIMvaregisteret: boolean;
  naeringskode1?: {
    beskrivelse: string;
    kode?: string;
  };
  antallAnsatte: number;
  forretningsadresse?: Adresse;
  stiftelsesdato?: string;
  institusjonellSektorkode: {
    kode?: string;
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
export interface EnhetsregisterDetaljer extends EnhetsregisterEnhet {
  detaljer: {
    slettet?: string;
    Daglig_leder?: string;
    Innehaver?: string;
    Kontaktperson?: string;
    Styre?: string;
    Styrets_leder?: string;
    Varamedlem?: string;
    Signatur?: string;
  };
}

export interface Organisasjonsform {
  kode?: string;
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
  Hovedenhet: Hovedenhet;
  Underenheter: Underenheter;
}

interface Underenheter {
  Avdeling: Avdeling;
}

interface Avdeling {
  Avgrensning: string;
  Organisasjonsnummer: string;
  Navn: string;
  Næringskoder: Nringskoder;
  Kontaktinformasjon: Kontaktinformasjon;
  Stedsinformasjon: Stedsinformasjon;
}

interface Hovedenhet {
  Organisasjonsnummer: string;
  Organisasjonsform: string;
  Navn: string;
  Næringskoder: Nringskoder;
  Godkjenningsstatus: string;
  Kontaktinformasjon: Kontaktinformasjon;
  Stedsinformasjon: Stedsinformasjon;
}

interface Stedsinformasjon {
  Postadresse: Postadresse;
  Forretningsadresse: Forretningsadresse;
}

interface Forretningsadresse {
  Adresselinje1: string;
  Adresselinje2: Telefon;
  Postnummer: string;
  Poststed: string;
  Kommunenummer: string;
  Kommunenavn: string;
  Fylkesnummer: string;
  Fylkesnavn: string;
  Landkode: string;
  Land: string;
}

interface Postadresse {
  Adresselinje1: Telefon;
  Adresselinje2: Telefon;
  Postnummer: Telefon;
  Poststed: Telefon;
  Landkode: Telefon;
  Land: Telefon;
}

interface Kontaktinformasjon {
  Telefon: Telefon;
  Mobil: Telefon;
  Webadresse: Telefon;
}

interface Telefon {}

interface Nringskoder {
  Kode: Kode;
}

interface Kode {
  verdi: string;
  $t: string;
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
  godkjent: boolean;
  navn: string;
  bransje: string;
  orgnr: string;
  mobnr: string;
  nettside: string;
  epost: string;
}

export interface MesterbrevResultat {
  sted: string;
  postnr: string;
  navn: string;
  antallMestereIBedriften: string;
  fag: string;
}

export interface FinanstilsynResultat {
  page: number;
  total: number;
  hitsReturned: number;
  legalEntities: LegalEntity[];
}

interface LegalEntity {
  legalEntityId: number;
  parentId?: any;
  legalEntityType: string;
  finanstilsynetId: string;
  organisationNumber: string;
  leiCode?: any;
  auditorNumber?: any;
  name: string;
  licences: Licence[];
  addresses: Address[];
  links?: any;
  relationsToOther?: any;
  participants?: any;
  participatesIn?: any;
  remarks?: any;
}

interface Address {
  type: string;
  addressLines: string;
  postalCode: string;
  postalLocation: string;
  region: string;
  country: Country;
}

interface Licence {
  licensedEntity: LicensedEntity;
  serviceProviderId: number;
  licenceType: LicenceType;
  licenceClassification?: any;
  supervisoryAuthority: SupervisoryAuthority;
  hasSecurity?: any;
  registeredDate: string;
  serviceProviderType: string;
  remarks?: any;
  services: any[];
  borderCrossingActivity: any[];
  cooperationGroups?: any;
  roles?: any;
  agentsOrBranches?: any;
  accreditedAuditors?: any;
  auditorFor?: any;
}

interface SupervisoryAuthority {
  country: Country;
  legalEntityId: number;
  legalEntityName: string;
}

interface Country {
  iso3: string;
  name: Name;
}

interface LicenceType {
  code: string;
  name: Name;
  description: Name;
}

interface Name {
  norwegian: string;
  english: string;
}

interface LicensedEntity {
  legalEntityId: number;
  legalEntityName: string;
}

export type TypeTilbakemelding = "Bug" | "Ønske" | "Endring" | "Ros";

export interface Tilbakemelding {
  type: TypeTilbakemelding;
  tilbakemelding: string;
}

export type Featuretoggle =
  | "feil_for_vatrom"
  | "feil_for_enhetsregister"
  | "feil_for_mesterbrev"
  | "feil_for_renholdsregisteret"
  | "feil_for_sentralgodkjenning"
  | "vis_sammenligningsside"
  | "feil_for_finanstilsynet"
  | "feil_for_elvirksomhetsregisteret";

export interface ElvirksomhetsregisterResult {
  totalHits: number;
  hitsReturned: number;
  skipped: number;
  hits: Hit[];
}

interface Hit {
  name: string;
  contactInfo: ContactInfo;
  businessNumber: string;
  organisationNumber: string;
  organisationType: string;
  id: string;
  professionalResponsible: string;
  responsibleDLE: string;
  numberOfElectricityWorkers: string;
  numberOfCaseWorkers: string;
  numberOfApprentices: string;
  tasks: Task[];
  facilities: Task[];
  equipments: any[];
}

interface Task {
  id: number;
  sortId: number;
  name: string;
  type: string;
}

interface ContactInfo {
  visitingAddress: string;
  postalCode: string;
  postalName: string;
  postAddress: string;
  municipality: string;
  email: string;
  fax?: any;
  phoneNumber: string;
}

export interface EkomBedrift {
  autorisasjonsnummer: string;
  kategori: "TIA" | "RIA" | "KIA" | "ENA";
  firmanavn: string;
  organisasjonsnummer: string;
  underenhet?: string;
}
