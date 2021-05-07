import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Inicio from './components/InicioAgus';
import Menu from './components/MenuAgus';
import RegistarUsuario from './components/RegistarUsuario';
import IniciarSesion from './components/IniciarSesion';
import AgregaSitio from './components/sitio/AgregaSitio';
import ListarSitios from './components/sitio/ListarSitios';
import AdministrarPagina from './components/AdministrarPagina';
import AgregarProducto from './components/producto/AgregaProducto';
import ListarProducto from './components/producto/ListarProducto';



function AppAgus() {
  return (
    <Router>
      <Menu></Menu>
      <br></br>
      <Switch>
        <Route exact path='/' component={Inicio}></Route>
        <Route path='/agregarSitio' component={AgregaSitio}></Route>
        <Route path='/listarSitios' component={ListarSitios}></Route>
        <Route path='/agregarProducto' component={AgregarProducto}></Route>
        <Route path='/listarProductos' component={ListarProducto}></Route>
        <Route path='/Administrar' component={AdministrarPagina}></Route>



      </Switch>

    </Router>
  );
}

export default AppAgus;
