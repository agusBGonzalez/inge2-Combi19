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

     //ALERT SUCESS
     const [showAlertSucc, setShowAlertSucc] = useState(false)
     const handleCloseAlertSucc = () => setShowAlertSucc(false)
     const [msgSucc, setMsgSucc] = useState (null)
  

	//ALERT
	const [showAlert, setShowAlert] = useState(false);
	const handleCloseAlert = () => {setShowAlert(false); setMsgError(null);}
    const [msgError, setMsgError] = useState (null)


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

    const getUsuarioConfig =  () => {
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
        })
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault();

        //NO TOCAR QUE FUNCIONA
        // Dia de hoy en string
        const diaHoy = new Date().toLocaleString()
        const fechaHoy = diaHoy.substr(0, diaHoy.indexOf(','))

        const cortoMes = fechaHoy.substr(0, fechaHoy.indexOf('/'))
        const fechaSinDia = fechaHoy.substring(fechaHoy.indexOf('/') +1 ,fechaHoy.length)

        const cortoDia = fechaSinDia.substr(0, fechaSinDia.indexOf('/'))
        const cortoAnio = fechaSinDia.substring(fechaSinDia.indexOf('/') +1 ,fechaSinDia.length)

        //   const diaHoyNumb = Number(cortoDia)
        //   const mesHoyNumb = Number(cortoMes)
        //   const anioHoyNumb = Number(cortoAnio)

        // LO DEJO POR EL PROBLEMA QUE TUVO AGUS EN LA DEMO
        const diaHoyNumb = 15
        const mesHoyNumb = 6
        const anioHoyNumb = 2021

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
                setMsgError('Debe ingresar una fecha de nacimiento para  ')
                setShowAlert(true)
                return
            }
  
            if (!email.trim()){
                setMsgError('Debe ingresar un email para actualizar')
                setShowAlert(true)
                return
            }
  
            if (!password.trim() || (password.trim().length < 6)){
                setMsgError('Debe ingresar una contraseña con al menos 6 caractares para actualizar')
                setShowAlert(true)
                return	
            }

            const editUser = {
                nombres: nombres,
                apellido: apellido,
                fechaNac: fecha,
                email: email,
                tipo: "usuario",
                esGold: usuario.esGold,
                tarjetaNum: usuario.tarjetaNum,
                tarjetaCod: usuario.tarjetaCod,
                tarjetaVen: usuario.tarjetaVen,
                idUser: usuario.idUser,
                password:password
            }

            try{
                await store.collection('usuariosConfig').doc(usuario.idUser).set(editUser)
                getUsuarioConfig()
                setMsgSucc('Actualizacion Exitosa! Click aqui para cerrar')
                setShowAlertSucc(true)

            }catch(e){
                setMsgError('Uups! Hubo un problema al actualizar los datos en el sistema')
                setShowAlert(true)
                console.log(e)
            }

        } else {
            setMsgError('Debes ser mayor de 18 años para operar como un usuario en el sistema, verifique los datos')
            setShowAlert(true)
        }

    }


    return (
        <div>
            <MenuUsuario/>
            <MenuOpcUsuario optionName="" />
            <div>
                <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Mis Datos</h3>
                <Button style={{top: 105, position: 'absolute', right:170, width: "150px", height: "40px"}} className="btn btn-dark btn-block" onClick={confirmarEdicion} > Actualizar Datos </Button>
                
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
                    <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
                        {msgSucc}
                    </Alert>	
                </div>
            </div>
        </div>
    );
  }
  
  export default MisDatosUsuarioPage;