import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import { useHentToggle } from "../../featureToggles/client";

function Hovedmeny() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const visSammenligningToggle = useHentToggle("vis_sammenligningsside", true);
  console.log(visSammenligningToggle);

  return (
    <Menu inverted>
      <Menu.Item
        href="#/"
        name="hjem"
        active={activeItem === "/"}
        onClick={() => {
          setActiveItem("/");
        }}
      >
        Hjem
      </Menu.Item>

      {visSammenligningToggle && (
        <Menu.Item
          href="#/sammenligning"
          name="sammenligning"
          active={activeItem === "/sammenligning"}
          onClick={() => {
            setActiveItem("/sammenligning");
          }}
        >
          Sammenligne to bedrifter
        </Menu.Item>
      )}
    </Menu>
  );
}

export default Hovedmeny;
