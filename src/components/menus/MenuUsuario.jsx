import React,{Fragment, useState} from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import logo from "../../images/logo-is.png";

function MenuUsuario() {

    const navStyle = {
      position: "absolute",
      zIndex: 5,
      width: "100%",
    };

    return (
      <div className="containerNavUser" style={navStyle}>
        <nav
          className=" navbar navbar-scroll navbar-expand-lg bg-ligth"
          style={{ backgroundColor: "#7CA0AF" }}
        >
          <div className="container-fluid d-flex">
            <div className="navbar-header">
              <Link to="/">
                <img src={logo} width="80" height="80" className="ms-4" />
              </Link>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-secondary border border-2 me-1"
              >
                Registrarse
              </button>
              <button
                type="button"
                className="btn btn-outline-dark border border-2 "
              >
                Iniciar Sesion
              </button>
            </div>
          </div>
        </nav>
    </div>
    );
  }
  
  

  export default MenuUsuario;