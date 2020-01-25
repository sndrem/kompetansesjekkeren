import { Data, EnhetsregisterEnhet, RenholdsregisterOrganisasjon, SentralGodkjenningResultat, VatromregisterResultat, MesterbrevResultat } from "./domain";
type RESET_SOK = "SOK/RESET";
type SETT_ORGNR = "SETT_ORGNR";
type HENT_DATA = "DATA/HENTER_DATA";
type SUBMITTED = "DATA/SUBMITTED_FORM";
type HENTET_ENHET = "HENTET_ENHET";
type HENT_DATA_ERROR = "DATA/HENTING_AV_DATA_ERROR";

export interface hentDataAction {
    type: HENT_DATA;
}

export interface settOrgnrAction {
    type: SETT_ORGNR,
    data: string;
}

export interface resetSokAction {
    type: RESET_SOK;
}

export interface submitFormAction {
    type: SUBMITTED;
}

export interface hentetEnhetAction {
    type: HENTET_ENHET,
    data: EnhetsregisterEnhet
}

export interface hentDataError {
    type: HENT_DATA_ERROR;
    error: string;
}

export type EnhetsregisterActions =
    | hentDataAction
    | settOrgnrAction
    | resetSokAction
    | submitFormAction
    | hentetEnhetAction
    | hentDataError;