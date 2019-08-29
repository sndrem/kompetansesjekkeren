import { EnhetsregisterEnheter } from './domain';
type HENT_FRA_ENHETSREGISTER = "ENHETSREGISTER/HENT_FRA_ENHETSREGISTER";
type HENTET_FRA_ENHETSREGISTER_OK = "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK";
type HENTET_FRA_ENHETSREGISTER_ERROR = "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_ERROR";

export type hentFraEnhetsregisterAction = {
    type: HENT_FRA_ENHETSREGISTER;
}

export type hentetFraEnhetsregisterOkAction = {
    type: HENTET_FRA_ENHETSREGISTER_OK,
    data: EnhetsregisterEnheter
}

export type hentetFraEnhetsregisterErrorAction = {
    type: HENTET_FRA_ENHETSREGISTER_ERROR,
    error: string;
}

export type EnhetsregisterActions =
    | hentFraEnhetsregisterAction
    | hentetFraEnhetsregisterOkAction
    | hentetFraEnhetsregisterErrorAction