import {useParams} from "react-router";

export function useOrgnrFraUrl(): string {
  return useParams<{orgnr: string}>()?.orgnr;
}
