import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store,auth } from '../../firebaseconf'
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

    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false)
    const handleCloseEdit = () => setShowModalEdit(false)

    const [pasajesComprados, setPasajesComprados] = useState([])
    const [productos, setProductos] = useState([])
    const [origen, setOrigen] = useState('')
    const [destino, setDestino] = useState('')
    const [fecha, setFecha] = useState('')
    const [cantidadPasajes, setCantPasajes] = useState('')
    const [viaje,setViaje] = useState('')

    //Usuario logueado
    const [esUsuarioLog,setEsUsuarioLog] = useState(false)
    const [idUsuarioLogueado,setIdUsuarioLogueado] = useState('')
    const [usuario,setUsuario] = useState ('')

    // select
    var hoy = new Date().toLocaleDateString()


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
                setPasajesComprados(fetchedViajes)
                console.log(fetchedViajes)
                auth.onAuthStateChanged( (user) => {
                    let userPasaje = fetchedViajes.filter((item) => item.infoPasajero.idUser === user.uid)
                    setPasajesComprados(userPasaje)
                    console.log(userPasaje)
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
           

    }, []);
    const verDetalle = (itemOrigen, itemDestino, itemFecha, itemCantidadPasajes, itemProductos) => {
        setOrigen("Provincia: " + itemOrigen.provincia + " Ciudad: " + itemOrigen.ciudad)
        setDestino("Provincia: " + itemDestino.provincia + " Ciudad: " + itemDestino.ciudad)
        setFecha(itemFecha)
        setCantPasajes(itemCantidadPasajes)
        store.collection('prodComprados').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
                setProductos(fetchedViajes)
            })
        setShowModalEdit(true)
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
                                <th>Accinones</th>

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
                                                <td style={{ width: "12%" }} >
                                                    <div className="d-flex justify-content-around">
                                                        <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { verDetalle(item.origen, item.destino, item.fecha, item.cantidadPasajes, item.productos) }}>
                                                            <PencilFill color="white"></PencilFill>
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
        </div>


    );
}

export default UsuarioViajesComprados;