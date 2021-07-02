import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import { Table, Modal, Button, Alert, Accordion, Card, Form, Spinner} from 'react-bootstrap'
import { TrashFill, PencilFill} from 'react-bootstrap-icons';
import { store, auth } from '../../firebaseconf'
import { useHistory, useLocation } from 'react-router-dom'



function UsuarioComprarPasaje() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "75%",
        overflowY: 'scroll'

    };


    //--------------------------------------------------HISTORIAL---------------------------BEGIN----------------------------------------
    //NO BORRAR --> NECESARIO PARA VOLVER ATRAS EN LAS PANTALLAS
    const historial = useHistory()
    //NO BORRAR --> NECESARIO PARA PASAR LOS ID ENTRE LAS VISTAS
    const location = useLocation(); 

    const volverAtras = () => {
        //TE LLEVA A COMPRAR -- NO BORRAR
        historial.push('/filtrarViajes')
    }
    //-------------------------------------------------HISTORIA------------------------------END----------------------------------------


    //-----------------------------------------------------MODALES--------------------------BEGIN---------------------------------------
    
    //----- MODAL REGISTRAR / MODIFICAR SNACK
    const [showModalEditSnack, setShowModalEditSnack] = useState(false)
    const handleCloseEdit = () => setShowModalEditSnack(false)
    const [esEditarSnack, setEsEditarSnack] = useState(false)


    //----- MODAL EXITO DE VENTA
    const [showModalExito, setShowModalExito] = useState(false)
    const handleCloseModalExito = () => setShowModalExito(false)



    // //MODAL ELIMINAR
    const [showModal, setShowModal] = useState(false);
    const [snackEliminar, setSnackEliminar] = useState('')
    const handleClose = () => setShowModal(false);
    

    // //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);
    const [msgError, setMsgError] = useState(null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)
    const [msgSucc, setMsgSucc] = useState(null)

    //ALERT DANGER
    const [showAlertDanger, setShowAlertDanger] = useState(false)
    const handleCloseAlertDanger = () => setShowAlertDanger(false)
    const [msgDanger, setMsgDanger] = useState(null)

    

    //-------------------------------------------------------MODALES--------------------------END---------------------------------------


    //-----------------------------------------------DATOS COMPONENTE--------------------------BEGIN------------------------------------
    //-----INFO DEL VIAJE 
    const [viajeCompra, setViajeCompra] = useState()
    const [viajes, setViajes] = useState([])

    //-----INFO DEL PASAJE
    const [origenViaje, setOrigenViaje] = useState()
    const [destinoViaje, setDestinoViaje] = useState()
    const [cantButacasViaje, setCantButacasViaje] = useState()
    const [horarioViaje, setHorarioViaje] = useState()
    const [precioPasajeViaje, setPrecioPasajeViaje] = useState()
    //------INFO DE LOS PASAJES QUE VA A COMPRAR
    const [cantPasajesComprarViaje, setCantPasajesComprarViaje] = useState('')
    


    //-----INFO DE SNACKS
    const [snacks, setSnacks] = useState([])                // TODOS LOS SNACKS DEL SISTEMA
    const [snacksPasaje, setSnacksPasaje] = useState([])    // LISTA DE SNACK DEL PASAJE
    const [idItemSnack, setIdItemSnack] = useState (0)      // ID DE CADA SNACK EN LA LISTA, YA  QUE NO USO FIREBASE
    const [cantItemListSnack, setCantItemListSnack] = useState (0)      //LLEVO LA CANTIDAD PARA ACTUALIZAR EL ID
    const [idSnack, setIdSnack] = useState ('')             // ID PROPIO DEL SNACK, SACADO DE FIREBASE
    const [cantSnack, setCantSnack] = useState ('')         //CANTIDAD SELECCIONADA A LA HORA DE CARGAR

    



    //-----INFO DE TARJETA DE CREDITO
    const [numTarjeta, setNumTarjeta] = useState ('')
    const [codTarjeta, setCodTarjeta] = useState ('')
    const [fechaTarjeta, setFechaTarjeta] = useState ('')
    const [showGoldInfo, setShowGoldInfo] = useState(false)

    const [totalPasajePagar, setTotalPasajePagar] = useState(0) // TOTAL DEL MONTO DE CANT PASAJES * PRECIO
    const [totalSnackPagar, setTotalSnackPagar] = useState(0) // TOTAL DE SNACKS POR CANTIDAD 
    

    //-----INFO DEL USUARIO
    const [usuarios, setUsuarios] = useState([])
    const [usuario, setUsuario] =  useState(null)
    const [idUser, setIdUser] = useState('')


    //-----------------------------------------------DATOS COMPONENTE--------------------------END------------------------------------------
    
    //----------------------------------------------------FUNCIONES--------------------------BEGIN------------------------------------------
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

    const getSnacks =  () => {
        store.collection('productos').get()
        .then(response => {
            const fetchedSnacks = [];
            response.docs.forEach(document => {
            const fetchedSnack = {
                id: document.id,
                ...document.data()
            };
            fetchedSnacks.push(fetchedSnack)
            });
            setSnacks(fetchedSnacks)
        })
    } 

    const getViajes = () => {
        store.collection('viaje').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
                setViajes(fetchedViajes)
                //ASIGNO LA INFORMACION DEL VIAJE CON EL QUE SE VA A COMPRAR EL PASAJE
                const infoViajeCompra = fetchedViajes.find((itemViaje) => {
                    return itemViaje.id === location.state.idViaje
                })
                setViajeCompra(infoViajeCompra)
            })
    }


    useEffect(() => {
        const datosCompraViaje = async () => {
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

            const v = await store.collection('viaje').get()
            const viajesArray = v.docs.map(item => ({ id: item.id, ...item.data() }))
            const infoViajeCompra = viajesArray.find((itemViaje) => {
                return itemViaje.id === location.state.idViaje
            })
            //DESCOMENTAR PARA VER LOS DATOS DEL VIAJE FILTRADO
            // console.log(infoViajeCompra)
            setViajeCompra(infoViajeCompra)
            //Inicializo la info del viaje
            setOrigenViaje(infoViajeCompra.origen)
            setDestinoViaje(infoViajeCompra.destino)
            setCantButacasViaje(infoViajeCompra.butacaDisponible)
            setHorarioViaje(infoViajeCompra.datosRuta.horario)
            setPrecioPasajeViaje(infoViajeCompra.precio)
            setCantItemListSnack(0)
            
            getViajes()
            getSnacks()
        }

        datosCompraViaje()
    }, []);
    

    // ----- CREAR Y EDITAR

    const crearModificarSnack = (oper, item) =>{
        if (oper === 'E') {
            setEsEditarSnack(true)
            setIdSnack(item.idSnack)
            setIdItemSnack(item.idItemSnack)
            setCantSnack(item.infoSnack.cantidad)
        } else {
            setEsEditarSnack(false)
            setIdSnack('')
            setIdItemSnack('')
            setCantSnack('')
        
        }
        setShowModalEditSnack(true)
    }

    
    const confirmarEdicion = async (e) => {
        e.preventDefault()

        if (!idSnack.trim()) {
            setMsgError('El campo snack está vacio' )
            setShowAlert(true)
            return
        }

        if (cantSnack === undefined || !cantSnack.trim()) {
            setMsgError('El campo Cantidad está vacio' )
            setShowAlert(true)
            return
        }

        const snackABM = snacks.find((itemSnack) => {
            return itemSnack.id === idSnack
        })

        const precioTotal = snackABM.precio * cantSnack
        
        let idSnackEstruct = (idItemSnack === '') ? cantItemListSnack : idItemSnack

        const snackComprado = {
            idItemSnack: idSnackEstruct,
            idSnack: idSnack,
            infoSnack: {nombre: snackABM.nombre, precio : snackABM.precio, cantidad : cantSnack},
            totalPrecio: precioTotal,
            idViaje: viajeCompra.id,
            idPasajero: usuario.id
        }

        
        if (snacksPasaje.length > 0) {
            //-----VERIFICO QUE NO AGREGUE EL MISMO SNACK MÁS DE UNA VEZ

            //PREGUNTO POR "UNDEFINED" PORQUE EL FIND SI NO ENCUENTRA NADA DEVUELVE ESO
            // SI EL SNACK NO ESTÁ AGREGADO === UNDEFINED
            const existeSnackEnLista = snacksPasaje.filter((itemSnackComp) => itemSnackComp.idSnack === idSnack)

            if((existeSnackEnLista.length >= 1) && (!esEditarSnack)){
                setMsgError('El snack que quiere agregar ya se encuentra en la lista, puede modificarlo desde la misma.' )
                setShowAlert(true)
                return
            }
        } 
        
        if (esEditarSnack){
            //AGARRO TODO EL ARREGLO MENOS EL ELEMENTO QUE VOY A MODIFICAR
            let snackSinModificar = snacksPasaje.filter((itemSnackComp) => 
                itemSnackComp.idItemSnack !== idItemSnack
            )

            snackSinModificar.push(snackComprado)
            setSnacksPasaje(snackSinModificar)

            // ACTUALIZO EL PRECIO DEL TOTAL DEL PASAJE
            let snackTotPrecio = 0;
            snackSinModificar.forEach(snack => {
                snackTotPrecio = snackTotPrecio + snack.totalPrecio
            });
            setTotalSnackPagar(snackTotPrecio)

        } else {
            let snackSinModificar = snacksPasaje
            //ME COPIO EL ARREGLO ORIGINAL, LE SUMO EL NUEVO SNACK Y AL ACTUALIZAR EL STATE SE REFRESCA EL COMPONENTE
            snackSinModificar.push(snackComprado)
            setSnacksPasaje(snackSinModificar)

            let actIdListSnack = cantItemListSnack
            actIdListSnack = actIdListSnack + 1
            setCantItemListSnack(actIdListSnack)

            // ACTUALIZO EL PRECIO DEL TOTAL DEL PASAJE
            let snackTotPrecio = 0;
            snackSinModificar.forEach(snack => {
                snackTotPrecio = snackTotPrecio + snack.totalPrecio
            });
            setTotalSnackPagar(snackTotPrecio)
        }

        setShowModalEditSnack(false)
        setMsgError(null)
        setShowAlert(false)

    }

    // ----- eliminacion
    const borrarSnack = async (id) => {
        setSnackEliminar(id)
        setShowModal(true);
    }

    const confirmarDeleteSnack = () =>{

        //AGARRO TODO EL ARREGLO MENOS EL ELEMENTO QUE VOY A MODIFICAR
        let snackSinModificar = snacksPasaje.filter((itemSnackComp) => 
            itemSnackComp.idItemSnack !== snackEliminar
        )

        setSnacksPasaje(snackSinModificar)

        let actIdListSnack = cantItemListSnack
        actIdListSnack = actIdListSnack + 1
        setCantItemListSnack(actIdListSnack)

        // ACTUALIZO EL PRECIO DEL TOTAL DEL PASAJE
        let snackTotPrecio = 0;
        snackSinModificar.forEach(snack => {
            snackTotPrecio = snackTotPrecio + snack.totalPrecio
        });
        setTotalSnackPagar(snackTotPrecio)
        
        setShowModal(false)
        setMsgError(null)
        setShowAlert(false)
    }
    
    //------------------------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------GRABA TODO LO DE PASAJE--------------------------BEGIN--------------------------
    
    const finalizarCompra = async (e) =>{
        console.log("empieza la magia")
        e.preventDefault();

        if (!cantPasajesComprarViaje.trim() || (cantPasajesComprarViaje.trim().length < 0)){
            setMsgDanger('Debe ingresar una cantidad de pasajes para poder realizar la compra')
            setShowAlertDanger(true)
            return
        }

        if(cantPasajesComprarViaje > viajeCompra.butacaDisponible){
            setMsgDanger('La cantidad de pasajes ingresada es mayor a la cantidad de pasajes disponibles para la compra.')
            setShowAlertDanger(true)
            return
        }

        if (!numTarjeta.trim() || (numTarjeta.trim().length < 16)){
            setMsgDanger('Debe ingresar los 16 números de su tarjeta para crear un usuario Gold')
            setShowAlertDanger(true)
            return
        }

        if (!codTarjeta.trim() || (codTarjeta.trim().length < 3)){
            setMsgDanger('Debe ingresar el código de seguridad de la tarjeta, deben ser al menos 3 caracteres')
            setShowAlertDanger(true)
            return
        }

        if (!fechaTarjeta.trim()){
            setMsgDanger('Debe ingresar la fecha de vencimiento de su tarjeta')
            setShowAlertDanger(true)
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
            setMsgDanger('La fecha de vencimiento de su tarjeta ya no es válida para poder realizar la operación')
            setShowAlertDanger(true)
            return

        }

        const tieneSnackComprado = snacksPasaje.length > 0 ? true : false

        //DESCOMENTAR PARA VER LOS DATOS DEL USUARIO
        // console.log(usuario)

        const ventaPasaje = {
            idViaje: viajeCompra.id,
            idRuta: viajeCompra.idRuta,
            idCombi: viajeCompra.idCombi,
            idChofer: viajeCompra.datosCombi.idChofer,
            totalPagado: totalPasajePagar + totalSnackPagar,
            cantidadButacas: cantPasajesComprarViaje,
            tieneSnackComprados: tieneSnackComprado,
            snackComprados: snacksPasaje,
            estadoPasaje: "Pendiente",
            idPasajero: usuario.id,
            infoPasajero: usuario
        }
        //DESCOMENTAR PARA VER LOS DATOS DEL PASAJE POR REGISTRAR
        console.log(ventaPasaje)
        try{
            // ME TRAIGO EL VIAJE ORIGINAL PARA RESTARLE LAS BUTACAS QUE VOY A VENDER
            let viajeParaActualizar = viajes.find((itemViaje) => {
                return itemViaje.id === ventaPasaje.idViaje
            })
            viajeParaActualizar.butacaDisponible = viajeParaActualizar.butacaDisponible - cantPasajesComprarViaje

            //RESTO LAS BUTACAS DISPONIBLES DEL VIAJE ORIGINAL
            await store.collection('viaje').doc(ventaPasaje.idViaje).set(viajeParaActualizar)

            await store.collection('pasajeViajeVendido').add(ventaPasaje)
                    
            setShowModalExito(true)

        }catch(e){
            setMsgError('Uups! Hubo un problema al actualizar los datos en el sistema')
            setShowAlert(true)
            console.log(e)
        }  




    }
    //----------------------------------------------------GRABA TODO LO DE PASAJE--------------------------END----------------------------
    
    //------------------------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------FUNCIONES--------------------------END------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------
    // PARTE VISUAL DEL COMPONENTE
    return (
        <div>
            <MenuUsuario />
            <MenuOpcUsuario optionName="filtrarViajes" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 380, width: "60%" }}> Compra de Pasajes</h3>
                <Button style={{ top: 105, position: 'absolute', left: 80, width: "80px", height: "35px", fontSize: 14, justifyContent: 'center' }} onClick={(e) => { volverAtras() }} variant="secondary " > Volver</Button>
                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>
                <Alert id="danger" className="" variant="danger" show={showAlertDanger} onClick={handleCloseAlertDanger} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgDanger}
                </Alert>
                <div style={subPageStyle}>
                    <Accordion defaultActiveKey= "0">
                        <Card className="card-accordion">
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                Datos de pasajes
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0" >
                                <Card.Body style={{ backgroundColor: "#FFFFFF"}}>
                                    <form style={{ left: "40px", width:"100%"}}>
                                        <div className="form-group row">
                                            <div className="form-group col-md-4">
                                                <label id="origenInfo"><b>Origen:</b> {origenViaje}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="horarioInfo"><b>Horario:</b> {horarioViaje}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="butacasInfo"><b>Pasajes Disponibles:</b> {cantButacasViaje}</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="form-group col-md-4">
                                                <label id="destinoInfo"><b>Destino:</b> {destinoViaje}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="precioInfo"><b>Precio unitario:</b> ${precioPasajeViaje}</label>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className="form-group row">
                                            <label id="cantidadPasajeCompra" className="col-sm-3 col-form-label"><b>Cantidad de pasajes a comprar:</b></label>
                                            <div className="col-sm-2">
                                                <input
                                                    value={cantPasajesComprarViaje}
                                                    onChange = {(e)=> {setCantPasajesComprarViaje(e.target.value)}}
                                                    onClick = {handleCloseAlert}
                                                    className = "form-control"
                                                    maxLength = '2'
                                                    onBlur = { (e) => {setTotalPasajePagar(e.target.value * viajeCompra.precio)}}
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                        }
                                                    }}
                                                    type = "text"
                                                />        
                                            </div>
                                        </div>
                                    </form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                                Compra de Snacks
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body style={{ backgroundColor: "#FFFFFF"}}>
                                    <div style={{ right: "80px", position: 'absolute'}}>
                                        <Button  onClick={(e) => { crearModificarSnack('A', '') }} variant="secondary " > + Agregar Snacks</Button> 
                                    </div>
                                    <br/>
                                    <br/>
                                    <div >
                                        <Table striped bordered  variant="secondary">
                                            <thead>
                                                <tr>
                                                <th>Snack</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Acciones</th>        
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {
                                                    snacksPasaje.length !== 0 ?
                                                        (
                                                            snacksPasaje.map(item => (
                                                                <tr key={item.idItemSnack}>
                                                                    <td>{item.infoSnack.nombre}</td>
                                                                    <td>{item.infoSnack.cantidad}</td>
                                                                    <td>{item.infoSnack.precio}</td>
                                                                    <td style={{width: "12%"}} >
                                                                        <div className="d-flex justify-content-around">
                                                                            <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarSnack('E', item) }}>
                                                                                <PencilFill color="white"></PencilFill>
                                                                            </button>
                                                                            <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => {borrarSnack(item.idItemSnack) }}>
                                                                                <TrashFill color="white"></TrashFill>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <></>
                                                        )
                                                }
                                            </tbody>
                                        </Table>
                                        {
                                            snacksPasaje.length === 0 ? <div className="alert alert-warning mt-19"> No se agregó ningún snack para este pasaje </div> : <div></div>
                                        }
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                                Pago con Tarjeta de Crédito
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                            <Card.Body style={{ backgroundColor: "#FFFFFF"}}>
                                <form style={{ left: "40px", width:"100%"}}>
                                    <div className="form-group row">
                                        <label className="col-sm-10 col-form-label"><b>Total a pagar:</b> $ {showGoldInfo ? (totalSnackPagar + totalPasajePagar) * 0.9 : totalSnackPagar + totalPasajePagar} </label>
                                        {
                                            showGoldInfo ? 
                                            <label disabled={showGoldInfo} className="col-sm-10 col-form-label"><b>Por ser GOLD tiene un 10% de descuento en el viaje y sus productos</b></label>
                                            :
                                            <></>
                                        }
                                    </div>
                                    <hr></hr>
                                    <br/>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Número de Tarjeta:* </label>
                                        <div className="col-sm-7">
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
                                                style = {{width:"40%"}}
                                            />
                                        </div>
                                        <div className="col-sm-3">
                                            <Button style={{ width: "200px", height: "35px", fontSize: 14}} onClick={finalizarCompra} variant="success " > Finalizar compra de pasajes</Button>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Código:* </label>
                                        <div className="col-sm-10">
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
                                                type = "text"
                                                style = {{width:"20%"}}/>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Fecha de Vencimiento:* </label>
                                        <div className="col-sm-10">
                                            <input  value={fechaTarjeta}
                                                    type="month" 
                                                    id="start" 
                                                    name="start"
                                                    min="2018-03" 
                                                    style = {{width:"40%"}}
                                                    onChange = {(e)=> {setFechaTarjeta(e.target.value)}}
                                                    onClick = {handleCloseAlert}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
            {
                showModalEditSnack ?
                (
                    <Modal id="modalEditar" show={showModalEditSnack} onHide={handleCloseEdit}>
                        <Modal.Header >
                            <Modal.Title>{esEditarSnack ? "Editar Snack Seleccionado" : "Agregar Snack a Pasaje" }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form inline>
                                <Form.Label htmlFor="inlineFormCustomSelect">
                                    Snack:
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    style = {{width:"80%", marginLeft:"15px"}}
                                    id="nombreSnack"
                                    onChange={(e) => { setIdSnack(e.target.value)}}
                                    onClick = {handleCloseAlert}
                                    value = {idSnack}
                                    {...(esEditarSnack ? {disabled:true} : {})}
                                    custom
                                >
                                    {<option key= "0" value="">Seleccione un snack para su viaje..</option>}
                                    {snacks.map((e, key) => {
                                        return <option key={e.id} value={e.id}>{e.nombre}</option>;
                                    })}
                                </Form.Control>
                                <br/>
                                <Form.Label htmlFor="inlineFormCustomSelect">
                                    Precio:
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    style = {{width:"80%", marginLeft:"10px"}}
                                    id="precioSnack"
                                    onClick = {handleCloseAlert}
                                    value = {idSnack}
                                    disabled
                                    custom
                                >
                                    {<option key= "0" value="">..</option>}
                                    {snacks.map((e, key) => {
                                        return <option key={e.id} value={e.id}>{e.precio}</option>;
                                    })}
                                </Form.Control>
                                <br/>
                                <Form.Label htmlFor="inlineFormCustomSelect">
                                    Cantidad:
                                </Form.Label>
                                <input onChange={(e) => {setCantSnack(e.target.value)}}
                                    onClick = {handleCloseAlert}
                                    type="text"
                                    maxLength = '2'
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    id="totCantSnack"
                                    value={cantSnack}
                                    style = {{width:"50%"}} 
                                />
                                
                            </Form>
                    
                            <Alert className="mt-4" variant="danger" show={showAlert}>
                                {msgError}
                            </Alert>
                        </Modal.Body>
                        
                        <Modal.Footer>
                            <Button variant="primary" onClick={confirmarEdicion}>
                                        Confirmar
                            </Button>
                            <Button variant="secondary" onClick={() => { setShowModalEditSnack(false); setMsgError(null); setShowAlert(false); }}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                ) : (
                    <></>
                )
            }
            <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>Eliminación de Snack</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Está seguro que desea eliminar el snack seleccionado?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={confirmarDeleteSnack}>
                        Confirmar
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
          </Modal>
          <Modal id="modalExitoVenta" show={showModalExito} onHide={handleCloseModalExito}>
                <Modal.Header >
                    <Modal.Title>Pasaje comprado con Éxito</Modal.Title>
                </Modal.Header>
                <Modal.Body>Su pasaje a sido reservado con éxito! Muchas gracias por viajar con nosotros!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={(e) => { volverAtras()}}>
                        Volver al menú
                    </Button>
                </Modal.Footer>
          </Modal> 
        </div>
    );
}

export default UsuarioComprarPasaje;