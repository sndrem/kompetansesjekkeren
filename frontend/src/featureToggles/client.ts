import * as configcat from "configcat-js";
import { useState, useEffect } from "react";
import { Featuretoggle } from "../types/domain";
const logger = configcat.createConsoleLogger(3);

const configCatClient = configcat.createClientWithAutoPoll(
  "ja_XCKJhVFKYqGOUwi9SEA/y9XwRtpk1UWDIwXFKrD9EA",
  { logger: process.env.NODE_ENV !== "production" ? logger : undefined }
);

export function useHentToggle(
  navn: Featuretoggle,
  defaultVerdi: boolean
): boolean {
  const [verdi, setVerdi] = useState(defaultVerdi);

  useEffect(() => {
    hentToggle(navn).then((value) => setVerdi(value));
  }, [verdi, navn]);

  async function hentToggle(navn: string) {
    return await configCatClient.getValueAsync(navn, false);
  }

  return verdi;
}
