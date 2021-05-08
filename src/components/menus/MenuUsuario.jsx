import React,{Fragment, useState} from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import logo from "../../images/logo-is.png";
import {DropdownButton,Dropdown} from 'react-bootstrap'

function MenuUsuario() {

    const navStyle = {
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
            <div className="collapse navbar-collapse d-flex justify-content-end">
              <DropdownButton id="dropdown-user" variant="secondary" title="Mi Sesión">
                <Dropdown.Item disabled>
                  <Link className="dropdown-item" to={"/usuario"}>Mis Datos</Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <Link className="dropdown-item" to={"/"}>Cerrar Sesión</Link>
                </Dropdown.Item>
              </DropdownButton>
            </div> 
          </div> 
        </nav>
      </div>
    );
  }
  
  

  export default MenuUsuario;