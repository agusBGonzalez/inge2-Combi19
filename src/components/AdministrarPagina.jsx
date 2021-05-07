import React from 'react';
import { Link } from 'react-router-dom';
const AdministrarPagina = () => {
    return (
        <div class="container mb-20">
            <div className="row mt-3">
                <div className="col">
                    <h3> ACCIONES CON LAS CHOFERES</h3>
                </div>
                <div className="col">
                    <Link className="btn btn-primary " to="/AgregarSitio">Agregar Chofer</Link> <br />
                    <Link className="btn btn-success " to="/ListarSitios">Listar choferes</Link></div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <h3 className="mt-3"> ACCIONES CON LAS COMBIS </h3>
                </div>
                <div className="col">
                    <Link className="btn btn-primary " to="/AgregarSitio">Agregar Sitio</Link> <br />
                    <Link className="btn btn-success " to="/ListarSitios">Listar Sitios</Link></div>
            </div>

            <div className="row mt-3">
                <div className="col">
            <h3 className="mt-3"> ACCIONES CON LOS SITIOS</h3>
                </div>
                <div className="col">
                    <Link className="btn btn-primary " to="/AgregarSitio">Agregar Sitio</Link> <br />
                    <Link className="btn btn-success " to="/ListarSitios">Listar Sitios</Link></div>
            </div>

            <div className="row mt-3">
                <div className="col">
            <h3 className="mt-3"> ACCIONES CON LAS RUTAS</h3>
                </div>
                <div className="col">
                    <Link className="btn btn-primary " to="/AgregarSitio">Agregar Ruta</Link> <br />
                    <Link className="btn btn-success " to="/ListarSitios">Listar Rutas</Link></div>
            </div>

            <div className="row mt-3">
                <div className="col">
            <h3 className="mt-3"> ACCIONES CON LOS VIAJES</h3>
                </div>
                <div className="col">
                    <Link className="btn btn-primary " to="/AgregarSitio">Agregar Viaje</Link> <br />
                    <Link className="btn btn-success" to="/ListarSitios">Listar Viajes</Link></div>
            </div>

            <div className="row mt-3">
                <div className="col">
            <h3 className="mt-3"> ACCIONES CON LOS PRODUCTOS</h3>
                </div>
                <div className="col">
                    <Link className="btn btn-primary " to="/AgregarProducto">Agregar Producto</Link> <br />
                    <Link className="btn btn-success" to="/ListarProductos">Listar Productos</Link></div>
            </div>



        </div>
    )
}

export default AdministrarPagina