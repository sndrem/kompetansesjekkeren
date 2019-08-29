import { Appstate } from './domain';
import { EnhetsregisterActions } from './actions';
import assertNever from "assert-never";

export function reducer(state: Appstate, action: EnhetsregisterActions): Appstate {
    switch (action.type) {
        case "ENHETSREGISTER/HENT_FRA_ENHETSREGISTER":
            return {
                ...state,
                loading: true
            }
        case "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK":
            return {
                ...state,
                enhetsregisterResult: action.data,
                loading: false,
                error: "",
            }
        case "ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_ERROR": {
            return {
                ...state,
                loading: false,
                error: action.error
            }
        }
        default: {
            assertNever(action);
            return state;
        }
    }
}