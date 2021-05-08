import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo-is.png";

function MenuVacio() {

  return (
    <div className="containerNav" >
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
          </div>
        </nav>
    </div>
  );
}

export default MenuVacio;
