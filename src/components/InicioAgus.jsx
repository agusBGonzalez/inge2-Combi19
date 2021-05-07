import React from 'react';
import { Link } from 'react-router-dom';
const Inicio = () => {
    return (
        <div class="container mb-20">
            <img src="https://i.ibb.co/6svqZ5F/logo-is.png" className="img-responsive center-block mt-20 mm-23" alt="titulo" /> 
            <div className=" mt-3 ">
                <Link className="btn btn-primary" to="/RegistrarUsuario">Registrar Usuario</Link> { "  "}
                <Link className="btn btn-success" to="/IniciarSesion">Iniciar Sesion</Link>
            </div>
        </div>
    )
}

export default Inicio