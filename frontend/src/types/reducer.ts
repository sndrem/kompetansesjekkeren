import assertNever from "assert-never";
import { EnhetsregisterActions } from "./actions";
import { Appstate } from "./domain";

export function reducer(state: Appstate, action: EnhetsregisterActions): Appstate {
    switch (action.type) {
        case "DATA/HENTER_DATA":
            return {
                ...state,
                loading: true
            };
        case "DATA/SUBMITTED_FORM":
            return {
                ...state,
                submitted: true,
                loading: true,
                error: ""
            };
        case "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK":
            return {
                ...state,
                enhetsregisterResult: action.data,
                submitted: true,
                loading: false,
                error: "",
            };
        case "ARBEIDSTILSYNET/HENTET_FRA_ARBEIDSTILSYNET_OK": {
            return {
                ...state,
                arbeidstilsynResult: action.data,
                submitted: true,
                loading: false,
                error: ""
            };
        }
        case "SENTRAL_GODKJENNING/HENTET_FRA_SENTRAL_GODKJENNING_OK": {
            return {
                ...state,
                sentralGodkjenningResultat: action.data,
                submitted: true,
                loading: false,
                error: ""
            };
        }
        case "DATA/HENTING_AV_DATA_ERROR": {
            return {
                ...state,
                loading: false,
                error: action.error,
                submitted: true
            };
        }
        default: {
            assertNever(action);
            return state;
        }
    }
}
