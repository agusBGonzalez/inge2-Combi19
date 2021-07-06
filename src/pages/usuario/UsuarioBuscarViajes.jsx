import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store, auth } from '../../firebaseconf'
import { FileEarmarkSlidesFill } from 'react-bootstrap-icons'
import { useHistory } from 'react-router-dom'



function UsuarioBuscarViajes() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'

    };

    //NO BORRAR --> NECESARIO PARA PASAR DE PANTALLAS
    const historial = useHistory()

    //ALERT ERROR
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

    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false)
    const handleCloseEdit = () => setShowModalEdit(false)



    const [viajes, setViajes] = useState([])
    const [viajesFiltrados, setViajesFiltrados] = useState([])



    const [fecha, setFecha] = useState('')
    const [combi, setCombi] = useState([])
    const [ruta, setRuta] = useState([])

    const [origen, setOrigen] = useState('')
    const [idOrigen, setIdOrigen] = useState('')
    const [destino, setDestino] = useState('')
    const [idDestino, setIdDestino] = useState('')


    // select
    const [sitioSelect, setSitioSelect] = useState([])
    var hoy = new Date().toLocaleDateString()

    //bloquear busqueda por covid
    const [fechaSospechoso, setFechaSospechoso] = useState('')
    const [usuario, setUsuario] = useState(null)


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
        const datosViajes = async () => {
            const { docs } = await store.collection('sitios').get()
            const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setSitioSelect(nuevoArray)
            getViajes()

            auth.onAuthStateChanged((user) => {
                if (user) {
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

                            const usuarioEncontrado = fetchedUsers.find((itemUser) => {
                                return itemUser.idUser === user.uid
                            })
                            setUsuario(usuarioEncontrado)

                            if (usuarioEncontrado !== undefined && usuarioEncontrado.esSospechoso) {
                                let fechaViaje = new Date(usuarioEncontrado.sospechosoFecha)
                                let diaFecha = fechaViaje.getDate() + 1
                                let mesFecha = fechaViaje.getMonth()
                                let diacovid = diaFecha + 15
                                let mescovid = 0
                                if (diacovid > 30) {
                                    mescovid = mesFecha + 1
                                    diacovid = 30 - diaFecha
                                }
                                let fechaFin = "2021-07-" + diacovid
                                setFechaSospechoso(fechaFin)
                                console.log(fechaFin)
                                console.log((fechaSospechoso > "2021-07-06") ? fechaSospechoso : "2021-07-06")
                            } else {
                                console.log("entra al else")
                                setFechaSospechoso("2021-07-06")
                            }
                            

                        })
                        .catch(error => {
                            setMsgError(error)
                            setShowAlert(true)
                        });
                }
            })
        }

        datosViajes()
    }, []);


    const confirmarBusqueda = async () => {
        // deleteCollection(store, 'buscarViajes', 10);
        let fecha2
        let dia = 1
        let aux
        if (origen === "") {
            setMsgError('El campo Origen esta vacio')
            setShowAlert(true)
            return
        }
        if (destino === "") {
            setMsgError('El campo Destino esta vacio')
            setShowAlert(true)
            return
        }
        if (fecha === "") {
            setMsgError('El campo fecha esta vacio')
            setShowAlert(true)
            return
        } 
        // else {
        //     fecha2 = new Date(fecha)
        //     let hoydia = new Date().getDate() + 1
        //     let fechadia = fecha2.getDate() + 1
        //     // aux = new Date(fecha2.setDate(fecha2.getDate() + dia))
        //     if (hoydia > fechadia) {
        //         setMsgError('La fecha no puede ser posterior a la fecha actual')
        //         setShowAlert(true)
        //         return
        //     }

        // }
        if (origen === destino) {
            setMsgError('Origen y destino deben ser diferentes')
            setShowAlert(true)
            return
        }

        // aca lo que hago es guardar cual sera el origen y destino

        let combiViaje

        const sitioOrigen = sitioSelect.find((sitioOr) => {
            return sitioOr.id === idOrigen
        })

        const sitioDest = sitioSelect.find((sitioDst) => {
            return sitioDst.id === idDestino
        })


        const viajesConFiltro = viajes.filter((viaje) =>
            viaje.butacaDisponible >= 1 && viaje.fechaviaje === fecha && viaje.datosRuta.idOrigen === sitioOrigen.id && viaje.datosRuta.idDestino === sitioDest.id
        )

        console.log(viajesConFiltro)

        setViajesFiltrados(viajesConFiltro)
        try {
            //FALTA MOSTRAR MSJ DE SUCESS
            // getViajesFiltrados()
            setShowModalEdit(false)
        } catch (err) {
            console.log(err)
            setMsgError(err)
            setShowAlert(true)
        }
    }


    const filtarViajes = () => {
        setShowModalEdit(true)
    }

    const comprar = (id) => {
        //TE LLEVA A COMPRAR -- NO BORRAR
        console.log(id)
        historial.push('/comprarPasaje', { idViaje: id })
    }

    const buscarIdOrigen = (id) => {
        setIdOrigen(id)
    }
    const buscarIdDestino = (id) => {
        setIdDestino(id)
    }

    return (
        <div>
            <MenuUsuario />
            <MenuOpcUsuario optionName="filtrarViajes" />
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
                                <th>Acciones</th>
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
                                                <td>{item.fechaviaje}</td>
                                                <td>{item.datosRuta.horario}</td>
                                                <td>{item.datosCombi.tipocombi}</td>
                                                <td>{item.precio}</td>
                                                <td>{item.butacaDisponible}</td>
                                                <td style={{ width: "12%" }} >
                                                    <div className="d-flex justify-content-around">
                                                        <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { comprar(item.id) }}>
                                                            Comprar
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
                        viajesFiltrados.length === 0 ? <div className="alert alert-warning mt-19"> No se encontraron viajes para el filtro seleccionado </div> : <div></div>
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
                                        onClick={handleCloseAlert, (e) => { buscarIdOrigen(e.target.value) }}
                                        className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                        <option disabled="disabled" value="">Seleccione una Origen </option>
                                        {
                                            sitioSelect.map(item2 => (
                                                <option value={item2.id} key={item2.id}>{item2.provincia} - {item2.ciudad} </option>
                                            )
                                            )
                                        }
                                    </select>
                                    <select
                                        value={destino} onChange={(e) => { setDestino(e.target.value) }}
                                        onClick={handleCloseAlert, (e) => { buscarIdDestino(e.target.value) }}
                                        className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                        <option disabled="disabled" value="">Seleccione una Destino </option>
                                        {
                                            sitioSelect.map(item => (
                                                <option value={item.id} key={item.id}> {item.provincia} - {item.ciudad} </option>
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
                                        min={(fechaSospechoso > "2021-07-06") ? fechaSospechoso : "2021-07-06"}
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
                    ) : (<></>)
            }
        </div>


    );
}

export default UsuarioBuscarViajes;