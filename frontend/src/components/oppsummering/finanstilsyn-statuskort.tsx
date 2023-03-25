import React, {useContext} from "react";
import {Message, MessageSizeProp} from "semantic-ui-react";
import {trpc} from "../../api/trpcApi";
import {useHentToggle} from "../../featureToggles/client";
import {SOK_FINANSTILSYN} from "../../konstanter";
import {StateContext} from "../../pages/sokpage";
import {Appstate, FinanstilsynResultat} from "../../types/domain";
import {genererSokeurl} from "../../utils/utils";
import Feilmelding from "../feilmeldinger/feilmelding";
import Kort from "./kort";

interface Props {
  size: MessageSizeProp;
}

function FinanstilsynStatuskort(props: Props) {
  return <p>Må fikse FinanstilsynStatuskort</p>;
  // const state = useContext<Appstate>(StateContext);
  // const {orgnr} = state;
  // const data = trpc.kompetansesjekker.finanstilsynet.useQuery(orgnr);
  // console.log(data);
  // const erFeil = useHentToggle("feil_for_finanstilsynet", false);

  // if (erFeil) {
  //   return (
  //     <Feilmelding
  //       size={props.size}
  //       headerTekst="Finanstilsynet"
  //       bodyTekst={
  //         <>
  //           <p>
  //             Det er for øyeblikket ikke mulig å sjekke bedrifter hos
  //             Finanstilsynet
  //           </p>
  //         </>
  //       }
  //     ></Feilmelding>
  //   );
  // }

  // if (data?.hitsReturned === 0) {
  //   return (
  //     <Message size={props.size} color="red">
  //       <Message.Header>Finanstilsynet</Message.Header>
  //       <p>Fant ingen data for {state.orgnr} hos Finanstilsynet.</p>
  //     </Message>
  //   );
  // }

  // const resultat = data?.legalEntities[0];
  // const optionalRegnskapsforerData = resultat?.licences?.find(
  //   (license) => license.licenceType.code === "REGS"
  // );

  // const tekst = optionalRegnskapsforerData
  //   ? `${resultat?.name} finnes i Finanstilsynet og er registrert som regnskapsfører ✅`
  //   : `${resultat?.name} finnes i Finanstilsynet, men er ikke registrert som regnskapsfører. ✅`;
  // return (
  //   <Kort
  //     size={props.size}
  //     tittel="Finanstilsynet"
  //     erOkStatus={data !== null}
  //     orgnr={state.orgnr}
  //   >
  //     <p>{tekst}</p>
  //     {optionalRegnskapsforerData ? (
  //       <>
  //         <h5>
  //           Lisenstype: {optionalRegnskapsforerData?.licenceType.name.norwegian}
  //         </h5>
  //         <p>{optionalRegnskapsforerData.licenceType.description.norwegian}</p>
  //       </>
  //     ) : null}
  //   </Kort>
  // );
}

export default FinanstilsynStatuskort;
