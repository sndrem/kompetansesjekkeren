import React, { useState } from "react";
import { Menu } from "semantic-ui-react";

function Hovedmeny() {
  const [activeItem, setActiveItem] = useState("hjem");
  return (
    <Menu inverted>
      <Menu.Item
        href="#/"
        name="hjem"
        active={activeItem === "hjem"}
        onClick={() => {
          setActiveItem("hjem");
        }}
      >
        Hjem
      </Menu.Item>

      <Menu.Item
        href="#/sammenligning"
        name="sammenligning"
        active={activeItem === "sammenligning"}
        onClick={() => {
          setActiveItem("sammenligning");
        }}
      >
        Sammenligne to bedrifter
      </Menu.Item>
    </Menu>
  );
}

export default Hovedmeny;
