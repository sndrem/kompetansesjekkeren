import assertNever from "assert-never";
import { EnhetsregisterActions } from "./actions";
import { Appstate, initialState } from "./domain";

export function reducer(state: Appstate, action: EnhetsregisterActions): Appstate {
    switch (action.type) {
        case "DATA/HENTER_DATA":
            return {
                ...state,
                loading: true
            };
        case "SETT_ORGNR":
            return {
                ...state,
                orgnr: action.data
            }
        case "DATA/SUBMITTED_FORM":
            return {
                ...state,
                submitted: true,
                loading: true,
                error: ""
            };
        case "DATA/LASTER":
            return {
                ...state,
                loading: true
            }
        case "HENTET_ENHET": {
            return {
                ...state,
                enhetsregisteret: action.data,
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
        case "SOK/RESET": {
            return initialState;
        }
        default: {
            assertNever(action);
            return state;
        }
    }
}
