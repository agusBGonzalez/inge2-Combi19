import React,{useState, useEffect} from 'react'
  import MenuUsuarioChofer from '../../components/menus/MenuUsuarioChofer'
  import MenuOpcChofer from '../../components/menus/MenuOpcChofer'
  import {Table, Modal, Button, Alert} from 'react-bootstrap'
  import { store } from '../../firebaseconf'
  import { TrashFill, PencilFill, Check} from 'react-bootstrap-icons';
  import Accordion from 'react-bootstrap/Accordion'
  import { Card } from 'react-bootstrap'
  import { useHistory,useLocation} from 'react-router-dom'
  

const ListaPasajeros = () => {
    const subPageStyle = {
        top: 200,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'
        
    };
    //PARA VOLVER AL LISTADO DE VIAJES DE UN CHOFER
    const historial = useHistory()
    const historialCovid = useHistory()
    const location = useLocation()
    const datosViaje = location.state.idViaje
    const volverAtras = () => {
        historial.push('/choferListarViaje')
        console.log('que tiene info', pasajeVendido)
    }

    const registrarDatosCovid = (item) => {

        historialCovid.push('/registrarDatosCovid', { idPasajero: item })
    }
    //MODAL ELIMINAR
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => {setShowModal(false);setShowAlertDelete(false);setMsgErrorDelete(null)};

    //ALERT ERROR EDITAR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

    const [msgError, setMsgError] = useState (null)
    
    //ALERT ERROR ELIMINAR
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const handleCloseAlertDelete = () => setShowAlertDelete(false);
    const [msgErrorDelete, setMsgErrorDelete] = useState (null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState (null)

    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [choferEditar, setChoferEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    

    const handleCloseEdit = () => setShowModalEdit(false)
    const [persona,setPersona] = useState([])
    const [check,setCheck] = useState(false)
    const [ausente,setAusente] = useState([])
    const [pasajeVendido,setPasajeVendido] = useState([])
    const [infoViaje,setInfoViaje] = useState([{}])

    useEffect(() => {
        const datos = async() =>{
            const {docs} = await store.collection('pasajeViajeVendido').get()
            const pasajeArray = docs.map( item => ({id:item.id, ...item.data()}))
            // const info = pasajeArray.find((pasaje) => {
            //     return datosViaje.infoViaje.id === pasaje.idViaje
            // })
            let arregloPasaje = []
            pasajeArray.map(pasaje =>{
                if(datosViaje.infoViaje.id === pasaje.idViaje){
                    arregloPasaje.push(pasaje)
                }
            })
            setPasajeVendido(arregloPasaje)
            

        }
        
        datos()
        
    },[]);



    const estaTildado = (check,item) =>{
        setCheck(check)
        const repetidoAusente = ausente.find(elemento => elemento === item.id)
        console.log('por aca pasa')
        if(repetidoAusente === undefined && check){
            console.log('entre')
            ausente.push(item)
        }else{
            if(!check){
                ausente.pop()
            }
        } 
        console.log('Cantidad en el arreglo',ausente.length)
        
    }
    const mostrar = ()=>{
        console.log(pasajeVendido)
    }
    return (
      <div>
        <MenuUsuarioChofer/>
        <MenuOpcChofer />
        
        <div>
            
            <h3 style={{top: 150, position: 'absolute', left: 80,width: "60%",}}> Informacion del Viaje</h3>
            <Button variant ="secondary" style={{top: 105, position: 'absolute', left: 80,width:"100px" , height: "40px"}} onClick={(e)=>{volverAtras()}}>Atras</Button>
            <Button variant ="primary" style={{top: 105, position: 'absolute', left: 400,width:"150px" , height: "40px"}}>Vender Pasaje</Button> 
            <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} variant="danger " >Cancelar Viaje</Button>
            {   
                
                ausente.length === persona.length ?
                (
                    <div>
                        <Button variant ="secondary" style={{top: 105, position: 'absolute', right:360,width:"150px" , height: "40px"}}  variant="danger " onClick ={(e)=>{mostrar()}}>Finalizar Viaje</Button>   
                    </div>
                ):
                (<></>)
            }
            
            <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
                {msgSucc}
            </Alert>
            
            <div style={subPageStyle}>
            <Accordion  defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0" defaultActiveKey>
                    Detalle Viaje
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                    Lista de Pasajeros
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body>
                    <Table striped bordered hover variant="secondary" className ="animate__animated animate__slideInUp" >
                            <thead>
                                <tr>
                                <th>Apellido</th>
                                <th>Nombres</th>
                                <th>Email</th>
                                <th>Cant. Pasajes</th>
                                <th>Resultado</th>
                                <th>Covid-19</th>
                                <th>Ausente</th>         
                                </tr>
                            </thead>
                            <tbody >
                                
                                {
                                    pasajeVendido.length !== 0 ?
                                        (
                                        pasajeVendido.map(item => (
                                                
                                                <tr key={item.id}>
                                                    <td>{item.infoPasajero.apellido}</td>
                                                    <td>{item.infoPasajero.nombres}</td>
                                                    <td>{item.infoPasajero.email}</td>
                                                    <td>{item.cantidadButacas}</td>
                                                    <td>Pendiente</td>
                                                        <td style={{width:"15px"}}>
                                                            <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e)=> registrarDatosCovid(e.target.checked,item)}>
                                                                Sintomas
                                                            </button>
                                                        </td>
                                                    <td style={{width:"10px"}}>
                                                        <div  class="custom-control custom-checkbox">
                                                            <input  type="checkbox"   defaultChecked={check} onClick= {(e)=> estaTildado(e.target.checked,item)}/>
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
                        
            
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                    Lista de Snacks
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                    <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
                
            </div>
        </div>
        
      </div>

    );
}

export default ListaPasajeros
