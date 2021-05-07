import React from 'react'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Inicio from './components/Inicio'
import Listados from './components/Listados'
import Menu from './components/Menu'
import RegistrarCombi from './components/RegistrarCombi';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <div className="container">
      <Router>
        <Menu/>
        <Switch>
          <Route exact path='/' component={Inicio}></Route>
          <Route path='/registroc' component={RegistrarCombi}></Route>
          <Route path='/listar'component={Listados}></Route>
        </Switch>
      </Router>
      
     
    </div>
  );
}

export default App;
