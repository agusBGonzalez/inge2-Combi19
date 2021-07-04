import React, { useState, useEffect } from 'react'
import MenuUsuarioChofer from '../../components/menus/MenuUsuarioChofer'
import MenuOpcChofer from '../../components/menus/MenuOpcChofer'
import { Table, Modal, Button, Alert, Accordion, Card, Form, Spinner } from 'react-bootstrap'
import { store, auth } from '../../firebaseconf'
import { useHistory, useLocation } from 'react-router-dom'



function ChoferVenderPasaje() {

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

    const datosViaje = location.state.idViaje

    const volverAtras = () => {
        //TE LLEVA A COMPRAR -- NO BORRAR
        historial.push('/listaPasajeros', { idViaje: datosViaje })
    }
    //-------------------------------------------------HISTORIA------------------------------END----------------------------------------


    //-----------------------------------------------------MODALES--------------------------BEGIN---------------------------------------

    //----- MODAL REGISTRAR / MODIFICAR SNACK
    // const [showModalEditSnack, setShowModalEditSnack] = useState(false)
    // const handleCloseEdit = () => setShowModalEditSnack(false)
    // const [esEditarSnack, setEsEditarSnack] = useState(false)


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



    //-----INFO DE PASAJERO
    const [email, setEmail] = useState('')
    const [mailCreado, setMailCreado] = useState(false)
    const [esUsuarioExistente, setEsUsuarioExistente] = useState(false)
    const [esUsuarioNuevoCreado, setEsUsuarioNuevoCreado] = useState(false)
    const [validando, setValidando] = useState(false)



    const [totalPasajePagar, setTotalPasajePagar] = useState(0) // TOTAL DEL MONTO DE CANT PASAJES * PRECIO


    //-----INFO DEL USUARIO
    const [usuarios, setUsuarios] = useState([])
    const [usuario, setUsuario] = useState(null)
    // const [idUser, setIdUser] = useState('')


    //-----------------------------------------------DATOS COMPONENTE--------------------------END------------------------------------------

    //----------------------------------------------------FUNCIONES--------------------------BEGIN------------------------------------------

    // const getViajes = () => {
    //     store.collection('viaje').get()
    //         .then(response => {
    //             const fetchedViajes = [];
    //             response.docs.forEach(document => {
    //                 const fetchedViaje = {
    //                     id: document.id,
    //                     ...document.data()
    //                 };
    //                 fetchedViajes.push(fetchedViaje)
    //             });
    //             setViajes(fetchedViajes)
    //             //ASIGNO LA INFORMACION DEL VIAJE CON EL QUE SE VA A COMPRAR EL PASAJE
    //             const infoViajeCompra = fetchedViajes.find((itemViaje) => {
    //                 return itemViaje.id === location.state.idViaje
    //             })
    //             setViajeCompra(infoViajeCompra)
    //         })
    // }


    useEffect(() => {
        console.log(datosViaje)
        const datosCompraViaje = async () => {
            // getUsuarioConfig()

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

                    // const usuarioEncontrado = fetchedUsers.find((itemUser) => {
                    //     return itemUser.idUser === user.uid
                    // })
                    // setUsuario(usuarioEncontrado)

                    // if (usuarioEncontrado !== undefined) {

                    //     setNumTarjeta(usuarioEncontrado.tarjetaNum)
                    //     setCodTarjeta(usuarioEncontrado.tarjetaCod)
                    //     setFechaTarjeta(usuarioEncontrado.tarjetaVen)
                    //     setShowGoldInfo(usuarioEncontrado.esGold)
                    // }

                })
                .catch(error => {
                    setMsgError(error)
                    setShowAlert(true)
                });


            const v = await store.collection('viaje').get()
            const viajesArray = v.docs.map(item => ({ id: item.id, ...item.data() }))
            // console.log(viajesArray)
            const infoViajeCompra = viajesArray.find((itemViaje) => {
                return itemViaje.id === datosViaje.infoViaje.id
            })

            console.log(infoViajeCompra)
            //DESCOMENTAR PARA VER LOS DATOS DEL VIAJE FILTRADO
            // console.log(infoViajeCompra)
            setViajeCompra(infoViajeCompra)
            //Inicializo la info del viaje
            setOrigenViaje(infoViajeCompra.origen)
            setDestinoViaje(infoViajeCompra.destino)
            setCantButacasViaje(infoViajeCompra.butacaDisponible)
            setHorarioViaje(infoViajeCompra.datosRuta.horario)
            setPrecioPasajeViaje(infoViajeCompra.precio)
        }

        datosCompraViaje()
    }, []);


    const emailValidation = () => {
        if (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email,)) {
            validarCorreo()
        } else {
            setMsgDanger('EL formato del email ingresado no es válido  para verificar.')
            setShowAlertDanger(true)
        }
    };


    const validarCorreo = () => {
        setValidando(true)

        // console.log(usuarios)
        const usuarioEncontrado = usuarios.find((itemUser) => {
            return itemUser.email === email
        })


        console.log(usuarioEncontrado)

        if (usuarioEncontrado === undefined) {
            console.log("entra ")
            setEsUsuarioNuevoCreado(true)
            setEsUsuarioExistente(false)


        } else {
            console.log("entra 222")
            setEsUsuarioNuevoCreado(false)
            setEsUsuarioExistente(true)
        }
        setUsuario(usuarioEncontrado)
        setMailCreado(true)
        setValidando(false)



        console.log(usuarioEncontrado)

    }




    //------------------------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------GRABA TODO LO DE PASAJE--------------------------BEGIN--------------------------

    const finalizarCompra = async (e) => {
        console.log("empieza la magia")
        e.preventDefault();

        if (!cantPasajesComprarViaje.trim() || (cantPasajesComprarViaje.trim().length < 0)) {
            setMsgDanger('Debe ingresar una cantidad de pasajes para poder realizar la compra')
            setShowAlertDanger(true)
            return
        }

        if (parseInt(cantPasajesComprarViaje) > parseInt(viajeCompra.butacaDisponible)) {
            setMsgDanger('La cantidad de pasajes ingresada es mayor a la cantidad de pasajes disponibles para la compra.')
            setShowAlertDanger(true)
            return
        }

        // if (!numTarjeta.trim() || (numTarjeta.trim().length < 16)){
        //     setMsgDanger('Debe ingresar los 16 números de su tarjeta para crear un usuario Gold')
        //     setShowAlertDanger(true)
        //     return
        // }

        // if (!codTarjeta.trim() || (codTarjeta.trim().length < 3)){
        //     setMsgDanger('Debe ingresar el código de seguridad de la tarjeta, deben ser al menos 3 caracteres')
        //     setShowAlertDanger(true)
        //     return
        // }

        // if (!fechaTarjeta.trim()){
        //     setMsgDanger('Debe ingresar la fecha de vencimiento de su tarjeta')
        //     setShowAlertDanger(true)
        //     return
        // }

        // //VALIDACION DE FECHA DE LA TARJETA
        // const cortoAnioFecTarjeta = fechaTarjeta.substr(0, fechaTarjeta.indexOf('-'))
        // const cortoMesFecTarjeta = fechaTarjeta.substring(fechaTarjeta.indexOf('-') +1 ,fechaTarjeta.length)                

        // const numMesTarj = Number(cortoMesFecTarjeta)
        // const numAnioTarj = Number(cortoAnioFecTarjeta)

        // // LO DEJO POR EL PROBLEMA QUE TUVO AGUS EN LA DEMO

        // const mesHoyNumb = 7
        // const anioHoyNumb = 2021

        // if((anioHoyNumb > numAnioTarj) || ((mesHoyNumb > numMesTarj) && (anioHoyNumb === numAnioTarj)) ) {
        //     setMsgDanger('La fecha de vencimiento de su tarjeta ya no es válida para poder realizar la operación')
        //     setShowAlertDanger(true)
        //     return

        // }

        // const tieneSnackComprado = snacksPasaje.length > 0 ? true : false

        //DESCOMENTAR PARA VER LOS DATOS DEL USUARIO
        // console.log(usuario)

        const ventaPasaje = {
            idViaje: viajeCompra.id,
            idRuta: viajeCompra.idRuta,
            idCombi: viajeCompra.idCombi,
            idChofer: viajeCompra.datosCombi.idChofer,
            totalPagado: totalPasajePagar,
            cantidadButacas: cantPasajesComprarViaje,
            tieneSnackComprados: false,
            snackComprados: [],
            estadoPasaje: "Pendiente",
            idPasajero: usuario.id,
            infoPasajero: usuario,
            formatoPago: "efectivo"
        }
        //DESCOMENTAR PARA VER LOS DATOS DEL PASAJE POR REGISTRAR
        // console.log(ventaPasaje)
        try {
            // ME TRAIGO EL VIAJE ORIGINAL PARA RESTARLE LAS BUTACAS QUE VOY A VENDER
            let viajeParaActualizar = viajes.find((itemViaje) => {
                return itemViaje.id === ventaPasaje.idViaje
            })
            viajeParaActualizar.butacaDisponible = viajeParaActualizar.butacaDisponible - cantPasajesComprarViaje

            //RESTO LAS BUTACAS DISPONIBLES DEL VIAJE ORIGINAL
            await store.collection('viaje').doc(ventaPasaje.idViaje).set(viajeParaActualizar)

            await store.collection('pasajeViajeVendido').add(ventaPasaje)

            setShowModalExito(true)

        } catch (e) {
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
            <MenuUsuarioChofer />
            <MenuOpcChofer optionName="choferListarViaje" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 380, width: "60%" }}> Venta de Pasajes</h3>
                <Button style={{ top: 105, position: 'absolute', left: 80, width: "80px", height: "35px", fontSize: 14, justifyContent: 'center' }} onClick={(e) => { volverAtras() }} variant="secondary " > Volver</Button>
                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>
                <Alert id="danger" className="" variant="danger" show={showAlertDanger} onClick={handleCloseAlertDanger} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgDanger}
                </Alert>
                <div style={subPageStyle}>
                    <Accordion defaultActiveKey="0">
                        <Card className="card-accordion">
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0" >
                                <Card.Body style={{ backgroundColor: "#FFFFFF" }}>
                                    <form style={{ left: "40px", width: "100%" }}>
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
                                            <label id="mailCliente" className="col-sm-3 col-form-label"><b>Ingrese correo de cliente: </b></label>
                                            <div className="col-sm-3">
                                                <input
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); }}
                                                    onClick={(e) => { setShowAlertDanger(false); setValidando(false); setEsUsuarioExistente(false); setEsUsuarioNuevoCreado(false) }}
                                                    className="form-control"
                                                    onBlur={emailValidation}
                                                    required
                                                    disabled={mailCreado}
                                                    type="email"
                                                />
                                            </div>
                                            {
                                                validando ?
                                                    <Spinner animation="border" role="status" />
                                                    :
                                                    <></>
                                            }
                                            {
                                                esUsuarioExistente ?
                                                    <label className="col-sm-3 col-form-label" style={{ color: 'green' }}><b> Usuario existente en el sistema</b></label>
                                                    :
                                                    <></>
                                            }
                                            {
                                                esUsuarioNuevoCreado ?
                                                    <label className="col-sm-3 col-form-label" style={{ color: 'green' }}><b> Nuevo usuario creado en el sistema</b> </label>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            <label id="cantidadPasajeCompra" className="col-sm-3 col-form-label"><b>Cantidad de pasajes a comprar:</b></label>
                                            <div className="col-sm-2">
                                                <input
                                                    value={cantPasajesComprarViaje}
                                                    onChange={(e) => { setCantPasajesComprarViaje(e.target.value) }}
                                                    onClick={handleCloseAlert}
                                                    className="form-control"
                                                    maxLength='2'
                                                    onBlur={(e) => { setTotalPasajePagar(e.target.value * precioPasajeViaje) }}
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-10 col-form-label"><b>Total a pagar:</b> $ {totalPasajePagar} </label>
                                        </div>
                                        <hr></hr>
                                        <br />
                                    </form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>

            <Modal id="modalExitoVenta" show={showModalExito} onHide={handleCloseModalExito}>
                <Modal.Header >
                    <Modal.Title>Pasaje comprado con Éxito</Modal.Title>
                </Modal.Header>
                <Modal.Body>Su pasaje a sido reservado con éxito! Muchas gracias por viajar con nosotros!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={(e) => { volverAtras() }}>
                        Volver al menú
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChoferVenderPasaje;