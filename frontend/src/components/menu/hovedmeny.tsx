import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {Menu} from "semantic-ui-react";

function Hovedmeny() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

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
    </Menu>
  );
}

export default Hovedmeny;
