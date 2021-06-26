import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store, auth } from '../../firebaseconf'

import { TrashFill, PencilFill } from 'react-bootstrap-icons';


function ChoferPageListarViaje() {

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

    const [showAlert2, setShowAlert2] = useState(false);

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
    const [showModalFiltar, setShowModalFiltar] = useState(false)
    const handleCloseFlitrar = () => showModalFiltar(false)

    const [estado, setEstado] = useState('')

    // select
    var hoy = new Date().toLocaleDateString()

    // colecciones de firebase
    const [viajes, setViajes] = useState([])
    const [combis, setCombis] = useState([])

    const [viajesFiltrados, setViajesFiltrados] = useState([])

    const [idUsuarioLogueado, setIdUsuarioLogueado] = useState('')
    const [userConfig, setUserConfig] = useState([])

    const [usuario, setUsuario] = useState('')
    const [esAdmin, setEsAdmin] = useState(false)
    const [esUsuarioLog, setEsUsuarioLog] = useState(false)



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
            })
    }
    const getCombis = () => {
        store.collection('combi').get()
            .then(response => {
                const fetchedCombis = [];
                response.docs.forEach(document => {
                    const fetchedCombi = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedCombis.push(fetchedCombi)
                });
                setCombis(fetchedCombis)
            })
    }
    const getViajesFiltrados = () => {
        store.collection('viajeChofer').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
                setViajesFiltrados(fetchedViajes)
            })
    }
    const detectarCombi = (id) => {

    }



    useEffect(() => {
        const datos = async () => {
            const { docs } = await store.collection('usuariosConfig').get()
            const userArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setUserConfig(userArray)
        }

        auth.onAuthStateChanged((user) => {
            if (user) {
                setUsuario(user.email)
                setIdUsuarioLogueado(user.uid)
            }
        })




        datos()
        store.collection('viajeChofer').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
                setViajesFiltrados(fetchedViajes)
            })
            .catch(error => {
                setMsgError(error)
                setShowAlert(true)
            });

    }, []);


    const filtarViajes = () => {
        setShowModalFiltar(true)
    }

    const confirmarFiltro = () => {
        getViajes()
        getCombis()
        console.log(idUsuarioLogueado)
        // recorro los viajes
        let combi
        viajes.map(v=>{

            combis.map(c=>{
                if (v.idCombi === c.id){
                    if(c.idChofer === idUsuarioLogueado){
                        const agregarViaje = {
                            origen: v.origen,
                            destino: v.destino,
                            fecha: v.fechaviaje
                        }
                        console.log(agregarViaje)
                        store.collection('viajeChofer').add(agregarViaje)
                    }
                }
            })
            
            
        })
        getViajesFiltrados()
        console.log(viajesFiltrados)
        try {
            //FALTA MOSTRAR MSJ DE SUCESS
            getViajesFiltrados()
            setShowModalFiltar(false)
        } catch (err) {
            console.log(err)
            setMsgError(err)
            setShowAlert(true)
        }
    }

    return (
        <div>
            <MenuUsuario />
            <MenuOpcUsuario optionName="choferListarViaje" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}> Listado de mis Viajes</h3>
                <Button style={{ top: 105, position: 'absolute', right: 70, width: "200px", height: "40px" }} onClick={(e) => { filtarViajes() }} variant="secondary " > + Agregar Producto</Button>

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
                                viajesFiltrados.length !== 0 ?
                                    (
                                        viajesFiltrados.map(item => (
                                            <tr key={item.id}>

                                                <td>{item.origen}</td>
                                                <td>{item.destino}</td>
                                                <td>{item.fecha}</td>
                                                <td>{item.estado}</td>
                                                <td style={{ width: "12%" }} >
                                                    <div className="d-flex justify-content-around">
                                                        <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { }}>
                                                            {/* <PencilFill color="white"></PencilFill> */} 
                                                            Ver detalle de viaje
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
                        viajesFiltrados.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
                    }
                </div>
            </div>
            {

                showModalFiltar ?
                    (
                        <Modal id="modalEditar" show={showModalFiltar} onHide={handleCloseFlitrar}>
                            <Modal.Header >
                                <Modal.Title>Filtrar Busqueda</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form className='form-group'>
                                    <select
                                        value={estado} onChange={(e) => { setEstado(e.target.value) }}
                                        className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                        <option disabled="disabled" value="">Seleccione Tipo</option>
                                        <option value="todos">Todos</option>
                                        <option value="finalizado">Finalizado</option>
                                        <option value="pendiente">Pendiente</option>
                                    </select>

                                </form>




                                <Alert className="mt-4" variant="danger" show={showAlert}>
                                    {msgError}
                                </Alert>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="primary" onClick={() => { confirmarFiltro() }} >
                                    Confirmar
                                </Button>
                                <Button variant="secondary" onClick={() => { setShowModalFiltar(false); setMsgError(null); setShowAlert(false); }}>
                                    Cancelar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (<></>)
            }
        </div>


    );
}

export default ChoferPageListarViaje;