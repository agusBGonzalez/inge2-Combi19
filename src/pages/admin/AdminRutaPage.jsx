import React,{useState, useEffect} from 'react'
import MenuUsuarioAdmin from '../../components/menus/MenuUsuarioAdmin'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import {Table, Modal, Button, Alert, Form} from 'react-bootstrap'
import { store } from '../../firebaseconf'
import { TrashFill, PencilFill} from 'react-bootstrap-icons';


function AdminRutaPage() {

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
    const [rutaEliminar, setRutaEliminar] = useState('');

    const handleClose = () => setShowModal(false);

    //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

    const [msgError, setMsgError] = useState (null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState (null)


    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [rutaEditar, setRutaEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    
    

    const handleCloseEdit = () => setShowModalEdit(false)

    const [rutas, setRutas] = useState([])
    
    const [sitiosCargados, setSitiosCargados] = useState([])


    const [idOrigen, setIdOrigen] = useState('')
    const [idDestino, setIdDestino] = useState('')
    const [horario, setHorario] = useState('')
    const [km, setKm] = useState('')
    


    const getRutas =  () => {
        store.collection('rutasZaca').get()
        .then(response => {
            const fetchedRutas = [];
            response.docs.forEach(document => {
            const fetchedRuta = {
                id: document.id,
                ...document.data()
            };
            fetchedRutas.push(fetchedRuta)
            });
            setRutas(fetchedRutas)
        })
    }
    
    const getSitiosCargados =  () => {
        store.collection('sitios').get()
        .then(response => {
            const fetchedSitios = [];
            response.docs.forEach(document => {
            const fetchedSitio = {
                id: document.id,
                ...document.data()
            };
            fetchedSitios.push(fetchedSitio)
            });
            setSitiosCargados(fetchedSitios)
        })
    } 
     

    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        getSitiosCargados()
        store.collection('rutasZaca').get()
        .then(response => {
            const fetchedRutas = [];
            response.docs.forEach(document => {
            const fetchedRuta = {
                id: document.id,
                ...document.data()
            };
            fetchedRutas.push(fetchedRuta)
            });
            setRutas(fetchedRutas)
        })
        .catch(error => {
            setMsgError(error)
            setShowAlert(true)
        });
    }, []);    

    const borrarRuta = async (id) => {
        setRutaEliminar(id)
        setShowModal(true);
    }    

    const confirmarEliminacion = async () => {
        const { docs } = await store.collection('rutasZaca').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setRutas(nuevoArray)
        await store.collection('rutasZaca').doc(rutaEliminar).delete()
        getRutas()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }
    

    const crearModificarRuta = (oper, item) =>{

        if (oper === 'E') {
            setEsEditar(true)
            setIdOrigen(item.idOrigen)
            setIdDestino(item.idDestino)
            setHorario(item.horario)
            setKm(item.km)
            setRutaEditar(item.id)

        } else {
            setEsEditar(false)
            setIdOrigen('')
            setIdDestino('')
            setHorario('')
            setKm('')
            setRutaEditar('')
        }
        setShowModalEdit(true)
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault()

        if (!idOrigen.trim()) {
            setMsgError('El campo Origen esta vacio' )
            setShowAlert(true)
            return
        }
        if (!idDestino.trim()) {
          setMsgError('El campo Destino esta vacio' )
          setShowAlert(true)
          return
        }
        if (!horario.trim()) {
              setMsgError('El campo Horario esta vacio' )
              setShowAlert(true)
              return
        }
        if (!km.trim()) {
          setMsgError('El campo Kilómetros esta vacio' )
          setShowAlert(true)
          return
        }


        if (idDestino === idOrigen) {
            setMsgError('Los campos Origen y Destino no pueden tener el mismo Sitio asociado' )
            setShowAlert(true)
            return
          }

        const esRutaRepetida =  rutas.find((ruta) => {
            return ((ruta.idOrigen === idOrigen) && (ruta.idDestino === idDestino) && (ruta.horario === horario))
        })
        

        if (esRutaRepetida) {
            setMsgError('Esta Ruta ya se encuentra cargada')
            setShowAlert(true)
            return
        }

        // Me traigo los datos del origen
        const origen = sitiosCargados.find((element) => {
            return element.id === idOrigen;
        })
        // Me traigo los datos del destino
        const destino = sitiosCargados.find((element) => {
            return element.id === idDestino;
        })
        
        const infoViaje = "Origen: " + origen.provincia + " - " + origen.ciudad  + " Destino: " + destino.provincia + " - " + destino.ciudad  + " Hora: " + horario + " hs - " + km + " Km" 

        const rutaAct = {
          idOrigen: idOrigen,
          provOrigen: origen.provincia,
          ciudadOrigen: origen.ciudad,
          origen: origen.provincia + " - " + origen.ciudad,
          idDestino: idDestino,
          provDest: destino.provincia,
          ciudadDest: destino.ciudad,
          destino: destino.provincia + " - " + destino.ciudad,
          horario: horario,
          km: km,
          infoViaje: infoViaje
        }
        
        if (esEditar){
            try{
                //
                await store.collection('rutasZaca').doc(rutaEditar).set(rutaAct)
                getRutas()
                setMsgSucc('Actualizacion Exitosa! Click aqui para cerrar')
                setShowAlertSucc(true)
                setShowModalEdit(false)
            } catch (err) {
                console.log(err)
                setMsgError(err)
                setShowAlert(true)
            }

        } else {
            try{
                //
                await store.collection('rutasZaca').add(rutaAct)
                getRutas()
                setMsgSucc('Registro Exitoso! Click aqui para cerrar')
                setShowAlertSucc(true)
                setShowModalEdit(false)
            } catch (err) {
                console.log(err)
                setMsgError(err)
                setShowAlert(true)
            }
            
        }

    }

  
    return (
      <div>
        <MenuUsuarioAdmin/>
        <MenuOpcAdmin optionName="listaRutas"/>
        <div>
            <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Listado de Rutas</h3>
            <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} onClick={(e) => { crearModificarRuta('A', '') }} variant="secondary " > + Agregar Ruta</Button>
            <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
                {msgSucc}
            </Alert>
            <div style={subPageStyle}>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                          <th>Origen</th>
                          <th>Destino</th>
                          <th>Horario</th>
                          <th>Km</th>
                          <th>Acciones</th>           
                        </tr>
                    </thead>
                    <tbody className ="animate__animated animate__slideInUp">
                        {
                            rutas.length !== 0 ?
                                (
                                  rutas.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.origen}</td>
                                            <td>{item.destino}</td>
                                            <td>{item.horario}</td>
                                            <td>{item.km}</td>
                                            <td style={{width: "12%"}} >
                                                <div className="d-flex justify-content-around">
                                                  <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarRuta('E', item) }}>
                                                    <PencilFill color="white"></PencilFill>
                                                  </button>
                                                  <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => {borrarRuta(item.id) }}>
                                                      <TrashFill color="white"></TrashFill>
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
                    rutas.length === 0 ? <div className="alert alert-warning mt-19"> No se encontraron Rutas registradas, agregue nuevas para visualizar en la lista </div> : <div></div>
                }
            </div>
        </div>
        <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>Eliminación de Ruta</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Está seguro que desea eliminar la ruta seleccionada?</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={confirmarEliminacion}>
                    Confirmar
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
          </Modal>
        {
            showModalEdit ?
            (
                <Modal id="modalEditar" show={showModalEdit} onHide={handleCloseEdit}>
                    <Modal.Header >
                        <Modal.Title>{esEditar ? "Editar Ruta" : "Agregar Ruta" }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form inline>
                            <Form.Label htmlFor="inlineFormCustomSelect">
                                Origen:
                            </Form.Label>
                            <Form.Control
                                as="select"
                                style = {{width:"80%", marginLeft:"15px"}}
                                id="origenInput"
                                onChange={(e) => { setIdOrigen(e.target.value) }}
                                onClick = {handleCloseAlert}
                                value = {idOrigen}
                                custom
                            >
                            {<option key= "0" value="">Seleccione un sitio de Origen..</option>}
                            {sitiosCargados.map((e, key) => {
                                return <option key={e.id} value={e.id}>{e.provincia} - {e.ciudad}</option>;
                            })}
                            </Form.Control>
                            <br/>
                            <Form.Label htmlFor="inlineFormCustomSelect">
                                Destino:
                            </Form.Label>
                            <Form.Control
                                as="select"
                                style = {{width:"80%", marginLeft:"10px"}}
                                id="destinoInput"
                                onChange={(e) => {  setIdDestino(e.target.value) }}
                                onClick = {handleCloseAlert}
                                value = {idDestino}
                                custom
                            >
                            {<option key= "0" value="">Seleccione un sitio de Destino..</option>}
                            {sitiosCargados.map((e, key) => {
                                return <option key={e.id} value={e.id}>{e.provincia} - {e.ciudad}</option>;
                            })}
                            </Form.Control>
                            <br/>
                            <Form.Label htmlFor="inlineFormCustomSelect">
                                Horario:
                            </Form.Label>
                            <input  onChange={(e) => { setHorario(e.target.value); console.log(e.target.value) }}
                                    onClick = {handleCloseAlert}
                                    type="time" 
                                    id="appt" 
                                    name="appt"
                                    value={horario}
                                    style = {{ marginLeft:"10px"}} 
                                    required/>
                            <br/>
                            <Form.Label htmlFor="inlineFormCustomSelect">
                                KM:
                            </Form.Label>
                            <input onChange={(e) => { setKm(e.target.value); console.log(e.target.value)  }}
                                  onClick = {handleCloseAlert}
                                  type="text"
                                  maxLength = '5'
                                  onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }}
                                  id="totKm"
                                  value={km}
                                  style = {{marginLeft:"40px", width:"50%"}} 
                              />

                        </Form>
                
                        <Alert className="mt-4" variant="danger" show={showAlert}>
                            {msgError}
                        </Alert>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={confirmarEdicion}>
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
  
  export default AdminRutaPage;