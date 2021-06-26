import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import InicioPage from './pages/InicioPage';
import RegistrarPage from './pages/RegistrarPage';
import LoginPage from './pages/LoginPage';
import MisDatosUsuarioPage from './pages/MisDatosUsuarioPage';
import UsuarioGoldDatosPage from './pages/usuario/UsuarioGoldDatosPage';
import UsuarioPage from './pages/usuario/UsuarioPage';
import ChoferPage from './pages/chofer/ChoferPage';
import AdminPage from './pages/admin/AdminPage';
import AdminSitiosPage from './pages/admin/AdminSitiosPage';
import AdminChoferPage from './pages/admin/AdminChoferPage';
import AdminCombiPage from './pages/admin/AdminCombiPage';
import AdminProdPage from './pages/admin/AdminProdPage';
import AdminRutaPage from './pages/admin/AdminRutaPage';
import AdminViajePage from './pages/admin/AdminViajePage';
import UsuarioBuscarViajes from './pages/usuario/UsuarioBuscarViajes';
import UsuarioViajesComprados from './pages/usuario/UsuarioViajesComprados';
import ComprarSnacks from '../src/pages/usuario/ComprarSnacks'
import ChoferPageListarViaje from './pages/chofer/ChoferPageListarViaje';






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
          <Route path='/listaRutas' component={AdminRutaPage}></Route>
          <Route path='/listaViajes' component={AdminViajePage}></Route>
          <Route path='/filtrarViajes' component={UsuarioBuscarViajes}></Route>
          <Route path='/detalleViajes' component={UsuarioViajesComprados}></Route>
          <Route path='/comprarsnacks' component={ComprarSnacks}></Route>
          <Route path='/misDatosUsuario' component={MisDatosUsuarioPage}></Route>
          <Route path='/misDatosGold' component={UsuarioGoldDatosPage}></Route>
          <Route path='/choferListarViaje' component={ChoferPageListarViaje}></Route>

        </Switch>
      </Router>

  );
}

export default AppFinal;
