import { EnhetsregisterEnhet, SentralGodkjenningResultat, ArbeidstilsynResult } from "./domain";
type HENT_DATA = "DATA/HENTER_DATA";
type SUBMITTED = "DATA/SUBMITTED_FORM";
type HENTET_FRA_ENHETSREGISTER_OK = "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK";
type HENTET_FRA_ARBEIDSTILSYNET_OK = "ARBEIDSTILSYNET/HENTET_FRA_ARBEIDSTILSYNET_OK";
type HENTET_FRA_SENTRAL_GODKJENNING_PK = "SENTRAL_GODKJENNING/HENTET_FRA_SENTRAL_GODKJENNING_OK";
type HENT_DATA_ERROR = "DATA/HENTING_AV_DATA_ERROR";

export interface hentDataAction {
    type: HENT_DATA;
}

export interface submitFormAction {
    type: SUBMITTED;
}

export interface hentetFraEnhetsregisterOkAction {
    type: HENTET_FRA_ENHETSREGISTER_OK;
    data: EnhetsregisterEnhet;
}

export interface hentetFraArbeidstilsynetOkAction {
    type: HENTET_FRA_ARBEIDSTILSYNET_OK;
    data: ArbeidstilsynResult;
}

export interface hentetFraSentralGodkjenningOkAction {
    type: HENTET_FRA_SENTRAL_GODKJENNING_PK;
    data: SentralGodkjenningResultat;
}

export interface hentDataError {
    type: HENT_DATA_ERROR;
    error: string;
}

export type EnhetsregisterActions =
    | hentDataAction
    | submitFormAction
    | hentetFraEnhetsregisterOkAction
    | hentetFraArbeidstilsynetOkAction
    | hentetFraSentralGodkjenningOkAction
    | hentDataError;
