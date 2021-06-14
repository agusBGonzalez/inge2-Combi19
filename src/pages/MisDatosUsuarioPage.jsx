import React,{useState, useEffect} from 'react'
import { store,auth } from '../firebaseconf'
import {Modal, Button, Alert} from 'react-bootstrap'
import { Link, useHistory} from 'react-router-dom'
import MenuUsuario from '../components/menus/MenuUsuario'
import MenuOpcUsuario from '../components/menus/MenuOpcUsuario'


function MisDatosUsuarioPage() {

    

    const historial = useHistory()
	const [email, setEmail] = useState ('')
	const [nombres, setNombres] = useState ('')
	const [apellido, setApellido] = useState ('')
	const [fecha, setFecha] = useState ('')
	const [password, setPassword] = useState ('')

    const [usuarios, setUsuarios] = useState([])
    const [usuario, setUsuario] =  useState(null)

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'

    };
  

	const [msgError, setMsgError] = useState (null)

	//MODAL
	const [showModal, setShowModal] = useState(false);
	const handleClose = () => setShowModal(false);

	//ALERT
	const [showAlert, setShowAlert] = useState(false);
	const handleCloseAlert = () => {setShowAlert(false); setMsgError(null);}


    useEffect( () =>{
        store.collection('usuarioConfig').get()
            .then(response => {
                const fetchedUsers = [];
                response.docs.forEach(document => {
                    const fetchedUser = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedUsers.push(fetchedUser)
                });
                setUsuarios(fetchedUsers)
            })
            .catch(error => {
                setMsgError(error)
                setShowAlert(true)
            });

        auth.onAuthStateChanged( (user) => {
           if(user){
               console.log(usuarios)
                const usuarioEncontrado = usuarios.find((itemUser) => {
                    return itemUser.idUser === user.uid
                })   
                setUsuario(usuarioEncontrado)
                setEmail(usuarioEncontrado.email)
                setNombres(usuarioEncontrado.nombres)
                setApellido(usuarioEncontrado.apellido)
                setFecha(usuarioEncontrado.fechaNac)
                setPassword('password')
           } 
        })
        return () => {console.log(usuario)}
    },[])


    return (
        <div>
            <MenuUsuario/>
            <MenuOpcUsuario optionName="" />
            <div>
            <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Mis Datos</h3>
            
            <div style={subPageStyle}>
                <label>Nombres: </label>
				<input
                    onChange = {(e)=> {setNombres(e.target.value)}}
                    onClick = {handleCloseAlert}
                    className = "form-control"
                    placeholder = "Ingrese su nombre"
                    type = "text"/>		  
				<label className="mt-4">Apellido: </label>
				<input
					onChange = {(e)=> {setApellido(e.target.value)}}
                    onClick = {handleCloseAlert}
                    className = "form-control"
                    placeholder = "Ingrese su apellido"
                    type = "text"/>	  	  	  
				<label className="mt-4">Fecha de Nacimiento:* </label>	
					  <input
						  onChange = {(e)=> {setFecha(e.target.value)}}
						  onClick = {handleCloseAlert}
						  className = "form-control"
						  type = "date"
						  />
					  <label className="mt-4">Email:* </label>  
					  <input
						  onChange = {(e)=> {setEmail(e.target.value)}}
						  onClick = {handleCloseAlert}
						  className = "form-control"
						  placeholder = "Ingrese un email"
						  type = "email"/>
					  <label className="mt-4">Contraseña:* </label>	
					  <input
						  onChange = {(e)=> {setPassword(e.target.value)}}
						  onClick = {handleCloseAlert}
						  className = "form-control"
						  placeholder = "Ingrese una contrañesa"
						  type = "password"/>	  
					  <Alert className="mt-4" variant="danger" show={showAlert} onClick = {handleCloseAlert}>
						  {msgError}
					  </Alert>	
					  <div className="d-grid gap-2 col-6 mx-auto mt-4">
						  <button className="btn btn-dark btn-block" type = "submit">Registrar Usuario</button>
						  <Link className="btn btn-danger btn-block " to="/">Cancelar</Link>
					  </div>
                </div>
            </div>
        </div>
    );
  }
  
  export default MisDatosUsuarioPage;