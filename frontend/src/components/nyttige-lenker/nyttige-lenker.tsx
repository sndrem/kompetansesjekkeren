import React from 'react';
import { List } from 'semantic-ui-react';
import { Lenke } from '../../types/domain';
import { ReactGA } from "../../analytics/google-analytics";


interface Props {
    lenker: Array<Lenke>;
}

function NyttigeLenker(props: Props) {

    function loggKlikk(lenke: Lenke) {
        ReactGA.event({
            category: "Lenker",
            action: `Bruker trykket på lenke ${lenke.tekst} for url=${lenke.url}`
        });
    }

    return (
        <List bulleted>
            {props.lenker.map(lenke => {
                return (
                    <List.Item key={lenke.url}>
                        <a target={lenke.target ? lenke.target : "_blank"} onClick={() => loggKlikk(lenke)} href={lenke.url}>{lenke.tekst}</a>
                    </List.Item>
                )
            })}
        </List>
    )

}

export default NyttigeLenker;