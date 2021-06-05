import React, {useState,useEffect} from 'react'
import { store } from '../../firebaseconf'
import {Table, Modal, Button, Alert} from 'react-bootstrap'
import { TrashFill, PencilFill} from 'react-bootstrap-icons'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'

const Opiniones = () => {

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
    const [comentarioEliminar, setComentarioEliminar] = useState('');

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
    const [comentarioEditar, setComentarioEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    

    const handleCloseEdit = () => setShowModalEdit(false)

    const [comentarios, setComentarios] = useState([])
    
    const [opinion, setOpinion] = useState('')

    const getComentarios =  () => {
        store.collection('opiniones').get()
        .then(response => {
            const fetchedCombis = [];
            response.docs.forEach(document => {
            const fetchedCombi = {
                id: document.id,
                ...document.data()
            };
            fetchedCombis.push(fetchedCombi)
            });
            setComentarios(fetchedCombis)
        })
    }    
 

    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        store.collection('opiniones').get()
        .then(response => {
            const fetchedComentarios = [];
            response.docs.forEach(document => {
            const fetchedComentario = {
                id: document.id,
                ...document.data()
            };
            fetchedComentarios.push(fetchedComentario)
            });
            setComentarios(fetchedComentarios)
        })
        .catch(error => {
            setMsgError(error)
            setShowAlert(true)
        });
    },[]);    

    const borrarComentario = async (id) => {
        setComentarioEliminar(id)
        setShowModal(true);
    }    

    const confirmarEliminacion = async () => {

        await store.collection('opiniones').doc(comentarioEliminar).delete()
        getComentarios()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }
    

    const crearModificarComentario = (oper, item) =>{
        if (oper === 'E') {
            setEsEditar(true)
            setComentarioEditar(item.id)
            setOpinion(item.texto)

        } else {
            setEsEditar(false)
            setComentarioEditar('')
            setOpinion('')
        }
        setShowModalEdit(true)
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault()
        console.log(comentarios)
        if (!opinion.trim()) {
            setMsgError('El campo Comentario esta vacio' )
            setShowAlert(true)
            return
        }
        const regComentario= {
            texto:opinion
        }
        if (esEditar){
            try{
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('opiniones').doc(comentarioEditar).set(regComentario)
                getComentarios()
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
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('opiniones').add(regComentario)
                getComentarios()
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
        {/* <MenuUsuario/>
        <MenuOpcAdmin optionName="comentarios"/> */}
        <div>
            <h3 style={{top: -40, position: 'absolute', left: 30,width: "60%",}}>Comentarios</h3>
            <Button style={{top: -40, position: 'absolute', right:-50, width: "200px", height: "50px"}} onClick={(e) => { crearModificarComentario('A', '') }} variant="danger" > Agregar Comentario</Button>
            <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
                {msgSucc}
            </Alert>
            <div style={subPageStyle}>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                          <th>Comentario</th>  
                        </tr>
                    </thead>
                    <tbody>
                        {
                            comentarios.length !== 0 ?
                                (
                                  comentarios.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.texto}</td>
                                            <td style={{width: "12%"}} >
                                                <div className="d-flex justify-content-around">
                                                  <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarComentario('E', item) }}>
                                                    <PencilFill color="white"></PencilFill>
                                                  </button>
                                                  <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => {borrarComentario(item.id) }}>
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
                {/* {
                   comentarios.length !== 0 ?
                   (
                     comentarios.map(item => (
                           <span>{item.texto}</span>
                       ))
                   ) : (
                       <></>
                   ) 
                } */}
                {
                    comentarios.length === 0 ? <div className="alert alert-warning mt-19"> No se encontraron Comentarios</div> : <div></div>
                }
            </div>
        </div>
        <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>Eliminación de Comentario</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Está seguro que desea eliminar el Comentario seleccionado?
            <Alert className="mt-4" variant="danger" show={showAlert}>
					        {msgError}
			</Alert>
            </Modal.Body>
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
                        <Modal.Title>{esEditar ? "Editar Comentario" : "Agregar Comentario" }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-group'>
                        <textarea 
                        name="question"
                        type= 'text' 
                        data-testid="question-form-input" 
                        autocomplete="off" 
                        rows="5"
                        class="form-control" 
                        maxlength="1200" 
                        placeholder="Escribí tu Opinion" 
                        value= {opinion}
                        onChange = {(e) => setOpinion(e.target.value)}
                        onClick = {handleCloseAlert}
                        ></textarea>
                            
                            
                        </form>
                        <Alert className="mt-4" variant="danger" show={showAlert}>
                            {msgError}
                        </Alert>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={confirmarEdicion}>
                            Confirmar
                        </Button>
                        <Button variant="secondary" onClick={() => {setShowModalEdit(false); setMsgError(null); setShowAlert(false);}}>
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

export default Opiniones
