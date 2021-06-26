import React,{useState, useEffect} from 'react'
  import MenuUsuarioAdmin from '../../components/menus/MenuUsuarioAdmin'
  import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
  import {Table, Modal, Button, Alert} from 'react-bootstrap'
  import { store } from '../../firebaseconf'
  import { TrashFill, PencilFill} from 'react-bootstrap-icons';
  import Accordion from 'react-bootstrap/Accordion'
  import { Card } from 'react-bootstrap'

const ListaPasajeros = () => {
    const subPageStyle = {
        top: 200,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'
        
    };

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
    
    
    useEffect(() => {
        const prueba = ()=>{
            let p = 'Agnelli'
            setPersona(p,...persona) 
            p = 'Perez'
            setPersona(p ,...persona) 
            p ='LAL '
            setPersona(p,...persona) 
            p ='LALE'
            setPersona(p,...persona)
            p = 'LILO'
            setPersona(p,...persona)
        }
        prueba()
    }, []);

    return (
      <div>
        <MenuUsuarioAdmin/>
        <MenuOpcAdmin />
        
        <div>
            
            <h3 style={{top: 150, position: 'absolute', left: 80,width: "60%",}}> Listado de Pasajeros</h3>
            <Button variant ="secondary" style={{top: 105, position: 'absolute', left: 80,width:"100px" , height: "40px"}}>Atras</Button>
            <Button variant ="primary" style={{top: 105, position: 'absolute', left: 400,width:"150px" , height: "40px"}}>Vender Pasaje</Button> 
            <Button variant ="success" style={{top: 105, position: 'absolute', right:650,width:"150px" , height: "40px"}}>Comenzar Viaje</Button> 
            <Button variant ="secondary" style={{top: 105, position: 'absolute', right:360,width:"150px" , height: "40px"}} disabled variant="danger ">Finalizar Viaje</Button>  
            <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} variant="danger " >Cancelar Viaje</Button>
            
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
                        {
                            persona.map(item =>(
                                <input type="text" name="pasajeros" placeholder= '´prueba'/>
                            ))
                        }
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
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
