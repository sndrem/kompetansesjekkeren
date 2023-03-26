export interface Lenke {
  target?: string;
  tekst: string;
  url: string;
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
