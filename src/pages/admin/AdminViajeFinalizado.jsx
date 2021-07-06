import React, { useState, useEffect } from 'react'
import MenuUsuarioAdmin from '../../components/menus/MenuUsuarioAdmin'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store } from '../../firebaseconf'
import { TrashFill, PencilFill } from 'react-bootstrap-icons';

const AdminViajeFinalizado = () => {
    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'

    };

    //MODAL ELIMINAR
    const [showModal, setShowModal] = useState(false);
    const [viajeEliminar, setViajeEliminar] = useState('');

    const handleClose = () => setShowModal(false);

    //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);
    const [showAlertDanger, setShowAlertDanger] = useState(false)
    const handleCloseAlertDanger = () => setShowAlertDanger(false)
    const [msgError, setMsgError] = useState(null)
    const [msgDanger, setMsgDanger] = useState(null)
    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState(null)


    //MODAL REGISTRAR / MODIFICAR
    // const [viajeEditar, setViajeEditar] = useState('')
    // const [esEditar, setEsEditar] = useState(false)



    const [viajes, setViajes] = useState([])

    const [fecha, setFecha] = useState('')
    const [combi, setCombi] = useState('')
    const [butacaDisponible, setButacaDisponible] = useState('')
    const [precio, setPrecio] = useState('')
    const [rutaSelect, setRutaSelect] = useState([])
    const [rutas, setRutas] = useState('')
    const [combiSelect, setCombiSelect] = useState([])
    const [auxiliar, setAuxiliar] = useState([])
    var hoy = new Date().toLocaleDateString()
    const fechaHoy = hoy.substr(0, hoy.indexOf(','))
    let aux = false
    let totFin = 0

    //REPORTE COVID
    const [reporteSospechoso, setReporteSospechoso] = useState([])
    const [viajeRepCovid, setViajeRepCovid] = useState('')
    const [showModalViajeRepCovid, setShowModalViajeRepCovid] = useState(false)
    const handleCloseshowModalViajeRepCovid = () => setShowModalViajeRepCovid(false)

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


    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        const datos = async () => {
            const { docs } = await store.collection('combi').get()
            const combiArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setCombiSelect(combiArray)
            const respuesta = await store.collection('rutasZaca').get()
            const rutaArray = respuesta.docs.map(item => ({ id: item.id, ...item.data() }))
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

    const getReportes = async (item) => {
        const { docs } = await store.collection('reporteSospechosos').get()
        const reporteSospechosoArray = docs.map(item => ({ id: item.id, ...item.data() }))

        const existeSospechoso = reporteSospechosoArray.filter((itemS) => itemS.datos.idViaje === item.id)
        setReporteSospechoso(existeSospechoso)
    }
    const verReporteCovid = (item) => {
        setViajeRepCovid(item)
        getReportes(item)
        let encontre = false
        let idViaje
        reporteSospechoso.map(rs => {
            //tengo q ver xq dice falso
            console.log(rs.datos.idViaje, "  es igual a  ", viajeRepCovid.id, " ??  ", rs.datos.idViaje === viajeRepCovid.id)
            if (rs.datos.idViaje === viajeRepCovid.id) {
                encontre = true
            }

        })
        setShowModalViajeRepCovid(true)


    }
    return (
        <div>
            <MenuUsuarioAdmin />
            <MenuOpcAdmin optionName="listaViajesFinalizados" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}> Listado de Viajes</h3>
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
                                <th>Fecha</th>
                                <th>Ruta</th>
                                <th>Combi</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="animate__animated animate__slideInUp">
                            {
                                viajes.length !== 0 ?
                                    (
                                        viajes.map(item => (
                                            item.estado === "Finalizado" ? (
                                                totFin = totFin + 1,
                                                <tr key={item.id}>
                                                    <td>{item.fechaviaje}</td>
                                                    <td>{item.ruta_entera}</td>
                                                    <td>{item.combi}</td>
                                                    <td style={{ width: "12%" }} >
                                                        <div className="d-flex justify-content-around">
                                                            <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { verReporteCovid(item) }}>
                                                                Ver reporte COVID
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <></>
                                            )
                                        ))

                                    ) : (
                                        <></>
                                    )
                            }
                        </tbody>
                    </Table>
                    {
                        viajes.length === 0 ?
                            (<div className="alert alert-warning mt-19"> No se encontraron Viajes registrados </div>)
                            : (
                                totFin > 0 ? (<div></div>) : (<div className="alert alert-warning mt-19"> No se encontraron Viajes Finalizados </div>)
                            )
                    }
                </div>
            </div>
            {
                showModalViajeRepCovid ?
                    (
                        <Modal id="ModalViajeRepCovid" show={showModalViajeRepCovid} onHide={handleCloseshowModalViajeRepCovid}>
                            <Modal.Header >
                                <Modal.Title>Ver Reporte COVID</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form className='form-group'>
                                    <Table striped bordered hover variant="secondary" className="animate__animated animate__slideInUp" >
                                        <thead>
                                            <tr>
                                                <th>Pasajero</th>
                                                <th>Rechasado por</th>

                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                reporteSospechoso.length !== 0 ?
                                                    (
                                                        reporteSospechoso.map(item => (
                                                            item.datos.idViaje === viajeRepCovid.id ? (
                                                                // item.sintomas.map(s => 
                                                                <tr>
                                                                    <td>{item.datos.infoPasajero.apellido + ", " + item.datos.infoPasajero.nombres}</td>
                                                                    <td>{
                                                                        item.sintomas.map(sintoma => <tr>{sintoma}</tr>)
                                                                    }</td>

                                                                </tr>
                                                            ) : (<></>)
                                                        
                                                        )) 
                                                    ): (
                                                        
                                                        <div className="alert alert-warning mt-17"> No se reportaron sospechosos de COVID para este viaje. </div>
                                                    )
                                            }

                                        </tbody>
                                    </Table>
                                </form>
                                <Alert className="mt-4" variant="danger" show={showAlert}>
                                    {msgError}
                                </Alert>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => { setShowModalViajeRepCovid(false); setMsgError(null); setShowAlert(false); }}>
                                    Cerrar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        <></>
                    )

            }

        </div>
    )
}

export default AdminViajeFinalizado
