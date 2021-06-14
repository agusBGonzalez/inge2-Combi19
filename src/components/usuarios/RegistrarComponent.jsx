import React, {useState} from 'react'
import { Link, useHistory} from 'react-router-dom'
import {auth, store} from '../../firebaseconf'
import {Modal, Button, Alert} from 'react-bootstrap'


function RegistrarComponent() {

	const historial = useHistory()
	const [email, setEmail] = useState ('')
	const [nombres, setNombres] = useState ('')
	const [apellido, setApellido] = useState ('')
	const [fecha, setFecha] = useState ('')
	const [password, setPassword] = useState ('')
    const [numTarjeta, setNumTarjeta] = useState ('')
  	const [codigoTarjeta, setCodigoTarjeta] = useState('')
  	const [fechaTarjeta, setFechaTarjeta] = useState ('')

  

	const [msgError, setMsgError] = useState (null)

	//MODAL
	const [showModal, setShowModal] = useState(false);
	const handleClose = () => setShowModal(false);

	//ALERT
	const [showAlert, setShowAlert] = useState(false);
	const handleCloseAlert = () => {setShowAlert(false); setMsgError(null);}

  //MOSTRAR PARTE DE USUARIO GOLD
  const [showGoldInfo, setShowGoldInfo] = useState(false);


	const RegistrarUsuario = (e) => {
	  e.preventDefault();

	  //NO TOCAR QUE FUNCIONA
	  // Dia de hoy en string
	  const diaHoy = new Date().toLocaleString()
	  const fechaHoy = diaHoy.substr(0, diaHoy.indexOf(','))

	  const cortoMes = fechaHoy.substr(0, fechaHoy.indexOf('/'))
	  const fechaSinDia = fechaHoy.substring(fechaHoy.indexOf('/') +1 ,fechaHoy.length)

	  const cortoDia = fechaSinDia.substr(0, fechaSinDia.indexOf('/'))
	  const cortoAnio = fechaSinDia.substring(fechaSinDia.indexOf('/') +1 ,fechaSinDia.length)

	  const diaHoyNumb = Number(cortoDia)
	  const mesHoyNumb = Number(cortoMes)
	  const anioHoyNumb = Number(cortoAnio)

	  // LO DEJO POR EL PROBLEMA QUE TUVO AGUS EN LA DEMO
	  // const diaHoyNumb = 11
	  // const mesHoyNumb = 5
	  // const anioHoyNumb = 2021

	  //CORTO AÑO DEL DIA INGRESADO
	  const anioFecNac = fecha.substr(0, fecha.indexOf('-'))
	  const fecNacSinAnio = fecha.substring(fecha.indexOf('-') +1 ,fecha.length)

	  const cortoMesFecNac = fecNacSinAnio.substr(0, fecNacSinAnio.indexOf('-'))
	  const cortoDiaFecNac = fecNacSinAnio.substring(fecNacSinAnio.indexOf('-') +1 ,fecNacSinAnio.length)

	  const diaFecNacNumb = Number(cortoDiaFecNac)
	  const mesFecNacNumb = Number(cortoMesFecNac)
	  const anioFecNacNumb = Number(anioFecNac) + 18

	  console.log(anioHoyNumb,mesHoyNumb,diaHoyNumb)
	  console.log(anioFecNacNumb,mesFecNacNumb,diaFecNacNumb)

	  const esMayorEdad = (anioFecNacNumb < anioHoyNumb) ? true : (anioFecNacNumb <= anioHoyNumb) && (mesFecNacNumb < mesHoyNumb) ? true : (anioFecNacNumb <= anioHoyNumb) && (mesFecNacNumb <= mesHoyNumb) && (diaFecNacNumb <= diaHoyNumb) ? true : false


	  if (esMayorEdad) {

		  if (!fecha.trim()){
			  setMsgError('Debe ingresar una fecha de nacimiento para crear un usuario')
			  setShowAlert(true)
			  return
		  }

		  if (!email.trim()){
			  setMsgError('Debe ingresar un email para crear un usuario')
			  setShowAlert(true)
			  return
		  }

		  if (!password.trim() || (password.trim().length < 8)){
			  setMsgError('Debe ingresar una contraseña con al menos 8 caractares para crear un usuario')
			  setShowAlert(true)
			  return	
		  }

		  if (showGoldInfo) {

			  if (!numTarjeta.trim() || (numTarjeta.trim().length < 16)){
				  setMsgError('Debe ingresar los 16 números de su tarjeta para crear un usuario Gold')
				  setShowAlert(true)
				  return
			  }
  
			  if (!codigoTarjeta.trim() || (codigoTarjeta.trim().length < 3)){
				  setMsgError('Debe ingresar el código de seguridad de la tarjeta, deben ser al menos 3 caracteres')
				  setShowAlert(true)
				  return
			  }

			  if (!fechaTarjeta.trim()){
				  setMsgError('Debe ingresar la fecha de vencimiento de su tarjeta')
				  setShowAlert(true)
				  return
			  }

			  //VALIDACION DE FECHA DE LA TARJETA
			  const cortoAnioFecTarjeta = fechaTarjeta.substr(0, fechaTarjeta.indexOf('-'))
			  const cortoMesFecTarjeta = fechaTarjeta.substring(fechaTarjeta.indexOf('-') +1 ,fechaTarjeta.length)                

			  const numMesTarj = Number(cortoMesFecTarjeta)
			  const numAnioTarj = Number(cortoAnioFecTarjeta)

			  if((anioHoyNumb > numAnioTarj) || ((mesHoyNumb > numMesTarj) && (anioHoyNumb === numAnioTarj)) ) {
				  setMsgError('La fecha de vencimiento de su tarjeta ya no es válida para poder realizar la operación')
				  setShowAlert(true)
				  return

			  }

		  }


		  auth.createUserWithEmailAndPassword(email,password)
				  .then( async (userCredential) => {
					  
					  const nuevoUser = {
						  nombres: nombres,
						  apellido: apellido,
						  fechaNac: fecha,
						  email: email,
						  tipo: "usuario",
						  esGold: showGoldInfo,
						  tarjetaNum: numTarjeta,
						  tarjetaCod: codigoTarjeta,
						  tarjetaVen: fechaTarjeta,
						  idUser: userCredential.user.uid,
						  password:password
					  }

					  
					  try{
						 
						  const data = await store.collection('usuariosConfig').add(nuevoUser)
						  historial.push('/login')

					  }catch(e){
						  setMsgError('Uups! Hubo un problema al registrar el usuario en el sistema')
						  setShowModal(true)
						  console.log(e)
					  }
					  
				  })
				  .catch (err => {
					  console.log(err)
					  if(err.code === 'auth/invalid-email'){
						  setMsgError('Formato de Email incorrecto')
						  setShowModal(true)
					  }
			  
					  if(err.code === 'auth/weak-password'){
						  setMsgError('La password debe tener 6 caracteres o más')
						  setShowModal(true)
					  }
					  if(err.code === 'auth/email-already-in-use'){
						  setMsgError('El email que ingresó ya se encuentra registrado')
						  setShowModal(true)
					  }
					  
					  console.log(err)
				  })
		  
	  } else {
		  setMsgError('Debes ser mayor de 18 años para crear un usuario')
		  setShowModal(true)
	  }
	}

  const divStyle = {
	  position: "relative",
	  top: 70,
	  width: "100%"
  };  


	//RENDER DEL COMPONENTE		  
	return (
	  <div className = "row mt-5" style={divStyle}>
		  
		  <div className = "col" style={{ width:"58%", marginLeft:"30px",marginRight:"30px"}}>
				  <form className = "form-group" onSubmit = {RegistrarUsuario}>
					  <label>Nombres: </label>
					  <input
						  onChange = {(e)=> {setNombres(e.target.value)}}
						  onClick = {handleCloseAlert}
						  className = "form-control"
						  placeholder = "Ingrese su nombre"
						  type = "text"
					  />
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
					  
				  </form>
			  </div>
			  
				 { showGoldInfo ?
				  <div className = "col" style={{ width:"30%", marginRight:"30px"}}> 
					  <form className = "form-group" >
						  <label>Número de Tarjeta:* </label>
						  <input
							  onChange = {(e)=> {setNumTarjeta(e.target.value)}}
							  onClick = {handleCloseAlert}
							  className = "form-control"
							  maxLength = '16'
                                  onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }}
							  placeholder = "Ingrese su número de tarjeta"
							  type = "text"
						  />
						  <label className="mt-4">Código:* </label>
						  <input
							  onChange = {(e)=> {setCodigoTarjeta(e.target.value)}}
							  onClick = {handleCloseAlert}
							  className = "form-control"
							  placeholder = "Ingrese código"
							  maxLength = '4'
                                  onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }}
							  type = "text"/>
						  <label className="mt-4">Fecha de Vencimiento:* </label>
						  <input type="month" 
								  id="start" 
								  name="start"
								  min="2018-03" 
								  style = {{width:"100%"}}
								  onChange = {(e)=> {setFechaTarjeta(e.target.value)}}
								  onClick = {handleCloseAlert}
						  />	
								  
						  <Button variant="warning" 
							  style={{marginTop:"23px"}}
							  onClick={() => {setShowGoldInfo(false); setShowAlert(false) }}> Quizas más tarde
						  </Button>
						  
					  </form>
				  </div>
				  : null }
			  
			  { !showGoldInfo ?
				  <div className = "col">
					  <Button variant="warning" 
							  style={{marginTop:"23px"}}
							  onClick={() => {setShowGoldInfo(true) }}> Quiero ser Gold!
					  </Button>
				  </div>
			  : null} 
			  <Modal show={showModal} onHide={handleClose}>
				  <Modal.Header >
					  <Modal.Title>Hay un problema</Modal.Title>
				  </Modal.Header>
				  <Modal.Body>{msgError}</Modal.Body>
				  <Modal.Footer>
					  <Button variant="secondary" onClick={() => {setShowModal(false); setFecha('');}}>
						  Close
					  </Button>
				  </Modal.Footer>
			  </Modal>
	  
	  </div>
  
  
	);
}

export default RegistrarComponent;
