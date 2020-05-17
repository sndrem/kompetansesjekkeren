import React from "react";
import { EnhetsregisterDetaljer } from "../../types/domain";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Table } from "semantic-ui-react";

interface OppsummeringsProps {
  bedriftA?: EnhetsregisterDetaljer;
  bedriftB?: EnhetsregisterDetaljer;
}

function verdiEllerTomt(verdi?: any) {
  return verdi ? verdi : "Ingen data tilgjengelig";
}

function verdierErLike(
  verdiA?: string | number | boolean,
  verdiB?: string | number | boolean,
  negativHvisUlik: boolean = false
) {
  if (!verdiA && !verdiB) return;

  if (negativHvisUlik) {
    return {
      negative: verdiA !== verdiB,
      positive: verdiA === verdiB,
    };
  }

  return {
    positive: verdiA === verdiB,
  };
}

function formaterDato(dato?: string) {
  if (!dato) return dato;

  try {
    return format(new Date(dato), "d. LLLL yyyy", { locale: nb });
  } catch (error) {
    return dato;
  }
}

function Oppsummeringstabell({ bedriftA, bedriftB }: OppsummeringsProps) {
  if (!(bedriftA || bedriftB)) return null;

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            {verdiEllerTomt(bedriftA?.navn)} ({bedriftA?.organisasjonsnummer})
          </Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>
            {verdiEllerTomt(bedriftB?.navn)} ({bedriftB?.organisasjonsnummer})
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row
          {...verdierErLike(
            bedriftA?.detaljer?.Daglig_leder,
            bedriftB?.detaljer?.Daglig_leder,
            true
          )}
        >
          <Table.Cell>
            {verdiEllerTomt(bedriftA?.detaljer?.Daglig_leder)}
          </Table.Cell>
          <Table.Cell>
            <b>Daglig leder / Adm. direktør</b>
          </Table.Cell>
          <Table.Cell>
            {verdiEllerTomt(bedriftB?.detaljer?.Daglig_leder)}
          </Table.Cell>
        </Table.Row>
        <Table.Row
          {...verdierErLike(
            bedriftA?.detaljer?.Daglig_leder,
            bedriftB?.detaljer?.Daglig_leder,
            true
          )}
        >
          <Table.Cell>
            {verdiEllerTomt(bedriftA?.detaljer?.Styrets_leder)}
          </Table.Cell>
          <Table.Cell>
            <b>Styrets leder</b>
          </Table.Cell>
          <Table.Cell>
            {verdiEllerTomt(bedriftB?.detaljer?.Styrets_leder)}
          </Table.Cell>
        </Table.Row>
        <Table.Row
          {...verdierErLike(
            bedriftA?.organisasjonsform?.kode,
            bedriftB?.organisasjonsform?.kode,
            true
          )}
        >
          <Table.Cell>{`${verdiEllerTomt(bedriftA?.organisasjonsform?.kode)} (${
            bedriftA?.organisasjonsform?.beskrivelse
          })`}</Table.Cell>
          <Table.Cell>
            <b>Type bedrift</b>
          </Table.Cell>
          <Table.Cell>{`${verdiEllerTomt(bedriftB?.organisasjonsform?.kode)} (${
            bedriftB?.organisasjonsform?.beskrivelse
          })`}</Table.Cell>
        </Table.Row>
        <Table.Row
          {...verdierErLike(
            bedriftA?.naeringskode1?.kode,
            bedriftB?.naeringskode1?.kode,
            true
          )}
        >
          <Table.Cell>{`${verdiEllerTomt(
            bedriftA?.naeringskode1?.beskrivelse
          )} (${bedriftA?.naeringskode1?.kode})`}</Table.Cell>
          <Table.Cell>
            <b>Næringskode</b>
          </Table.Cell>
          <Table.Cell>{`${verdiEllerTomt(
            bedriftB?.naeringskode1?.beskrivelse
          )} (${bedriftB?.naeringskode1?.kode})`}</Table.Cell>
        </Table.Row>
        <Table.Row
          {...verdierErLike(
            bedriftA?.detaljer?.Signatur,
            bedriftB?.detaljer?.Signatur,
            true
          )}
        >
          <Table.Cell>
            {verdiEllerTomt(bedriftA?.detaljer?.Signatur)}
          </Table.Cell>
          <Table.Cell>
            <b>Signatur</b>
          </Table.Cell>
          <Table.Cell>
            {verdiEllerTomt(bedriftB?.detaljer?.Signatur)}
          </Table.Cell>
        </Table.Row>
        <Table.Row
          {...verdierErLike(
            bedriftA?.underAvvikling,
            bedriftB?.underAvvikling,
            true
          )}
        >
          <Table.Cell>{verdiEllerTomt(bedriftA?.underAvvikling)}</Table.Cell>
          <Table.Cell>
            <b>Under avvikling</b>
          </Table.Cell>
          <Table.Cell>{verdiEllerTomt(bedriftB?.underAvvikling)}</Table.Cell>
        </Table.Row>
        <Table.Row
          {...verdierErLike(
            bedriftA?.stiftelsesdato,
            bedriftB?.stiftelsesdato,
            true
          )}
        >
          <Table.Cell>
            {verdiEllerTomt(formaterDato(bedriftA?.stiftelsesdato))}
          </Table.Cell>
          <Table.Cell>
            <b>Stiftelsesdato</b>
          </Table.Cell>
          <Table.Cell>
            {verdiEllerTomt(formaterDato(bedriftB?.stiftelsesdato))}
          </Table.Cell>
        </Table.Row>
        <Table.Row
          {...verdierErLike(
            bedriftA?.registreringsdatoEnhetsregisteret,
            bedriftB?.registreringsdatoEnhetsregisteret,
            true
          )}
        >
          <Table.Cell>
            {verdiEllerTomt(
              formaterDato(bedriftA?.registreringsdatoEnhetsregisteret)
            )}
          </Table.Cell>
          <Table.Cell>
            <b>Registrert i Enhetsregisteret</b>
          </Table.Cell>
          <Table.Cell>
            {verdiEllerTomt(
              formaterDato(bedriftB?.registreringsdatoEnhetsregisteret)
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

export default Oppsummeringstabell;
