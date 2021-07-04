import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store, auth } from '../../firebaseconf'
import { TrashFill, PencilFill } from 'react-bootstrap-icons';


function UsuarioViajesComprados() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'

    };


    //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

    const [showAlert2, setShowAlert2] = useState(false);
    const handleCloseAlert2 = () => setShowAlert2(false);

    const [msgError, setMsgError] = useState(null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState(null)

    //ALERT DANGER
    const [showAlertDanger, setShowAlertDanger] = useState(false)
    const handleCloseAlertDanger = () => setShowAlertDanger(false)

    const [msgDanger, setMsgDanger] = useState(null)

    //MODAL Ver datalle pasaje y Cancelar Pasaje 
    const [showModalEdit, setShowModalEdit] = useState(false)
    const handleCloseEdit = () => setShowModalEdit(false)
    const [showModalCancelar, setShowModalCancelar] = useState(false)
    const handleCloseCancelar = () => setShowModalCancelar(false)
    const [showModalAviso, setShowModalAviso] = useState(false)
    const handleCloseAviso = () => setShowModalAviso(false)

    const [pasajesComprados, setPasajesComprados] = useState([])
    const [origen, setOrigen] = useState('')
    const [destino, setDestino] = useState('')
    const [fecha, setFecha] = useState('')
    const [cantidadPasajes, setCantPasajes] = useState('')
    const [viaje, setViaje] = useState('')
    const [pasajeViajeVendido, setPasajeViajeVendido] = useState([])
    const [itemPasaje, setItemPasaje] = useState([])
    const [estado, setEstado] = useState('')
    // select
    var hoy = new Date()


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

                    auth.onAuthStateChanged((user) => {
                        let userPasaje = fetchedViajes.filter((item) => item.infoPasajero.idUser === user.uid)
                        setPasajesComprados(userPasaje)
                        // setEstado(userPasaje.estadoPasaje)
                    })
                });
            })
    }
    const getPasajeVendido = () => {
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
        store.collection('pasajeComprados').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });

                auth.onAuthStateChanged((user) => {
                    let userPasaje = fetchedViajes.filter((item) => item.infoPasajero.idUser === user.uid)
                    setPasajesComprados(userPasaje)
                    // setEstado(userPasaje.estadoPasaje)
                })
            })
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


    }, []);
    const verDetalle = (itemOrigen, itemDestino, itemFecha, itemCantidadPasajes) => {
        setOrigen("Origen: " + itemOrigen)
        setDestino("Destino: " + itemDestino)
        setFecha(itemFecha)
        setCantPasajes(itemCantidadPasajes)
        setShowModalEdit(true)
    }

    const cancelarPasajeModal = (item) => {
        console.log('entre')
        console.log(item)
        setItemPasaje(item)
        setShowModalCancelar(true)
    }


    const cancelarPasaje = async () => {
        let diaHoy = hoy.getDate()
        // let mesHoy = hoy.getMonth()
        // let anioHoy = hoy.getFullYear()
        let fecha = new Date(itemPasaje.infoViaje.fechaviaje)
        let diaFecha = fecha.getDate() + 1
        // let mesFecha = fecha.getMonth()
        // let anioFecha = fecha.getFullYear()
        setShowModalAviso(true)
        if (diaFecha - diaHoy >= 2) {
            setMsgError('Se procede a devolver el 100% del valor del pasaje, esperamos que pueda contar con nuestro servicio mas adelante')
        } else {
            if (diaFecha - diaHoy < 2) {
                setMsgError('Se procede a devolver el 50% del valor del pasaje, esperamos que pueda contar con nuestro servicio mas adelante')
            }
        }
        //Actualizo el estado del pasaje Comprado


        let actualizarPasajeComprado = {
            cantidadButacas: itemPasaje.cantidadButacas,
            estadoPasaje: 'Cancelado',
            idPasajero: itemPasaje.idPasajero,
            idViaje: itemPasaje.idViaje,
            infoPasajero: itemPasaje.infoPasajero,
            infoViaje: itemPasaje.infoViaje,
            snackComprados: itemPasaje.snackComprados,
            tieneSnackComprados: itemPasaje.tieneSnackComprados,
            totalPagado: itemPasaje.totalPagado
        }

        await store.collection('pasajeComprados').doc(itemPasaje.id).set(actualizarPasajeComprado)
        getPasajeComprado()
        // actualizarPasajeComprado.infoViaje.butacaDisponible = actualizarPasajeComprado.infoViaje.butacaDisponible + parseInt(actualizarPasajeComprado.cantidadButacas)

        // se busca por idViaje , idPasajero y cantidad de butacas

        let viajeParaActualizar = pasajeViajeVendido.find((itemViaje) => {
            return itemViaje.idViaje === itemPasaje.idViaje && itemViaje.idPasajero === itemPasaje.idPasajero && itemViaje.cantidadButacas === itemPasaje.cantidadButacas
        })

        //Elimino de la coleccion de pasajesVendidos el pasaje que cancelo el Usuario

        await store.collection('pasajeViajeVendido').doc(viajeParaActualizar.id).delete()
        getPasajeVendido()
        let buscarViaje = viaje.find((item) => {
            return item.id === itemPasaje.idViaje
        })

        //Actualizo la cantidad de butacas del viaje y la cargo


        let modificarViaje = {
            butacaDisponible: buscarViaje.butacaDisponible + parseInt(itemPasaje.cantidadButacas),
            combi: buscarViaje.combi,
            datosCombi: buscarViaje.datosCombi,
            datosRuta: buscarViaje.datosRuta,
            destino: buscarViaje.destino,
            estado: buscarViaje.estado,
            fechaviaje: buscarViaje.fechaviaje,
            id: buscarViaje.id,
            idCombi: buscarViaje.idCombi,
            idRuta: buscarViaje.idRuta,
            origen: buscarViaje.origen,
            precio: buscarViaje.precio,
            ruta_entera: buscarViaje.ruta_entera

        }
        await store.collection('viaje').doc(buscarViaje.id).set(modificarViaje)
        getViajes()
        setShowModalCancelar(false)


    }


    return (
        <div>
            <MenuUsuario />
            <MenuOpcUsuario optionName="detalleViajes" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}> Listado de Viajes comprados</h3>
                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>
                <Alert id="danger" className="" variant="danger" show={showAlertDanger} onClick={handleCloseAlertDanger} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgDanger}
                </Alert>
                <div style={subPageStyle}>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                pasajesComprados.length !== 0 ?
                                    (
                                        pasajesComprados.map(item => (
                                            <tr key={item.id}>

                                                <td>{item.infoViaje.origen}</td>
                                                <td>{item.infoViaje.destino}</td>
                                                <td>{item.infoViaje.fechaviaje}</td>
                                                <td>{item.estadoPasaje}</td>
                                                <td style={{ width: "15%" }} >
                                                    <div className="d-flex justify-content-around">
                                                        <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { verDetalle(item.infoViaje.origen, item.infoViaje.destino, item.infoViaje.fechaviaje, item.cantidadButacas) }}>
                                                            <PencilFill color="white"></PencilFill>
                                                        </button>
                                                        {
                                                            item.estadoPasaje === "Pendiente" ?
                                                                <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(e) => { console.log(item.estadoPasaje); cancelarPasajeModal(item) }}>
                                                                    Cancelar Pasaje
                                                                </button>
                                                                : <></>
}
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
                    pasajesComprados.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
                }
            </div>
        </div>
            {
        showModalEdit ?
            (
                <Modal id="modalEditar" show={showModalEdit} onHide={handleCloseEdit}>
                    <Modal.Header >
                        <Modal.Title>Mostrar detalles del pasaje</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-group'>
                            <p>Origen:</p>
                            <input
                                className='form-control mt-2'
                                type="text"
                                placeholder={origen}
                                id="origen"
                                value={origen}
                                disabled
                            />
                            <p>Destino:</p>
                            <input
                                className='form-control mt-2'
                                type="text"
                                placeholder={destino}
                                id="destino"
                                value={destino}
                                disabled
                            />
                            <p>Fecha del Pasaje:</p>

                            <input
                                className='form-control mt-2'
                                type="data"
                                placeholder={fecha}
                                id="fecha"
                                value={fecha}
                                disabled
                            />

                            <p>Cantidad de Pasajes:</p>
                            <input
                                className='form-control mt-2'
                                type="number"
                                placeholder={cantidadPasajes}
                                id="destino"
                                value={cantidadPasajes}
                                disabled
                            />

                        </form>
                        <Alert className="mt-4" variant="danger" show={showAlert}>
                            {msgError}
                        </Alert>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setShowModalEdit(false); setMsgError(null); setShowAlert(false); }}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <></>
            )

    }

    {
        showModalCancelar ?
            (
                <Modal id="modalCancelar" show={showModalCancelar} onHide={handleCloseCancelar}>
                    <Modal.Header >
                        <Modal.Title>Cancelar Pasaje</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Esta seguro/a que desea cancelar el pasaje?
                        {/* <Alert className="mt-4" variant="danger" show={showAlert}>
                                    {msgError}
                                </Alert> */}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={cancelarPasaje}>
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
                        <Button variant="secondary" onClick={() => { setShowModalAviso(false); setMsgError(null); setShowAlert(false); }}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <></>
            )

    }
        </div >


    );
}

export default UsuarioViajesComprados;