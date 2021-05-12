import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import InicioPage from './pages/InicioPage';
import RegistrarPage from './pages/RegistrarPage';
import LoginPage from './pages/LoginPage';
import UsuarioPage from './pages/usuario/UsuarioPage';
import ChoferPage from './pages/chofer/ChoferPage';
import AdminPage from './pages/admin/AdminChoferPage';
import AdminSitiosPage from './pages/admin/AdminSitiosPage';
import AdminChoferPage from './pages/admin/AdminChoferPage';
import AdminCombiPage from './pages/admin/AdminCombiPage';
import AdminProdPage from './pages/admin/AdminProdPage';





function AppFinal() {
  return (
    
      <Router>
        <Switch>
          <Route exact path='/' component={InicioPage}></Route>
          <Route path='/registrar' component={RegistrarPage}></Route>
          <Route path='/login' component={LoginPage}></Route>
          <Route path='/usuarioAdmin' component={AdminPage}></Route>
          <Route path='/usuarioChofer' component={ChoferPage}></Route>
          <Route path='/usuarioCliente' component={UsuarioPage}></Route>
          <Route path='/listaSitios' component={AdminSitiosPage}></Route>
          <Route path='/listaChoferes' component={AdminChoferPage}></Route>
          <Route path='/listaCombis' component={AdminCombiPage}></Route>
          <Route path='/listaProductos' component={AdminProdPage}></Route>
        </Switch>
      </Router>

  );
}

export default AppFinal;
