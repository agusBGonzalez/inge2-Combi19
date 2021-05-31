import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store } from '../../firebaseconf'
import { TrashFill, PencilFill } from 'react-bootstrap-icons';


function UsuarioBuscarViajes() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'

    };

    //MODAL ELIMINAR
    const [sitioEliminar, setSitioEliminar] = useState('');

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
    const [sitioEditar, setSitioEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    const [esSitioRepetido, setEsSitioRepetido] = useState(false)
    const handleCloseEdit = () => setShowModalEdit(false)

    const [viajes, setViajes] = useState([])
    const [viajesFiltrados, setViajesFiltrados] = useState([])



    const [fecha, setFecha] = useState('')
    const [combi, setCombi] = useState('')
    const [origen, setOrigen] = useState([])
    const [destino, setDestino] = useState('')



    const [butacaDisponible, setButacaDisponible] = useState('')
    const [precio, setPrecio] = useState('')

    // select
    const [rutaSelect, setRutaSelect] = useState([])
    const [sitioSelect, setSitioSelect] = useState([])
    const [combiSelect, setCombiSelect] = useState([])
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
                setViajes(fetchedViajes)
            })
    }
    useEffect(() => {
        const datosSitios = async() =>{
            const {docs} = await store.collection('sitios').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setSitioSelect(nuevoArray)
            const r = await store.collection('viaje').get()
            const viajesArray = r.docs.map( item => ({id:item.id, ...item.data()}))
            setViajes(viajesArray)
        }

        store.collection('buscarViajes').get()
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
            datosSitios()
    }, []);
    const filtarViajes = () => {
        setShowModalEdit(true)
    }

    const confirmarBusqueda = async () => {
        if (origen === "") {
            setMsgError('El campo nombre esta vacio')
            setShowAlert(true)
            return
        }
        if (destino === "") {
            setMsgError('El campo tipo esta vacio')
            setShowAlert(true)
            return
        }
        if (fecha === "") {
            setMsgError('El precio tipo esta vacio')
            setShowAlert(true)
            return
        }
        if (origen === destino){
            setMsgError('Origen y destino deben ser diferentes')
            setShowAlert(true)
            return
        }        
        getViajes()
        viajes.map(v=>{
            console.log(v.origen)
            console.log(origen)
            if (v.origen === origen ){
                if (v.destino === destino){
                    if(v.fecha === fecha){
                    }
                }
            }
        })

    }
    const comprar = () => {
    }


    return (
        <div>
            <MenuUsuario />
            <MenuOpcAdmin optionName="listaSitios" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}> Listado de Viajes</h3>
                <Button style={{ top: 105, position: 'absolute', right: 70, width: "150px", height: "40px" }} onClick={(e) => { filtarViajes() }} variant="secondary " > Filtrar Viajes</Button>
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
                                <th>Horario</th>
                                <th>Tipo Combi</th>
                                <th>Precio</th>
                                <th>Butacas</th>
                                <th>Accinones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                viajesFiltrados.length !== 0 ?
                                    (
                                        viajesFiltrados.map(item => (
                                            <tr key={item.id}>

                                                <td>{item.origen.provincia}{' - '}{item.origen.ciudad}</td>
                                                <td>{item.origen.provincia}{' - '}{item.destino.ciudad}</td>
                                                <td>{item.fecha}</td>
                                                <td>{item.horario}</td>
                                                <td>{item.tipo}</td>
                                                <td>{item.precio}</td>
                                                <td>{item.butacas}</td>
                                                <td style={{ width: "12%" }} >
                                                    <div className="d-flex justify-content-around">
                                                        <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { comprar() }}>
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
                        viajesFiltrados.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
                    }
                </div>
            </div>
            {
                showModalEdit ?
                    (
                        <Modal id="modalEditar" show={showModalEdit} onHide={handleCloseEdit}>
                            <Modal.Header >
                                <Modal.Title>Filtrar Busqueda</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form className='form-group'>
                                    {/* 
                                    origen
                                    destino
                                    fecha*/}
                                    <select
                                        value={origen} onChange={(e) => { setOrigen(e.target.value) }}
                                        className="form-control form-select-lg mt-3" aria-label=".form-select-lg example"><option disabled="disabled" value="">Seleccione El Origen </option>
                                        {
                                            sitioSelect.map(item => (
                                                <option name={item.id}>{item.provincia}{' - '}{item.ciudad}</option>
                                            )
                                            )
                                        }
                                    </select>
                                    <select
                                        value={destino} onChange={(e) => { setDestino(e.target.value) }}
                                        onClick={handleCloseAlert}
                                        className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                        <option disabled="disabled" value="">Seleccione el Destino </option>
                                        {
                                            sitioSelect.map(item => (
                                                <option name={item.id}>{item.provincia}{' - '}{item.ciudad}</option>

                                            )
                                            )
                                        }
                                    </select>
                                    <input onChange={(e) => { setFecha(e.target.value) }}
                                        onClick={handleCloseAlert}
                                        className='form-control mt-2'
                                        type="date"
                                        maxLength='8'
                                        placeholder='Fecha del viaje'
                                        id="fecha"
                                        value={fecha}
                                    />
                                </form>
                                <Alert className="mt-4" variant="danger" show={showAlert}>
                                    {msgError}
                                </Alert>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="primary" onClick={confirmarBusqueda}>
                                    Confirmar
                        </Button>
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

export default UsuarioBuscarViajes;