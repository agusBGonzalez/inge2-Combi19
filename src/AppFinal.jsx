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
import UsuarioComprarPasaje from './pages/usuario/UsuarioComprarPasaje';
import ListaPasajeros from './pages/chofer/ListaPasajeros';
import ChoferPageListarViaje from './pages/chofer/ChoferPageListarViaje';
import ChoferPageVerDetalleCombi from './pages/chofer/ChoferPageVerDetalleCombi';
import RegistrarDatosCovid from './pages/chofer/RegistrarDatosCovid'
import AdminViajeFinalizado from './pages/admin/AdminViajeFinalizado';
import ChoferVenderPasaje from './pages/chofer/ChoferVenderPasaje';
import UsuarioNotificacionesPage from './pages/usuario/UsuarioNotificacionesPage'


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

          {/* admin */}
          <Route path='/listaSitios' component={AdminSitiosPage}></Route>
          <Route path='/listaChoferes' component={AdminChoferPage}></Route>
          <Route path='/listaCombis' component={AdminCombiPage}></Route>
          <Route path='/listaProductos' component={AdminProdPage}></Route>
          <Route path='/listaRutas' component={AdminRutaPage}></Route>
          <Route path='/listaViajes' component={AdminViajePage}></Route>
          <Route path='/listaViajesFinalizados' component={AdminViajeFinalizado}></Route>


          {/* usuarios */}
          <Route path='/filtrarViajes' component={UsuarioBuscarViajes}></Route>
          <Route path='/detalleViajes' component={UsuarioViajesComprados}></Route>
          <Route path='/comprarsnacks' component={ComprarSnacks}></Route>
          <Route path='/misDatosUsuario' component={MisDatosUsuarioPage}></Route>
          <Route path='/misDatosGold' component={UsuarioGoldDatosPage}></Route>
          <Route path='/misNotificaciones' component={UsuarioNotificacionesPage}></Route>
          <Route path='/comprarPasaje' component={UsuarioComprarPasaje}></Route>

          {/* Choferes */}
          <Route path='/listaPasajeros' component={ListaPasajeros}></Route>
          <Route path='/choferListarViaje' component={ChoferPageListarViaje}></Route>
          <Route path='/choferMiCombi' component={ChoferPageVerDetalleCombi}></Route>
          <Route path='/registrarDatosCovid' component={RegistrarDatosCovid}></Route>
          <Route path='/venderPasaje' component={ChoferVenderPasaje}></Route>
            
        </Switch>
      </Router>

  );
}

export default AppFinal;
