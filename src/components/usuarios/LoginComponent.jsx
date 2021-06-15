import React, {useState} from "react"
import { Link, useHistory } from "react-router-dom"
import {auth,store} from '../../firebaseconf'
import {Modal, Button, Alert} from 'react-bootstrap'

function LoginComponent() {

    const historial = useHistory()
    const [email, setEmail] = useState ('')
    const [password, setPassword] = useState ('')

    const [msgError, setMsgError] = useState (null)

    //MODAL
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);

    //ALERT
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);
  
    const LoginUsuario = (e) =>{
        e.preventDefault();

        if (!email.trim()){
            setMsgError('Debe ingresar un email para acceder al sistema')
            setShowAlert(true)
            return
        }

        if (!password.trim() || (password.trim().length < 6)){
            setMsgError('Debe ingresar una contraseña con al menos 6 caractares para acceder al sistema')
            setShowAlert(true)
            return	
        }

        auth.signInWithEmailAndPassword(email,password)
            .then( r => {
                //SE LIMPIA EL ESTADO DE CONST PARA EVITAR ERRORES AL DESMONTAR EL COMPONENTE
                
                //con async r =>
                // const {docs} = await store.collection('usuariosConfig').get()
                // const arrayUsuario = docs.map(item => ({id: item.id, ...item.data()}))
                store.collection('usuariosConfig').where("email", "==", email)
                            .get()
                            .then((querySnapshot) => {
                                let userRuta = ''
                                querySnapshot.forEach((doc) => {
                                    // doc.data() is never undefined for query doc snapshots
                                    const tipoUsuario = doc.data().tipo
                                    if (tipoUsuario === 'chofer') {
                                        console.log("entraChofer")
                                        userRuta ='/usuarioChofer'
                                    } else if (tipoUsuario === 'admin'){
                                        console.log("entrasAdmin")
                                        userRuta ='/usuarioAdmin'
                                    } else {
                                        userRuta ='/usuarioCliente'
                                    }
                                });
                                console.log(userRuta)
                                setEmail('')
                                setPassword('')
                                setMsgError(null)
                                //historial.push(userRuta)
                                historial.push({
                                    pathname: userRuta,
                                    customNameData: r.user.uid,
                                  });
                            })
                
            })
            .catch((err)=> {
                console.log(err)
                if(err.code === 'auth/wrong-password'){
                    setMsgError('La password no es correcta, vuelva a intentarlo')
                    setShowModal(true)
                }
                if(err.code === 'auth/user-not-found'){
                    setMsgError('La email no se encuentra registrado en el sitio, por favor registrese')
                    setShowModal(true)
                }
                if(err.code === 'auth/too-many-requests'){
                    setMsgError('Estamos teniendo problemas con el servidor, intente nuevamente')
                    setShowModal(true)
                }
                
            })
        
  }
  
  const divStyle = {
    position: "relative",
    top: 70,
    width: "100%"
    
  };

  return (
      
    <div className = "row mt-5" style={divStyle}>
        <div className = "col"></div>
        <div className = "col">
            <h5 className="text-center">Ingrese sus datos para iniciar sesión</h5>
            <form className = "form-group" onSubmit = {LoginUsuario}>
                <input
                    onChange = {(e)=> {setEmail(e.target.value)}}
                    onClick = {handleCloseAlert}
                    className = "form-control mt-4"
                    placeholder = "Email"
                    type = "email"
                />     
            
                <input
                    onChange = {(e)=> {setPassword(e.target.value)}}
                    onClick = {handleCloseAlert}
                    className = "form-control mt-4"
                    placeholder = "Contraseña"
                    type = "password"
                />
                <Alert className="mt-4" variant="danger" show={showAlert}>
					{msgError}
				</Alert>    
                <div className="d-grid gap-2 col-6 mx-auto mt-4">
					<button className="btn btn-dark btn-block" type = "submit">Acceder</button>
					<Link className="btn btn-danger btn-block " to="/">Cancelar</Link>
				</div>

            </form>
        </div>
        <div className = "col"></div>
        <Modal show={showModal} onHide={handleClose}>
			<Modal.Header >
				<Modal.Title>Hay un problema</Modal.Title>
			</Modal.Header>
			<Modal.Body>{msgError}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
      	</Modal>
    </div>
  );
}

export default LoginComponent;
