import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import InicioPage from './pages/InicioPage';
import RegistrarPage from './pages/RegistrarPage';
import LoginPage from './pages/LoginPage';


import AdministrarPagina from './components/AdministrarPagina';
import AgregarProducto from './components/producto/AgregaProducto';
import ListarProducto from './components/producto/ListarProducto';


function AppFinal() {
  return (
    
      <Router>
        <Switch>
          <Route exact path='/' component={InicioPage}></Route>
          <Route path='/registrar' component={RegistrarPage}></Route>
          <Route path='/login' component={LoginPage}></Route>
          <Route path='/agregarProducto' component={AgregarProducto}></Route>
          <Route path='/listarProductos' component={ListarProducto}></Route>
          <Route path='/Administrar' component={AdministrarPagina}></Route>
        </Switch>
      </Router>

  );
}

export default AppFinal;
