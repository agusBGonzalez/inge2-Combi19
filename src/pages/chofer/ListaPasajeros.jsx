import React, { useState, useEffect } from 'react'
import MenuUsuarioChofer from '../../components/menus/MenuUsuarioChofer'
import MenuOpcChofer from '../../components/menus/MenuOpcChofer'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store } from '../../firebaseconf'
import Accordion from 'react-bootstrap/Accordion'
import { Card } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'


const ListaPasajeros = () => {
    const subPageStyle = {
        top: 200,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'

    };
    //PARA VOLVER AL LISTADO DE VIAJES DE UN CHOFER
    const historial = useHistory()

    const location = useLocation()
    const datosViaje = location.state.idViaje
    const volverAtras = () => {
        historial.push('/choferListarViaje')
        console.log('que tiene info', pasajeVendido)
    }

    //MODAL ELIMINAR
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => { setShowModal(false); setShowAlertDelete(false); setMsgErrorDelete(null) };

    //ALERT ERROR EDITAR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

    const [msgError, setMsgError] = useState(null)

    //ALERT ERROR ELIMINAR
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const handleCloseAlertDelete = () => setShowAlertDelete(false);
    const [msgErrorDelete, setMsgErrorDelete] = useState(null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState(null)

    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [choferEditar, setChoferEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)


    const handleCloseEdit = () => setShowModalEdit(false)

    const [check, setCheck] = useState(false)
    const [ausente, setAusente] = useState([])
    const [pasajeVendido, setPasajeVendido] = useState([])
    const [snack, setSnack] = useState([])
    const [infoSnack, setInfoSnack] = useState({})
    const [pasajeViajeVendido, setPasajeViajeVendido] = useState([])
    //desabilitar boton sintomas
    const [habilita, setHabilita] = useState(false);




    // controlar covid
    const [temp, setTemp] = useState('')
    const [checkGustoOlfato, setCheckGustoOlfato] = useState(false)
    const [checkTemperatura, setCheckTemperatura] = useState(false)
    const [checkDificultadResp, setCheckDificultadResp] = useState(false)
    const [checkDolorGarganta, setCheckDolorGarganta] = useState(false)
    const [cantSintomas, setCantidadSintomas] = useState(0)
    const [showModalRegistrarDatosCovid, setShowModalRegistrarDatosCovid] = useState(false)
    const handleCloseRegistrarDatosCovid = () => showModalRegistrarDatosCovid(false)
    const [pasajero, setPasajero] = useState('')
    const hoy = new Date()
    const [idS, setIdS] = useState('')
    const [tamaño, setTamaño] = useState(0)
    const [pasaCheckIn, setPasaCheckIn] = useState([])
    const [posCheck, setPosCheck] = useState('')



    //Cancelar Viaje
    const [itemPasaje, setItemPasaje] = useState([])
    const [showModalCancelar, setShowModalCancelar] = useState(false)
    const handleCloseCancelar = () => setShowModalCancelar(false)
    const [pasajesComprados, setPasajesComprados] = useState([])
    const [viaje, setViaje] = useState([])

    //Cancelar Viaje
    // const [itemPasaje, setItemPasaje] = useState([])
    const [showModalFinalizar, setShowModalFinalizar] = useState(false)
    const handleCloseFinalizar = () => setShowModalFinalizar(false)
    // const [pasajesComprados, setPasajesComprados] = useState([])
    // const [viaje, setViaje] = useState([])

    //usuariosConfig
    const [usuariosConfig, setUsuariosConfig] = useState([])

    const [showModalAviso, setShowModalAviso] = useState(false)
    const handleCloseAviso = () => setShowModalAviso(false)

    const getPasajeComprado = () => {
        store.collection('pasajeComprados').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                    setPasajesComprados(fetchedViajes)
                    // auth.onAuthStateChanged((user) => {
                    //     let userPasaje = fetchedViajes.filter((item) => item.infoPasajero.idUser === user.uid)
                    //     setPasajesComprados(userPasaje)
                    //     // setEstado(userPasaje.estadoPasaje)
                    // })
                });
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
                setViaje(fetchedViajes)
            })
    }

    const getPasajeViajeVendido = () => {
        store.collection('pasajeViajeVendido').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
                setPasajeViajeVendido(fetchedViajes)
            })
    }
    useEffect(() => {
        getPasajeComprado()
        getViajes()
        const datos = async () => {
            const { docs } = await store.collection('pasajeViajeVendido').get()
            const pasajeArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setPasajeViajeVendido(pasajeArray)
            let snackPasaje = []
            let arregloPasaje = []
            pasajeArray.map(pasaje => {
                if (datosViaje.infoViaje.id === pasaje.idViaje) {
                    setItemPasaje(datosViaje)
                    arregloPasaje.push(pasaje)
                    if (pasaje.tieneSnackComprados) {
                        pasaje.snackComprados.map(sn => {
                            let producto = {
                                pasajeroNombre: pasaje.infoPasajero.nombres,
                                pasajeroApellido: pasaje.infoPasajero.apellido,
                                idProducto: sn.idSnack,
                                cantidad: sn.infoSnack.cantidad,
                                nombre: sn.infoSnack.nombre,
                                precio: sn.infoSnack.precio
                            }
                            snackPasaje.push(producto)
                        })

                    }
                } else {
                    // setSnack(null)
                }
                setInfoSnack()

            }
            )
            setSnack(snackPasaje)
            setTamaño(arregloPasaje.length)
            setPasajeVendido(arregloPasaje)
            let checkIn = []
            arregloPasaje.forEach(document => {
                checkIn.push(false)
            });
            setPasaCheckIn(checkIn)

            //usuariosConfig
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

                    setUsuariosConfig(fetchedUsers)
                })

        }
        datos()

    }, []);



    const estaTildado = (check, item) => {

        let index = pasajeVendido.findIndex(todo => todo.id === item.id);
        let pasaj = pasaCheckIn
        pasaj[index] = !pasaj[index]
        pasajeVendido[index].estadoPasaje = pasaj[index] === true ? "Ausente" : "Pendiente"
        setPasaCheckIn(pasaj)
        setCheck(pasaj[index])
        setIdS(item.id)
        let arreglo = ausente
        const repetidoAusente = ausente.find(elemento => elemento === item.id)
        if (repetidoAusente === undefined && check) {
            arreglo.push(item)
            setAusente(arreglo)
        } else {
            if (!check) {
                arreglo.pop()
                setAusente(arreglo)
            }
        }
        // item.estadoPasaje = "Ausente"
        if (!check) {
            // item.estadoPasaje = "Pendiente"
            setHabilita(false)
            setTamaño(tamaño + 1)
        } else {
            setHabilita(true)
            setTamaño(tamaño - 1)
        }

    }


    //control datos covid
    let sintomasPasajero = []
    let pasajerosPresentes = []
    const registrarDatosCovid = (item, index) => {
        setPasajero(item)
        setPosCheck(index)
        setShowModalRegistrarDatosCovid(true)
    }




    const confirmarDatosCovid = async () => {
        let sospechoso = false


        if (parseInt(temp) > 40) {
            setMsgError('El valor de la temperatura asignada es invalido')
            setShowAlert(true)
            return
        }
        if (parseInt(temp) < 35) {
            setMsgError('El valor de la temperatura asignada es invalido')
            setShowAlert(true)
            return
        }
        if (temp === "") {
            setMsgError('El campo temperatura esta vacio')
            setShowAlert(true)
            return
        }
        
        pasaCheckIn[posCheck] = !pasaCheckIn[posCheck]
        if (temp >= 38) {
            sintomasPasajero.push("temperatura mayor a 38 grados")
            // alert("El pasajero no podra viajar por tener fiebre, asi mismo se devolvera su dinero y no podra comprar pasajes por 14 dias")
            sospechoso = true
        }
        else {
            // console.log(" temperatura alta por 1 semana ", checkTemperatura)
            // console.log(" perdida del gusto ", checkGustoOlfato)
            // console.log(" dificultad respiratoria", checkDificultadResp)
            // console.log("dolorGarganta ", checkDolorGarganta)
            // console.log(cantSintomas)
            if (cantSintomas > 1) {
                // alert("El pasajero no podra viajar por tener mas de dos sintomas, asi mismo se devolvera su dinero y no podra comprar pasajes por 14 dias")
                if (checkTemperatura) {
                    sintomasPasajero.push("tuvo una temperatura mayor a 38 grados durante la ultima semana")
                }
                if (checkGustoOlfato) {
                    sintomasPasajero.push("posee perdida de gusto y/o olfato")

                }
                if (checkDificultadResp) {
                    sintomasPasajero.push("posee dificultades respiratorias")
                }
                if (checkDolorGarganta) {
                    sintomasPasajero.push("posee dolor de garganta")

                }
                sospechoso = true
            }
        }
        if (sospechoso) {
            setTamaño(tamaño - 1)
            const pasajeroSospechoso = {
                datos: pasajero,
                sintomas: sintomasPasajero
            }

            pasajero.estadoPasaje = "Sospechoso Covid"
            await store.collection('reporteSospechosos').add(pasajeroSospechoso)

            // marco como sospechoso en pasajesComprados
            pasajesComprados.map(itemViajeChofer => {
                console.log("ajskdhs")
                if (itemViajeChofer.idViaje === itemPasaje.infoViaje.id && itemViajeChofer.estadoPasaje === 'En curso') {
                    console.log("safasfasf")
                    // console.log(itemViajeChofer)
                    let actualizarPasajeComprado = {
                        cantidadButacas: itemViajeChofer.cantidadButacas,
                        estadoPasaje: 'Sospechoso Covid',
                        idPasajero: itemViajeChofer.idPasajero,
                        idViaje: itemViajeChofer.idViaje,
                        infoPasajero: itemViajeChofer.infoPasajero,
                        infoViaje: itemViajeChofer.infoViaje,
                        snackComprados: itemViajeChofer.snackComprados,
                        tieneSnackComprados: itemViajeChofer.tieneSnackComprados,
                        totalPagado: itemViajeChofer.totalPagado
                    }
                    console.log(itemViajeChofer.infoPasajero)
                    store.collection('pasajeComprados').doc(itemViajeChofer.id).set(actualizarPasajeComprado)
                    getPasajeComprado()
                } else {
                    let fechaViaje = new Date(itemViajeChofer.infoViaje.fechaviaje)
                    let diaFecha = fechaViaje.getDate() + 1
                    let mesFecha = fechaViaje.getMonth()
                    let diacovid = diaFecha + 14
                    let mescovid = 0
                    if (diacovid > 30) {
                        mescovid = mesFecha + 1
                        diacovid = 30 - diaFecha
                    }
                    if (diaFecha < diacovid) {
                        if (itemViajeChofer.idPasajero === pasajero.idPasajero && itemViajeChofer.estadoPasaje === 'Pendiente') {
                            console.log(itemViajeChofer)
                            let actualizarPasajeComprado = {
                                cantidadButacas: itemViajeChofer.cantidadButacas,
                                estadoPasaje: 'Rechazado',
                                idPasajero: itemViajeChofer.idPasajero,
                                idViaje: itemViajeChofer.idViaje,
                                infoPasajero: itemViajeChofer.infoPasajero,
                                infoViaje: itemViajeChofer.infoViaje,
                                snackComprados: itemViajeChofer.snackComprados,
                                tieneSnackComprados: itemViajeChofer.tieneSnackComprados,
                                totalPagado: itemViajeChofer.totalPagado
                            }
                            store.collection('pasajeComprados').doc(itemViajeChofer.id).set(actualizarPasajeComprado)
                            getPasajeComprado()
                        }
                    }

                }


            })
            let arregloViaje = []
            pasajeViajeVendido.map(item => {
                if (item.id !== pasajero.id && item.idPasajero === pasajero.idPasajero) {
                    console.log(item.id)
                    arregloViaje.push(item)
                    let viajeParaActualizar = viaje.find((itemViaje) => {
                        return itemViaje.id === item.idViaje
                    })
                    let modificarViaje = {
                        butacaDisponible: parseInt(viajeParaActualizar.butacaDisponible) + parseInt(item.cantidadButacas),
                        combi: viajeParaActualizar.combi,
                        datosCombi: viajeParaActualizar.datosCombi,
                        datosRuta: viajeParaActualizar.datosRuta,
                        destino: viajeParaActualizar.destino,
                        estado: viajeParaActualizar.estado,
                        fechaviaje: viajeParaActualizar.fechaviaje,
                        id: viajeParaActualizar.id,
                        idCombi: viajeParaActualizar.idCombi,
                        idRuta: viajeParaActualizar.idRuta,
                        origen: viajeParaActualizar.origen,
                        precio: viajeParaActualizar.precio,
                        ruta_entera: viajeParaActualizar.ruta_entera

                    }
                    store.collection('viaje').doc(viajeParaActualizar.id).set(modificarViaje)
                    getViajes()
                    store.collection('pasajeViajeVendido').doc(item.id).delete()
                    getPasajeViajeVendido()
                }

            })




        }
        else {
            // alert("en presentes estan los que pueden viajar")
            pasajero.estadoPasaje = "Arribó"
            // pasajerosPresentes
            setTamaño(tamaño - 1)
        }
        try {
            //FALTA MOSTRAR MSJ DE SUCESS
            setShowModalRegistrarDatosCovid(false)

        } catch (err) {
            console.log(err)
            setMsgError(err)
            setShowAlert(true)
        }
    }



    const estaTildadoTemperatura = (check) => {
        setCheckTemperatura(check)
        if (check) {
            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }


    }
    const estaTildadoGustoOlfato = (check) => {
        setCheckGustoOlfato(check)
        if (check) {
            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }

    }
    const estaTildadoDificultadRespitaroria = (check) => {
        setCheckDificultadResp(check)
        if (check) {

            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }
    }
    const estaTildadoDolorGarganta = (check) => {
        setCheckDolorGarganta(check)

        if (check) {
            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }
    }

    const venderPasaje = () => {
        historial.push('/venderPasaje', { idViaje: location.state.idViaje })

    }

    const cancelarViajeModal = () => {
        setShowModalCancelar(true)
    }

    const cancelarViaje = () => {

        //Actualizo el estado del pasaje Comprado

        let cantidad = 0
        pasajesComprados.map(itemViajeChofer => {
            if (itemViajeChofer.idViaje === itemPasaje.infoViaje.id && itemViajeChofer.estadoPasaje === 'En curso') {
                console.log(itemViajeChofer)
                let actualizarPasajeComprado = {
                    cantidadButacas: itemViajeChofer.cantidadButacas,
                    estadoPasaje: 'Cancelado',
                    idPasajero: itemViajeChofer.idPasajero,
                    idViaje: itemViajeChofer.idViaje,
                    infoPasajero: itemViajeChofer.infoPasajero,
                    infoViaje: itemViajeChofer.infoViaje,
                    snackComprados: itemViajeChofer.snackComprados,
                    tieneSnackComprados: itemViajeChofer.tieneSnackComprados,
                    totalPagado: itemViajeChofer.totalPagado
                }
                cantidad = cantidad + parseInt(actualizarPasajeComprado.cantidadButacas)
                store.collection('pasajeComprados').doc(itemViajeChofer.id).set(actualizarPasajeComprado)

                const notificacionCovid = {
                    fecha: itemViajeChofer.infoViaje.fechaviaje,
                    idUser: itemViajeChofer.infoPasajero.idUser,
                    leido: false,
                    mensaje: "VIAJE CANCELADO - El chofer cancelo el viaje! Se le devolverá el 100% del costo del pasaje. Lamentamos los problemas.",
                    tipo: 'cancelado'
                }

                store.collection('notificaciones').add(notificacionCovid)
                getPasajeComprado()
            }


        })

        //Actualizo la cantidad de butacas del viaje y la cargo
        console.log(cantidad)
        viaje.map(iViaje => {
            if (iViaje.id === itemPasaje.infoViaje.id) {
                let modificarViaje = {
                    butacaDisponible: parseInt(iViaje.butacaDisponible) + parseInt(cantidad),
                    combi: iViaje.combi,
                    datosCombi: iViaje.datosCombi,
                    datosRuta: iViaje.datosRuta,
                    destino: iViaje.destino,
                    estado: 'Cancelado',
                    fechaviaje: iViaje.fechaviaje,
                    id: iViaje.id,
                    idCombi: iViaje.idCombi,
                    idRuta: iViaje.idRuta,
                    origen: iViaje.origen,
                    precio: iViaje.precio,
                    ruta_entera: iViaje.ruta_entera

                }
                console.log(modificarViaje)
                store.collection('viaje').doc(iViaje.id).set(modificarViaje)
                getViajes()

            }


        })


        setMsgError('Viaje Cancelado! Se procede a devolver el 100% del valor del pasaje a cada pasajero')
        setShowModalAviso(true)
        setShowModalCancelar(false)


    }

    const finalizarViajeModal = () => {
        setShowModalFinalizar(true)
    }

    const finalizarViaje = () => {

        //Actualizo el estado del pasaje Comprado

        let cantidad = 0
        pasajesComprados.map(itemViajeChofer => {
            console.log(itemViajeChofer)
            console.log(itemPasaje)
            if (itemViajeChofer.idViaje === itemPasaje.infoViaje.id && itemViajeChofer.estadoPasaje === 'En curso') {
                console.log(itemViajeChofer)
                let actualizarPasajeComprado = {
                    cantidadButacas: itemViajeChofer.cantidadButacas,
                    estadoPasaje: 'Finalizado',
                    idPasajero: itemViajeChofer.idPasajero,
                    idViaje: itemViajeChofer.idViaje,
                    infoPasajero: itemViajeChofer.infoPasajero,
                    infoViaje: itemViajeChofer.infoViaje,
                    snackComprados: itemViajeChofer.snackComprados,
                    tieneSnackComprados: itemViajeChofer.tieneSnackComprados,
                    totalPagado: itemViajeChofer.totalPagado
                }
                cantidad = cantidad + parseInt(actualizarPasajeComprado.cantidadButacas)
                store.collection('pasajeComprados').doc(itemViajeChofer.id).set(actualizarPasajeComprado)

                const notificacionCovid = {
                    fecha: itemViajeChofer.infoViaje.fechaviaje,
                    idUser: itemViajeChofer.infoPasajero.idUser,
                    leido: false,
                    mensaje: "VIAJE FINALIZADO - gracias por elegirnos! Vuelva pronto!",
                    tipo: 'exito'
                }

                store.collection('notificaciones').add(notificacionCovid)
                getPasajeComprado()
            }
        })

        //Actualizo la cantidad de butacas del viaje y la cargo
        console.log(cantidad)
        viaje.map(iViaje => {
            if (iViaje.id === itemPasaje.infoViaje.id) {
                let modificarViaje = {
                    butacaDisponible: parseInt(iViaje.butacaDisponible) + parseInt(cantidad),
                    combi: iViaje.combi,
                    datosCombi: iViaje.datosCombi,
                    datosRuta: iViaje.datosRuta,
                    destino: iViaje.destino,
                    estado: 'Finalizado',
                    fechaviaje: iViaje.fechaviaje,
                    id: iViaje.id,
                    idCombi: iViaje.idCombi,
                    idRuta: iViaje.idRuta,
                    origen: iViaje.origen,
                    precio: iViaje.precio,
                    ruta_entera: iViaje.ruta_entera

                }
                console.log(modificarViaje)
                store.collection('viaje').doc(iViaje.id).set(modificarViaje)
                getViajes()

            }
        })


        setMsgError('Viaje Finalizado!')
        setShowModalAviso(true)
        setShowModalFinalizar(false)
        setMsgError(null)
        setShowAlert(false);


    }

    // desbloquear boton finalizar viaje, cuando estan todos los presentes / ausentes / sospechoso 
    return (
        <div>
            <MenuUsuarioChofer />
            <MenuOpcChofer optionName="choferListarViaje" />

            <div>
                <h3 style={{ top: 150, position: 'absolute', left: 80, width: "60%", }}> Informacion del Viaje</h3>

                <Button variant="secondary" style={{ top: 105, position: 'absolute', left: 80, width: "100px", height: "40px" }} onClick={(e) => { volverAtras() }}>Atras</Button>
                <Button variant="primary" style={{ top: 105, position: 'absolute', left: 400, width: "150px", height: "40px" }} onClick={(e) => venderPasaje()}>Vender Pasaje</Button>
                <Button style={{ top: 105, position: 'absolute', right: 70, width: "150px", height: "40px" }} variant="danger " onClick={(e) => cancelarViajeModal()}>Cancelar Viaje</Button>
                <Button variant="secondary" style={{ top: 105, position: 'absolute', right: 360, width: "150px", height: "40px" }} disabled={tamaño === 0 ? false : true} variant="danger " onClick={(e) => finalizarViajeModal()}>Finalizar Viaje</Button>
                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>

                <div style={subPageStyle}>
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0" defaultActiveKey>
                                Detalle Viaje
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <form style={{ left: "40px", width: "100%" }}>
                                        <div className="form-group row">
                                            <div className="form-group col-md-4">
                                                <label id="origenInfo"><b>Origen:</b> {datosViaje.origen}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="horarioInfo"><b>Horario:</b> {datosViaje.infoViaje.datosRuta.horario}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="butacasInfo"><b>Pasajes Disponibles:</b> {datosViaje.infoViaje.butacaDisponible}</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="form-group col-md-4">
                                                <label id="destinoInfo"><b>Destino:</b> {datosViaje.destino}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="precioInfo"><b>Precio unitario:</b> ${datosViaje.infoViaje.precio}</label>
                                            </div>
                                        </div>
                                        <hr></hr>

                                    </form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                                Lista de Pasajeros
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Table striped bordered hover variant="secondary" className="animate__animated animate__slideInUp" >
                                        <thead>
                                            <tr>
                                                <th>Apellido</th>
                                                <th>Nombres</th>
                                                <th>Email</th>
                                                <th>Cant. Pasajes</th>
                                                <th>Resultado</th>
                                                <th>Covid-19</th>
                                                <th>Ausente</th>
                                            </tr>
                                        </thead>
                                        <tbody >

                                            {
                                                pasajeVendido.length !== 0 ?
                                                    (
                                                        pasajeVendido.map((item, index) => (

                                                            <tr key={item.id}>
                                                                <td>{item.infoPasajero.apellido}</td>
                                                                <td>{item.infoPasajero.nombres}</td>
                                                                <td>{item.infoPasajero.email}</td>
                                                                <td>{item.cantidadButacas}</td>
                                                                <td>{item.estadoPasaje}</td>
                                                                <td style={{ width: "15px" }}>
                                                                    <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" disabled={pasaCheckIn[index] ? true : false} onClick={(e) => registrarDatosCovid(item, index)}>
                                                                        Sintomas
                                                                    </button>
                                                                </td>
                                                                <td style={{ width: "10px" }}>
                                                                    <div class="custom-control custom-checkbox">
                                                                        {/* 
                                                                            disabled ={item.inicio? false:true}
                                                                         */}

                                                                        <input type="checkbox" value={pasaCheckIn[index]} onChange={(e) => { estaTildado(e.target.checked, item) }} />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <></>
                                                    )
                                            }
                                        </tbody>
                                        {
                                            pasajeVendido.length === 0 ?
                                                (
                                                    <h5>"No hay pasajeros para este viaje"</h5>
                                                ) : (<></>)
                                        }
                                    </Table>


                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                                Lista de Snacks
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                                <Card.Body>
                                    <Table striped bordered hover variant="secondary" className="animate__animated animate__slideInUp" >
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Apellido</th>
                                                <th>Nombre</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                snack.length !== 0 ?
                                                    (
                                                        snack.map(item => (

                                                            <tr key={item.idSnack}>
                                                                <td>{item.nombre}</td>
                                                                <td>{item.cantidad}</td>
                                                                <td>{item.pasajeroApellido}</td>
                                                                <td>{item.pasajeroNombre}</td>

                                                            </tr>
                                                        ))

                                                    ) : (
                                                        <></>
                                                    )
                                            }
                                        </tbody>
                                        {
                                            snack.length === 0 ?
                                                (
                                                    <h5>"No hay Snacks comprados para este viaje"</h5>
                                                ) : (<></>)
                                        }
                                    </Table>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>

                </div>
            </div>
            {
                showModalRegistrarDatosCovid ? (
                    <Modal id="registrsrDatosCovid" show={showModalRegistrarDatosCovid} onHide={handleCloseRegistrarDatosCovid}>
                        <Modal.Header >
                            <Modal.Title>Registrar Sintomas</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form className='form-group'>
                                <input onChange={(e) => { setTemp(e.target.value) }}
                                    onClick={handleCloseAlert}
                                    className='form-control mt-5'
                                    type="number"
                                    placeholder='temperatura'
                                    id="temperatura"
                                    value={temp}
                                />
                                <br></br>
                                <Table striped bordered hover variant="secondary" >
                                    <thead>
                                        <tr>
                                            <th>Sintomas</th>
                                            <th>Si</th>
                                            {/* <th>No</th> */}
                                        </tr>
                                    </thead>
                                    <tbody >
                                        <tr>
                                            <th><label for="fiebreUltimaSemana">Tuvo fiebre la ultima semana</label></th>
                                            <th><input type="checkbox" defaultChecked={checkTemperatura} name="fiebreUltimaSemana" onClick={(e) => estaTildadoTemperatura(e.target.checked)} /> </th>
                                            {/* <th><input type="checkbox" name="fiebreUltimaSemana" value="no" /></th> */}
                                        </tr>
                                        <tr>
                                            <th><label for="gustoOlfato">Tiene perdida del olfato y/o gusto</label></th>
                                            <th><input type="checkbox" defaultChecked={checkGustoOlfato} onClick={(e) => estaTildadoGustoOlfato(e.target.checked)} /></th>
                                            {/* <th><input type="checkbox" name="gustoOlfato" value="no" /></th> */}
                                        </tr>
                                        <tr>
                                            <th>Posee dificultades respiratorias</th>
                                            <th><input type="checkbox" defaultChecked={checkDificultadResp} onClick={(e) => estaTildadoDificultadRespitaroria(e.target.checked)} /></th>
                                            {/* <th><input type="checkbox" name="gustoOlfato" value="no" /></th> */}
                                        </tr>
                                        <tr>
                                            <th><label for="dolorGarganta">Posee dolor de garganta</label></th>
                                            <th><input type="checkbox" defaultChecked={checkDolorGarganta} onClick={(e) => estaTildadoDolorGarganta(e.target.checked)} /></th>
                                            {/* <th><input type="checkbox" name="dolorGarganta" value="no" /></th> */}
                                        </tr>
                                    </tbody>
                                </Table>
                            </form>
                            <Alert className="mt-4" variant="danger" show={showAlert}>
                                {msgError}
                            </Alert>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="primary" onClick={() => { confirmarDatosCovid() }} >
                                Confirmar
                            </Button>
                            <Button variant="secondary" onClick={() => { setShowModalRegistrarDatosCovid(false); setMsgError(null); setShowAlert(false); setCheckGustoOlfato(false); setCheckTemperatura(false); setCheckDificultadResp(false); setCheckDolorGarganta(false); setCantidadSintomas(false); setCantidadSintomas(0); setTemp('') }}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                ) : (<></>)
            }
            {
                showModalCancelar ?
                    (
                        <Modal id="modalCancelar" show={showModalCancelar} onHide={handleCloseCancelar}>
                            <Modal.Header >
                                <Modal.Title>Cancelar Viaje</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Esta seguro/a que desea cancelar el viaje?
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="primary" onClick={cancelarViaje}>
                                    Confirmar
                                </Button>
                                <Button variant="secondary" onClick={() => { setShowModalCancelar(false); setMsgError(null); setShowAlert(false); }}>
                                    Cancelar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        <></>
                    )

            }
            {
                showModalFinalizar ?
                    (
                        <Modal id="modalCancelar" show={showModalFinalizar} onHide={handleCloseFinalizar}>
                            <Modal.Header >
                                <Modal.Title>Finalizar Viaje</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Esta seguro/a que desea finalizar el viaje?
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="primary" onClick={finalizarViaje}>
                                    Confirmar
                                </Button>
                                <Button variant="secondary" onClick={() => { setShowModalFinalizar(false); setMsgError(null); setShowAlert(false); }}>
                                    Cancelar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        <></>
                    )

            }
            {
                showModalAviso ?
                    (
                        <Modal id="modalCancelar" show={showModalAviso} onHide={handleCloseAviso}>
                            <Modal.Header >
                                <Modal.Title></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {msgError}
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => { setShowModalAviso(false); setMsgError(null); setShowAlert(false); volverAtras() }}>
                                    Cerrar
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

export default ListaPasajeros