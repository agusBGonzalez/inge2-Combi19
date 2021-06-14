import React,{useEffect, useState} from 'react'
import { Link, useHistory} from 'react-router-dom'
import logo from '../../images/logo-is.png'
import {DropdownButton,Dropdown} from 'react-bootstrap'
import {auth} from '../../firebaseconf'

function MenuUsuarioAdmin() {

    const historial = useHistory()
    const[usuario,setUsuario] = useState(null)
    const[idUsuarioLogueado,setIdUsuarioLogueado] = useState('')

    useEffect( () =>{
        auth.onAuthStateChanged( (user) => {
           if(user){
              setUsuario(user.email)
              setIdUsuarioLogueado(user.uid)
           } 
        })
        return () => {setUsuario(null)}
    },[])

    const CerrarSesion = () => {
        auth.signOut()
        setUsuario(null)
        setIdUsuarioLogueado('')
        historial.push('/')
    }


    const navStyle = {
      position: "absolute",
      top: 0,
      width: "100%",
      borderBottom: "3px solid gray"
    };

    return (
      <div className="containerNavUser" style={navStyle}>
        <nav
          className=" navbar navbar-scroll navbar-expand-lg bg-ligth"
          style={{ backgroundColor: "#7CA0AF" }}
        >
          <div className="container-fluid d-flex">
            <div className="navbar-header">
              <img src={logo} alt="logo-is" width="80" height="80" className="ms-4" />
            </div>
            <div>
              <DropdownButton id="dropdown-user" variant="secondary" title="Mi Sesión">
                <Dropdown.Item as={Link} disabled to="/usuario">Mis Datos</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={CerrarSesion}>Cerrar Sesión</Dropdown.Item>
              </DropdownButton>
            </div> 
          </div> 
        </nav>
      </div>
    );
  }
  
  

  export default MenuUsuarioAdmin;