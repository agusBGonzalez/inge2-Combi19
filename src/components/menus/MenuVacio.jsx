import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo-is.png";

function MenuVacio() {

  const navStyle = {
    position: "absolute",
    top: 0,
    width: "100%",
    borderBottom: "3px solid gray"
  };

  return (
    <div className="containerNav" style={navStyle}>
        <nav
          className=" navbar navbar-scroll navbar-expand-lg bg-ligth"
          style={{ backgroundColor: "#7CA0AF" }}
        >
          <div className="container-fluid d-flex">
            <div className="navbar-header">
              <Link to="/">
                <img src={logo} alt="logo" width="80" height="80" className="ms-4" />
              </Link>
            </div>
            <div></div>
          </div>
        </nav>
    </div>
  );
}

export default MenuVacio;
