import React from 'react';
import { List, Header, Icon } from 'semantic-ui-react';
import { Lenke } from "../../types/domain";

interface Props {
  lenker: Array<Lenke>;
}

function NyttigeLenker(props: Props) {
  return (
    <>
      <Header as="h4">
        <Icon name="linkify" />
        <Header.Content>Nyttige lenker</Header.Content>
      </Header>
      <List horizontal>
        {props.lenker.map((lenke) => {
          return (
            <List.Item key={lenke.url}>
              <a
                target={lenke.target ? lenke.target : "_blank"}
                rel="noopener noreferrer"
                href={lenke.url}
              >
                {lenke.tekst}
              </a>
            </List.Item>
          );
        })}
      </List>
    </>
  );
}

export default NyttigeLenker;