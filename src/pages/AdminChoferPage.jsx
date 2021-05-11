import React, {useState}  from 'react'
import MenuUsuario from '../components/menus/MenuUsuario'
import MenuOpcAdmin from '../components/menus/MenuOpcAdmin'
import {Table, Modal, Button, Alert} from 'react-bootstrap'


function AdminChoferPage() {
    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'
        
    };


    const [msgError, setMsgError] = useState (null)

    //MODAL
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    
  
    return (
      <div>
        <MenuUsuario/>
        <MenuOpcAdmin/>
        <div>
            <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Listado de Choferes</h3>
            <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} variant="secondary " > + Agregar Chofer</Button>
            
            <div style={subPageStyle}>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th>DNI</th>
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        </tr>
                        
                    </tbody>
                </Table>
            </div>
        </div>
        <Modal show={showModal} onHide={handleClose}>
			<Modal.Header >
				<Modal.Title>Hay un problema</Modal.Title>
			</Modal.Header>
			<Modal.Body>{msgError}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
      	</Modal>
      </div>

    );
}
  
  export default AdminChoferPage;