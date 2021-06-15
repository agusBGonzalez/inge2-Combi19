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
    const [idUser, setIdUser] = useState('')

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "56%",
        height: "76%",
        // overflowY: 'scroll'

    };
  

	const [msgError, setMsgError] = useState (null)

	//MODAL
	const [showModal, setShowModal] = useState(false);
	const handleClose = () => setShowModal(false);

	//ALERT
	const [showAlert, setShowAlert] = useState(false);
	const handleCloseAlert = () => {setShowAlert(false); setMsgError(null);}


    useEffect( () =>{
        //getUsuarioConfig()

        auth.onAuthStateChanged( (user) => {
           if(user){
                setIdUser(user.uid)
                store.collection('usuariosConfig').get()
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
                        const usuarioEncontrado = fetchedUsers.find((itemUser) => {
                            return itemUser.idUser === user.uid
                        })
                        setUsuario(usuarioEncontrado)
                        if (usuarioEncontrado !== undefined){
                            setEmail(usuarioEncontrado.email)
                            setNombres(usuarioEncontrado.nombres)
                            setApellido(usuarioEncontrado.apellido)
                            setFecha(usuarioEncontrado.fechaNac)
                            setPassword('password')
                        }
                        
                    })
                    .catch(error => {
                        setMsgError(error)
                        setShowAlert(true)
                    });   
           } 
        })
        
    },[])


    return (
        <div>
            <MenuUsuario/>
            <MenuOpcUsuario optionName="" />
            <div>
                <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Mis Datos</h3>
                <button className="btn btn-dark btn-block" type = "submit">Actualizar</button>
                <Button style={{top: 105, position: 'absolute', right:170, width: "150px", height: "40px"}} className="btn btn-dark btn-block" onClick={(e) => { console.log('A') }} > Actualizar Datos </Button>
                
                <div style={subPageStyle}>
                    <label>Nombres: </label>
                    <input
                        value={nombres}
                        onChange = {(e)=> {setNombres(e.target.value)}}
                        onClick = {handleCloseAlert}
                        className = "form-control"
                        placeholder = "Ingrese su nombre"
                        type = "text"/>		  
                    <label className="mt-4">Apellido: </label>
                    <input
                        value={apellido}
                        onChange = {(e)=> {setApellido(e.target.value)}}
                        onClick = {handleCloseAlert}
                        className = "form-control"
                        placeholder = "Ingrese su apellido"
                        type = "text"/>	  	  	  
                    <label className="mt-4">Fecha de Nacimiento:* </label>	
                    <input
                        value={fecha}
                        onChange = {(e)=> {setFecha(e.target.value)}}
                        onClick = {handleCloseAlert}
                        className = "form-control"
                        type = "date"
                        />
                    <label className="mt-4">Email:* </label>	    
                    <input
                        value={email}
                        onChange = {(e)=> {setEmail(e.target.value)}}
                        onClick = {handleCloseAlert}
                        className = "form-control"
                        placeholder = "Ingrese un email"
                        type = "email"/>
                    <label className="mt-4">Contraseña:* </label>	
                    <input
                        value={password}
                        onChange = {(e)=> {setPassword(e.target.value)}}
                        onClick = {handleCloseAlert}
                        className = "form-control"
                        placeholder = "Ingrese una contrañesa"
                        type = "password"/>	  
                    <Alert className="mt-4" variant="danger" show={showAlert} onClick = {handleCloseAlert}>
                        {msgError}
                    </Alert>	
                </div>
            </div>
        </div>
    );
  }
  
  export default MisDatosUsuarioPage;