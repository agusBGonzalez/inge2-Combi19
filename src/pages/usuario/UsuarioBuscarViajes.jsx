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
    const [combi,setCombi] = useState('')
    const [butacaDisponible, setButacaDisponible] = useState('')
    const [precio,setPrecio] = useState('')

    // select
    const [rutaSelect,setRutaSelect] = useState([])
    const [sitioSelect,setSitioSelect] = useState([])
    const [combiSelect,setCombiSelect] = useState([])
    var hoy = new Date().toLocaleDateString()


    const getViajes =  () => {
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
        const datos = async() =>{
            const {docs} = await store.collection('sitio').get()
            const sitioArray = docs.map( item => ({id:item.id, ...item.data()}))
            setSitioSelect(sitioArray)
            const {docs2} = await store.collection('combi').get()
            const combiArray = docs2.map( item => ({id:item.id, ...item.data()}))
            setCombiSelect(combiArray)
            const respuesta = await store.collection('ruta').get()
            const rutaArray = respuesta.docs.map( item => ({id:item.id, ...item.data()}))
            setRutaSelect(rutaArray)
        }
        
        datos()
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
        .catch(error => {
            setMsgError(error)
            setShowAlert(true)
        });
    }, []);   
    const filtarViajes =  () => {
        setShowModalEdit(true)
    }

    const confirmarBusqueda =  () => {
        setShowModalEdit(true)
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
                                // sitios.length !== 0 ?
                                //     (
                                //         sitios.map(item => (
                                //             <tr key={item.id}>
                                //                 <td>{item.provincia}</td>
                                //                 <td>{item.ciudad}</td>
                                //                 <td style={{ width: "12%" }} >
                                //                     <div className="d-flex justify-content-around">
                                //                         <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarSitio('E', item) }}>
                                //                             <PencilFill color="white"></PencilFill>
                                //                         </button>
                                //                         <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => { borrarSitio(item) }}>
                                //                             <TrashFill color="white"></TrashFill>
                                //                         </button>
                                //                     </div>
                                //                 </td>
                                //             </tr>
                                //         ))
                                //     ) : (
                                //         <></>
                                //     )
                            }
                        </tbody>
                    </Table>
                    {
                       // sitios.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
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