import { Data } from "./domain";
type RESET_SOK = "SOK/RESET";
type HENT_DATA = "DATA/HENTER_DATA";
type SUBMITTED = "DATA/SUBMITTED_FORM";
type HENTET_DATA_OK = "DATA/HENTET_DATA_OK";
type HENT_DATA_ERROR = "DATA/HENTING_AV_DATA_ERROR";

export interface hentDataAction {
    type: HENT_DATA;
}

export interface resetSokAction {
    type: RESET_SOK;
}

export interface submitFormAction {
    type: SUBMITTED;
}

export interface hentetDataOkAction {
    type: HENTET_DATA_OK;
    data: Data;
}

export interface hentDataError {
    type: HENT_DATA_ERROR;
    error: string;
}

export type EnhetsregisterActions =
    | hentDataAction
    | resetSokAction
    | submitFormAction
    | hentetDataOkAction
    | hentDataError;
