import React, { useState, useEffect } from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import { Table, Modal, Button, Alert, Accordion, Card, Form, Spinner} from 'react-bootstrap'
import { TrashFill, PencilFill} from 'react-bootstrap-icons';
import { store } from '../../firebaseconf'
import { useHistory} from 'react-router-dom'



function UsuarioComprarPasaje() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "75%",
        overflowY: 'scroll'

    };


    //--------------------------------------------------HISTORIAL---------------------------BEGIN----------------------------------------
    //NO BORRAR --> NECESARIO PARA VOLVER ATRAS EN LAS PANTALLAS
    const historial = useHistory()

    const volverAtras = () => {
        //TE LLEVA A COMPRAR -- NO BORRAR
        historial.push('/filtrarViajes')
    }
    //-------------------------------------------------HISTORIA------------------------------END----------------------------------------


    //-----------------------------------------------------MODALES--------------------------BEGIN---------------------------------------
    
    //----- MODAL REGISTRAR / MODIFICAR SNACK
    const [showModalEditSnack, setShowModalEditSnack] = useState(false)
    const handleCloseEdit = () => setShowModalEditSnack(false)
    const [esEditarSnack, setEsEditarSnack] = useState(false)
    const [esCargaSnack, setEsCargaSnack] = useState(false)







    //MODAL ELIMINAR
    const [showModal, setShowModal] = useState(false);
    const [snackEliminar, setSnackEliminar] = useState('')
    const handleClose = () => setShowModal(false);
    

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

    

    //-------------------------------------------------------MODALES--------------------------END---------------------------------------


    //-----------------------------------------------DATOS COMPONENTE--------------------------BEGIN------------------------------------
    //-----INFO DEL VIAJE 
    const [viajes, setViajes] = useState([])
    const [viajeCompra, setViajeCompra] = useState()

    //-----INFO DEL PASAJE
    


    //-----INFO DE SNACKS
    const [snacks, setSnacks] = useState([])
    const [snacksPasaje, setSnackPasaje] = useState([])
    const [idSnack, setIdSnack] = useState ('')
    const [cantSnack, setCantSnack] = useState ('')

    


    




    //-----INFO DE TARJETA DE CREDITO
    const [numTarjeta, setNumTarjeta] = useState ('')
    const [codTarjeta, setCodTarjeta] = useState ('')
    const [fechaTarjeta, setFechaTarjeta] = useState ('')
    const [showGoldInfo, setShowGoldInfo] = useState(false)


    //-----------------------------------------------DATOS COMPONENTE--------------------------END------------------------------------------
    
    //----------------------------------------------------FUNCIONES--------------------------BEGIN------------------------------------------
    const getSnacks =  () => {
        store.collection('productos').get()
        .then(response => {
            const fetchedSnacks = [];
            response.docs.forEach(document => {
            const fetchedSnack = {
                id: document.id,
                ...document.data()
            };
            fetchedSnacks.push(fetchedSnack)
            });
            setSnacks(fetchedSnacks)
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
                setViajes(fetchedViajes)
            })
    }


    useEffect(() => {
        const datosSitios = async () => {
            const v = await store.collection('viaje').get()
            const viajesArray = v.docs.map(item => ({ id: item.id, ...item.data() }))
            setViajes(viajesArray)
            
            getViajes()
            getSnacks()
        }

        datosSitios()
    }, []);
    
    const crearModificarSnack = (oper, item) =>{
        if (oper === 'E') {
            setEsEditarSnack(true)
            setIdSnack(item.id)
            //setSnackEditar(item.id)
            setCantSnack(item.precio)
        } else {
            setEsEditarSnack(false)
            //setSnackEditar('')
            setIdSnack('')
            setCantSnack('')
        
        }
        setShowModalEditSnack(true)
    }
    
    const borrarSnack = async (id) => {
        setSnackEliminar(id)
        setShowModal(true);
    }
    
    const confirmarEdicion = async (e) => {
        e.preventDefault()

        if (!idSnack.trim()) {
            setMsgError('El campo snack está vacio' )
            setShowAlert(true)
            return
        }

        if (cantSnack === undefined || !cantSnack.trim()) {
            setMsgError('El campo Cantidad está vacio' )
            setShowAlert(true)
            return
        }

        const snackABM = snacks.find((itemSnack) => {
            return itemSnack.id === idSnack
        })
        
        setEsCargaSnack(true)


        //-----VERIFICO QUE NO AGREGUE EL MISMO SNACK MÁS DE UNA VEZ

        //PREGUNTO POR "UNDEFINED" PORQUE EL FIND SI NO ENCUENTRA NADA DEVUELVE ESO
        // SI EL SNACK NO ESTÁ AGREGADO === UNDEFINED
        const existeSnackEnLista = snacksPasaje.find((itemSnackComp) => {
            return itemSnackComp.idRuta === idSnack
        })

        if(existeSnackEnLista !== undefined){
            setMsgError('El snack que quiere agregar ya se encuentra en la lista, puede modificarlo desde la misma.' )
            setShowAlert(true)
            return
        }

        const precioTotal = snackABM.precio * cantSnack

        const snackComprado = {
          idSnack: idSnack,
          infoSnack: {nombre: snackABM.nombre, precio : snackABM.precio, cantidad : cantSnack},
          totalPrecio: precioTotal,
          idViaje: "ideDelviaje",
          idPasajero: "idPasajero"
        }

        console.log(snackComprado)
        
        if (esEditarSnack){
            console.log("esEDitarOK")
            // try{
            //     //
            //     await store.collection('rutasZaca').doc(rutaEditar).set(rutaAct)
            //     getRutas()
            //     setMsgSucc('Actualizacion Exitosa! Click aqui para cerrar')
            //     setShowAlertSucc(true)
            //     setShowModalEdit(false)
            // } catch (err) {
            //     console.log(err)
            //     setMsgError(err)
            //     setShowAlert(true)
            // }

        } else {
            console.log("esEDitarELSE")
            // try{
            //     //
            //     await store.collection('rutasZaca').add(rutaAct)
            //     getRutas()
            //     setMsgSucc('Registro Exitoso! Click aqui para cerrar')
            //     setShowAlertSucc(true)
            //     setShowModalEdit(false)
            // } catch (err) {
            //     console.log(err)
            //     setMsgError(err)
            //     setShowAlert(true)
            // }
            
        }

        setEsCargaSnack(false)

    }

    //----------------------------------------------------FUNCIONES--------------------------END------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------
    // PARTE VISUAL DEL COMPONENTE
    return (
        <div>
            <MenuUsuario />
            <MenuOpcUsuario optionName="filtrarViajes" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 380, width: "60%" }}> Compra de Pasajes</h3>
                <Button style={{ top: 105, position: 'absolute', left: 80, width: "80px", height: "35px", fontSize: 14, justifyContent: 'center' }} onClick={(e) => { volverAtras() }} variant="secondary " > Volver</Button>
                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>
                <Alert id="danger" className="" variant="danger" show={showAlertDanger} onClick={handleCloseAlertDanger} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgDanger}
                </Alert>
                <div style={subPageStyle}>
                    <Accordion defaultActiveKey="0">
                        <Card className="card-accordion">
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                            Datos de pasajes
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body style={{ backgroundColor: "#FFFFFF"}}>Hello! I'm the body</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1">
                            Compra de Snacks
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                
                                <Card.Body style={{ backgroundColor: "#FFFFFF"}}>
                                    <div style={{ right: "80px", position: 'absolute'}}>
                                        <Button  onClick={(e) => { crearModificarSnack('A', '') }} variant="secondary " > + Agregar Snacks</Button> 
                                    </div>
                                    <br/>
                                    <br/>
                                    <div >
                                        <Table striped bordered  variant="secondary">
                                            <thead>
                                                <tr>
                                                <th>Snack</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Acciones</th>        
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {
                                                    snacksPasaje.length !== 0 ?
                                                        (
                                                            snacksPasaje.map(item => (
                                                                <tr key={item.id}>
                                                                    <td>{item.nombre}</td>
                                                                    <td>{item.cantidad}</td>
                                                                    <td>{item.precio}</td>
                                                                    <td style={{width: "12%"}} >
                                                                        <div className="d-flex justify-content-around">
                                                                            <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarSnack('E', item) }}>
                                                                                <PencilFill color="white"></PencilFill>
                                                                            </button>
                                                                            <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => {borrarSnack(item.id) }}>
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
                                            snacksPasaje.length === 0 ? <div className="alert alert-warning mt-19"> No se agregó ningún snack para este pasaje </div> : <div></div>
                                        }
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="2">
                            Pago con Tarjeta de Crédito
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="2">
                            <Card.Body style={{ backgroundColor: "#FFFFFF"}}>
                                <form style={{ left: "40px", width:"100%"}}>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Número de Tarjeta:* </label>
                                        <div className="col-sm-10">
                                            <input
                                                value={numTarjeta}
                                                onChange = {(e)=> {setNumTarjeta(e.target.value)}}
                                                onClick = {handleCloseAlert}
                                                className = "form-control"
                                                maxLength = '16'
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                        }
                                                    }}
                                                placeholder = "Ingrese su número de tarjeta"
                                                type = "text"
                                                style = {{width:"40%"}}
                                            />
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Código:* </label>
                                        <div className="col-sm-10">
                                            <input
                                                value={codTarjeta}
                                                onChange = {(e)=> {setCodTarjeta(e.target.value)}}
                                                onClick = {handleCloseAlert}
                                                className = "form-control"
                                                placeholder = "Ingrese código"
                                                maxLength = '4'
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                        }
                                                    }}
                                                type = "text"
                                                style = {{width:"20%"}}/>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Fecha de Vencimiento:* </label>
                                        <div className="col-sm-10">
                                            <input  value={fechaTarjeta}
                                                    type="month" 
                                                    id="start" 
                                                    name="start"
                                                    min="2018-03" 
                                                    style = {{width:"40%"}}
                                                    onChange = {(e)=> {setFechaTarjeta(e.target.value)}}
                                                    onClick = {handleCloseAlert}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
            {
                showModalEditSnack ?
                (
                    <Modal id="modalEditar" show={showModalEditSnack} onHide={handleCloseEdit}>
                        <Modal.Header >
                            <Modal.Title>{esEditarSnack ? "Editar Snack Seleccionado" : "Agregar Snack a Pasaje" }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form inline>
                                <Form.Label htmlFor="inlineFormCustomSelect">
                                    Snack:
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    style = {{width:"80%", marginLeft:"15px"}}
                                    id="nombreSnack"
                                    onChange={(e) => { setIdSnack(e.target.value)}}
                                    onClick = {handleCloseAlert}
                                    value = {idSnack}
                                    custom
                                >
                                    {<option key= "0" value="">Seleccione un snack para su viaje..</option>}
                                    {snacks.map((e, key) => {
                                        return <option key={e.id} value={e.id}>{e.nombre}</option>;
                                    })}
                                </Form.Control>
                                <br/>
                                <Form.Label htmlFor="inlineFormCustomSelect">
                                    Precio:
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    style = {{width:"80%", marginLeft:"10px"}}
                                    id="precioSnack"
                                    onClick = {handleCloseAlert}
                                    value = {idSnack}
                                    disabled
                                    custom
                                >
                                    {<option key= "0" value="">..</option>}
                                    {snacks.map((e, key) => {
                                        return <option key={e.id} value={e.id}>{e.precio}</option>;
                                    })}
                                </Form.Control>
                                <br/>
                                <Form.Label htmlFor="inlineFormCustomSelect">
                                    Cantidad:
                                </Form.Label>
                                <input onChange={(e) => {setCantSnack(e.target.value)}}
                                    onClick = {handleCloseAlert}
                                    type="text"
                                    maxLength = '2'
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    id="totCantSnack"
                                    value={cantSnack}
                                    style = {{width:"50%"}} 
                                />
                                
                            </Form>
                    
                            <Alert className="mt-4" variant="danger" show={showAlert}>
                                {msgError}
                            </Alert>
                        </Modal.Body>
                        
                        <Modal.Footer>
                            { esCargaSnack ? 
                                (
                                    <Button variant="primary" disabled>
                                        <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />
                                        Procesando..
                                    </Button>
                                ) : 
                                (
                                    <Button variant="primary" onClick={confirmarEdicion}>
                                        Confirmar
                                    </Button>
                                )

                            }
                            <Button variant="secondary" onClick={() => { setShowModalEditSnack(false); setMsgError(null); setShowAlert(false); }}>
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

export default UsuarioComprarPasaje;