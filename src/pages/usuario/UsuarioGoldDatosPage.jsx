import React,{useState, useEffect} from 'react'
import { store,auth } from '../../firebaseconf'
import {Modal, Button, Alert} from 'react-bootstrap'
// import { Link, useHistory} from 'react-router-dom'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'


function UsuarioGoldDatosPage() {

    const [numTarjeta, setNumTarjeta] = useState ('')
    const [codTarjeta, setCodTarjeta] = useState ('')
    const [fechaTarjeta, setFechaTarjeta] = useState ('')
    const [showGoldInfo, setShowGoldInfo] = useState(false);

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
  

	//ALERT
	const [showAlert, setShowAlert] = useState(false);
	const handleCloseAlert = () => {setShowAlert(false); setMsgError(null);}
    const [msgError, setMsgError] = useState (null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)
    const [msgSucc, setMsgSucc] = useState (null)
 

   //MODAL PARA CANCELAR SUSCRIPCION
    const [esCancelarSuscripcion, setEsCancelarSuscripcion] = useState(false)
    const handleCloseCancelar = () => setEsCancelarSuscripcion(false)

    //MODAL PARA CARGAR SUSCRIPCION
    const [esCargarSuscripcion, setEsCargarSuscripcion] = useState(false)
    const handleCloseCargar = () => setEsCargarSuscripcion(false)




    useEffect( () =>{
        getUsuarioConfig()

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
                            setNumTarjeta(usuarioEncontrado.tarjetaNum)
                            setCodTarjeta(usuarioEncontrado.tarjetaCod)
                            setFechaTarjeta(usuarioEncontrado.tarjetaVen)
                            setShowGoldInfo(usuarioEncontrado.esGold)
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

        if (!numTarjeta.trim() || (numTarjeta.trim().length < 16)){
            setMsgError('Debe ingresar los 16 números de su tarjeta para crear un usuario Gold')
            setShowAlert(true)
            return
        }

        if (!codTarjeta.trim() || (codTarjeta.trim().length < 3)){
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

        // LO DEJO POR EL PROBLEMA QUE TUVO AGUS EN LA DEMO
        
        const mesHoyNumb = 6
        const anioHoyNumb = 2021

        if((anioHoyNumb > numAnioTarj) || ((mesHoyNumb > numMesTarj) && (anioHoyNumb === numAnioTarj)) ) {
            setMsgError('La fecha de vencimiento de su tarjeta ya no es válida para poder realizar la operación')
            setShowAlert(true)
            return

        }

        const editUser = {
            nombres: usuario.nombres,
            apellido: usuario.apellido,
            fechaNac: usuario.fechaNac,
            email: usuario.email,
            tipo: "usuario",
            esGold: true,
            tarjetaNum: numTarjeta,
            tarjetaCod: codTarjeta,
            tarjetaVen: fechaTarjeta,
            idUser: usuario.idUser,
            password:usuario.password
        }
        
        // BUSCO EL ID DE LA PERSONA EN usuariosConfig
        const idUsuarioActualizar = usuarios.find((itemUser) => {
            return itemUser.idUser === usuario.idUser
        })

        console.log(idUsuarioActualizar.id)

        try{
            
            await store.collection('usuariosConfig').doc(idUsuarioActualizar.id).set(editUser)
            getUsuarioConfig()
            setMsgSucc('Actualizacion Exitosa! Click aqui para cerrar')
            setShowAlertSucc(true)
            setShowGoldInfo(true)
            setEsCargarSuscripcion(false)

        }catch(e){
            setMsgError('Uups! Hubo un problema al actualizar los datos en el sistema')
            setShowAlert(true)
            console.log(e)
        }    

    }

    const adherirSuscripcion = async (e) => {
        setEsCargarSuscripcion(true)
    }

    const cancelarSuscripcion = async (e) => {
        handleCloseCancelar()
        e.preventDefault();

        if (!numTarjeta.trim() || (numTarjeta.trim().length < 16)){
            setMsgError('Debe ingresar los 16 números de su tarjeta para crear un usuario Gold')
            setShowAlert(true)
            return
        }

        if (!codTarjeta.trim() || (codTarjeta.trim().length < 3)){
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

        // LO DEJO POR EL PROBLEMA QUE TUVO AGUS EN LA DEMO
        
        const mesHoyNumb = 6
        const anioHoyNumb = 2021

        if((anioHoyNumb > numAnioTarj) || ((mesHoyNumb > numMesTarj) && (anioHoyNumb === numAnioTarj)) ) {
            setMsgError('La fecha de vencimiento de su tarjeta ya no es válida para poder realizar la operación')
            setShowAlert(true)
            return

        }

        const editUser = {
            nombres: usuario.nombres,
            apellido: usuario.apellido,
            fechaNac: usuario.fechaNac,
            email: usuario.email,
            tipo: "usuario",
            esGold: false,
            tarjetaNum: '',
            tarjetaCod: '',
            tarjetaVen: '',
            idUser: usuario.idUser,
            password:usuario.password
        }
        
        // BUSCO EL ID DE LA PERSONA EN usuariosConfig
        const idUsuarioActualizar = usuarios.find((itemUser) => {
            return itemUser.idUser === usuario.idUser
        })

        console.log(idUsuarioActualizar.id)

        try{
            
            await store.collection('usuariosConfig').doc(idUsuarioActualizar.id).set(editUser)
            getUsuarioConfig()
            setMsgSucc('Actualizacion Exitosa! Click aqui para cerrar')
            setShowAlertSucc(true)
            setShowGoldInfo(false)
            setEsCargarSuscripcion(false)
            setNumTarjeta('')
            setCodTarjeta('')
            setFechaTarjeta('')

        }catch(e){
            setMsgError('Uups! Hubo un problema al actualizar los datos en el sistema')
            setShowAlert(true)
            console.log(e)
        }
    }


    return (
        <div>
            <MenuUsuario/>
            <MenuOpcUsuario optionName="misDatosGold" />
            <div>
                <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Datos Gold</h3>
                <button className="btn btn-dark btn-block" type = "submit">Actualizar</button>
                { showGoldInfo ?
                <div>
                    <Button style={{top: 105, position: 'absolute', right:270, width: "180px", height: "40px"}} variant="warning" onClick={confirmarEdicion} > Actualizar Datos Gold </Button>
                    <Button style={{top: 105, position: 'absolute', right:70, width: "170px", height: "40px"}} variant="dark" onClick={(e) =>{setEsCancelarSuscripcion(true)}} > Cancelar suscripción </Button>
                </div>
                :
                <></>
                }
                { !showGoldInfo && !esCargarSuscripcion ?
                    <Button variant="warning" style={{top: 105, position: 'absolute', right:170, width: "200px", height: "40px"}} onClick={adherirSuscripcion} > Adherirme a suscripción</Button>
                    :
                    <></>

                }
                { esCargarSuscripcion ?
                    <div>
                        <Button style={{top: 105, position: 'absolute', right:270, width: "180px", height: "40px"}} variant="warning" onClick={confirmarEdicion} > Registrar Datos Gold </Button>
                        <Button style={{top: 105, position: 'absolute', right:70, width: "170px", height: "40px"}} variant="dark" onClick={(e) =>{setEsCargarSuscripcion(false);setNumTarjeta('');setCodTarjeta('');setFechaTarjeta('')}} > Cancelar adhesion </Button>
                    </div>
                    :
                    <></>
                }
                <div style={subPageStyle}>
                    { (showGoldInfo || esCargarSuscripcion) ?
                        <div className = "col" > 
                            <form className = "form-group" >
                                <label>Número de Tarjeta:* </label>
                                <input
                                    value={numTarjeta}
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
                                    value={codTarjeta}
                                    onChange = {(e)=> {setCodTarjeta(e.target.value)}}
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
                                <input  value={fechaTarjeta}
                                        type="month" 
                                        id="start" 
                                        name="start"
                                        min="2018-03" 
                                        style = {{width:"100%"}}
                                        onChange = {(e)=> {setFechaTarjeta(e.target.value)}}
                                        onClick = {handleCloseAlert}
                                />	
                            </form>
                        </div>
                        : 
                        <div>
                            <br/>
                            <br/>
                            <label>Muchas gracias por interesarse en nuestra opcion de "Usuario GOLD", 
                                   tiene un 10% de descuento en la compra de pasajes pagando una suscripcion mensual,
                                   sólo necesita cargar los datos de una tarjeta de crédito de la cual se debitará
                                   nuestro abono. 
                            </label>
                        </div> }
                     
                    <Alert className="mt-4" variant="danger" show={showAlert} onClick = {handleCloseAlert}>
                        {msgError}
                    </Alert>
                    <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
                        {msgSucc}
                    </Alert>	
                </div>
                
            </div>

            {
            esCancelarSuscripcion ?
            (
                <Modal id="modalEditar" show={esCancelarSuscripcion} onHide={handleCloseCancelar}>
                    <Modal.Header >
                        <Modal.Title>¿Está seguro de querer cancelar su suscripción?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="primary" onClick={cancelarSuscripcion}>
                            Confirmar
                        </Button>
                        <Button variant="secondary" onClick={() => {setEsCancelarSuscripcion(false);}}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <></>
            )
                            
        }

        </div>
    );
  }
  
  export default UsuarioGoldDatosPage;