import React from 'react';
import { List } from 'semantic-ui-react';
import { Lenke } from '../../types/domain';


interface Props {
    lenker: Array<Lenke>;
}

function NyttigeLenker(props: Props) {

    return (
        <List bulleted>
            {props.lenker.map(lenke => {
                return (
                    <List.Item key={lenke.url}>
                        <a target={lenke.target ? lenke.target : "_blank"} href={lenke.url}>{lenke.tekst}</a>
                    </List.Item>
                )
            })}
        </List>
    )

}

export default NyttigeLenker;