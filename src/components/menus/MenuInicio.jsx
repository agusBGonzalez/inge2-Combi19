import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo-is.png";

function MenuInicio() {
  const navStyle = {
    position: "absolute",
    zIndex: 5,
    width: "100%",
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
            <div>
							<Link className="btn btn-secondary border border-2 me-1" to={"/registrar"}>Registrarse</Link>
							<Link className="btn btn-outline-dark border border-2" to={"/login"}>Iniciar Sesion</Link>
            </div>
          </div>
        </nav>
    </div>
  );
}

export default MenuInicio;
