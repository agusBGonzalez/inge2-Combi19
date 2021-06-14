import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store } from '../../firebaseconf'
import { FileEarmarkSlidesFill } from 'react-bootstrap-icons'



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

    const getViajesFiltrados = () => {
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
                setCombi(fetchedCombis)
            })
    }

    const getRutas = () => {
        store.collection('rutasZaca').get()
            .then(response => {
                const fetchedCombis = [];
                response.docs.forEach(document => {
                    const fetchedCombi = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedCombis.push(fetchedCombi)
                });
                setRuta(fetchedCombis)
            })
    }
    useEffect(() => {
        const datosSitios = async () => {
            const { docs } = await store.collection('sitios').get()
            const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setSitioSelect(nuevoArray)
            const v = await store.collection('viaje').get()
            const viajesArray = v.docs.map(item => ({ id: item.id, ...item.data() }))
            setViajes(viajesArray)
            const r = await store.collection('viaje').get()
            const rutaArray = r.docs.map(item => ({ id: item.id, ...item.data() }))
            setRuta(rutaArray)
            getCombis()
            getRutas()
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

        async function deleteCollection(db, collectionPath, batchSize) {
            const collectionRef = db.collection(collectionPath);
            const query = collectionRef.orderBy('__name__').limit(batchSize);

            return new Promise((resolve, reject) => {
                deleteQueryBatch(db, query, resolve).catch(reject);
            });
        }

        async function deleteQueryBatch(db, query, resolve) {
            const snapshot = await query.get();

            const batchSize = snapshot.size;
            if (batchSize === 0) {
                // When there are no documents left, we are done
                resolve();
                return;
            }

            // Delete documents in a batch
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                deleteQueryBatch(db, query, resolve);
            });

        }

  
    const buscarIdRuta =  (idruta) => {
        console.log("id ruta" , idruta)
        ruta.map(r=>{
            console.log("map")
            if(r.id === idruta ){
                console.log(r)
            }
        })
    }
    
    const confirmarBusqueda = async () => {
        deleteCollection(store, 'buscarViajes', 10);
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
        } else {
            fecha2 = new Date(fecha)
            aux = new Date(fecha2.setDate(fecha2.getDate() + dia))
            if (hoy > aux.toLocaleDateString()) {
                setMsgError('La fecha no puede ser posterior a la fecha actual')
                setShowAlert(true)
                return
            }

        }
        if (origen === destino) {
            setMsgError('Origen y destino deben ser diferentes')
            setShowAlert(true)
            return
        }
        getViajes()

        // aca lo que hago es guardar cual sera el origen y destino
 
        let combiViaje

        const sitioOrigen = sitioSelect.find((sitioOr) => {
            return sitioOr.id === idOrigen
        })

        const sitioDest = sitioSelect.find((sitioDst) => {
            return sitioDst.id === idDestino
        })

        let gRutas = []
        ruta.map(r=>{
            if((r.idOrigen === sitioOrigen.id ) && (r.idDestino === sitioDest.id)){
                gRutas.push(r)
            }
        }) 

        console.log(gRutas)


        viajes.map( v => {
            console.log(" map")
            gRutas.forEach(element =>{
                console.log(" foreach")
                console.log(v.idRuta)
                console.log(element.id)
                if(v.idRuta === element.id){
                    console.log("antes fecha")
                    if (v.fechaviaje === fecha) {
                        console.log("entro en === fecha")
                        combi.map(c => {
                            
                            if (c.id === v.idCombi) {
                                combiViaje = c
                            }
                        })
                        const agregarViaje = {
                            origen: sitioOrigen.provincia + " - "+sitioOrigen.ciudad,
                            destino: sitioDest.provincia+ " - "+sitioDest.ciudad,
                            fecha: fecha,
                            horario: element.horario,
                            tipoCombi: combiViaje.tipocombi,
                            precio: v.precio,
                            butacas: v.butacaDisponible
                        }
                        console.log(agregarViaje)
                        store.collection('buscarViajes').add(agregarViaje)
                    }
                } 
            });

        })
        try {
            //FALTA MOSTRAR MSJ DE SUCESS
            getViajesFiltrados()
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
    const comprar = () => {
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
                                                <td>{item.horario}</td>
                                                <td>{item.tipoCombi}</td>
                                                <td>{item.precio}</td>
                                                <td>{item.butacas}</td>
                                                <td style={{ width: "12%" }} >
                                                    <div className="d-flex justify-content-around">
                                                        <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { comprar() }}>
                                                            <FileEarmarkSlidesFill color="white"></FileEarmarkSlidesFill>
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
                                        onClick={handleCloseAlert, (e) => { buscarIdOrigen(e.target.value) }}
                                        className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                        <option disabled="disabled" value="">Seleccione una Origen </option>
                                        {
                                            sitioSelect.map(item2 => (
                                                <option value={item2.id} key={item2.id}> provincia:{item2.provincia} ciudad:{item2.ciudad} </option>
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
                                                <option value={item.id} key={item.id}> provincia:{item.provincia} ciudad:{item.ciudad} </option>
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
                    ) : (<></>)
            }
        </div>


    );
}

export default UsuarioBuscarViajes;