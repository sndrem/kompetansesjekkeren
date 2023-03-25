import React, {useContext} from "react";
import {Message, MessageSizeProp} from "semantic-ui-react";
import {useHentToggle} from "../../featureToggles/client";
import {SOK_ELVIRKSOMHETSREGISTERET} from "../../konstanter";
import {StateContext} from "../../pages/sokpage";
import {Appstate, ElvirksomhetsregisterResult} from "../../types/domain";
import {genererSokeurl} from "../../utils/utils";
import Feilmelding from "../feilmeldinger/feilmelding";
import Kort from "./kort";

interface Props {
  size: MessageSizeProp;
}

function ElvirksomhetsregisterStatuskort(props: Props) {
  return <p>Må fikse ElvirksomhetsregisterStatuskort</p>;
  // const state = useContext<Appstate>(StateContext);
  // const {orgnr} = state;
  // const {data} = useSWR<ElvirksomhetsregisterResult>(
  //   genererSokeurl(SOK_ELVIRKSOMHETSREGISTERET, orgnr)
  // );

  // const erFeil = useHentToggle("feil_for_elvirksomhetsregisteret", false);

  // if (erFeil) {
  //   return (
  //     <Feilmelding
  //       size={props.size}
  //       headerTekst="DSB - Elvirksomhetsregister"
  //       bodyTekst={
  //         <>
  //           <p>
  //             Det er for øyeblikket ikke mulig å sjekke bedrifter hos DSBs
  //             Elvirksomhetsregister
  //           </p>
  //         </>
  //       }
  //     ></Feilmelding>
  //   );
  // }

  // if (data?.hits.length === 0) {
  //   return (
  //     <Message size={props.size} color="red">
  //       <Message.Header>Elvirksomhetsregister</Message.Header>
  //       <p>Fant ingen data for {state.orgnr} hos Elvirksomhetsregisteret.</p>
  //     </Message>
  //   );
  // }
  // const bedrift = data?.hits?.[0];
  // const tekst = bedrift
  //   ? `${bedrift.name} finnes i Elvirksomhetsregisteret`
  //   : `Fant ingen data for ${state.orgnr} hos Elvirksomhetsregisteret`;
  // return (
  //   <Kort
  //     size={props.size}
  //     tittel="DSB - Elvirksomhetsregisteret"
  //     erOkStatus={bedrift !== null}
  //     orgnr={state.orgnr}
  //   >
  //     <p>{tekst}</p>
  //   </Kort>
  // );
}

export default ElvirksomhetsregisterStatuskort;
