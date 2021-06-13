import React, {useState,useEffect} from 'react'
import { store } from '../../firebaseconf'
import { Modal, Button, Alert} from 'react-bootstrap'
import { TrashFill, PencilFill} from 'react-bootstrap-icons'



const Opiniones = () => {

    const subPageStyle = {
        top: 170,
        left:180,
        position: 'absolute',
        height: "73%",
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
        <div>
            <div style={{marginBottom:'20px'}} >
                <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}>Comentarios</h3>
                <Button style={{top: 105,  position: 'absolute', right:70, width: "250px", height: "40px"}} onClick={(e) => { crearModificarComentario('A', '') }} variant="danger" > Agregar Comentario</Button>  
            </div>
            <div style={subPageStyle}>
                  <div className="container " >
                    <div className ="row">
                        {
                            comentarios.map(item =>(
                                <div className ="col-md-4" key={item.id}>
                                    <div className="card  animate__animated animate__fadeInUp" style={{ width: '18rem' }}>
                                        <div className="card-body rounded">
                                            <h4 className ="card-title text-center ">TITULO</h4>
                                            <p className="card-text text-dark text-center">{item.texto}</p>
                                            <a href="#!" style={{float:'right',marginRight:30 ,marginBottom:-15}} className="btn btn-outline-dark" onClick={(e) => { crearModificarComentario('E', item) }}>
                                            <PencilFill color="dark"></PencilFill>
                                            </a>
                                            <a href="#!" style={{marginLeft:30,marginBottom:-15}} className="btn btn-outline-dark float" onClick={(id) => {borrarComentario(item.id) }}>
                                            <TrashFill color="dark"></TrashFill>
                                            </a>
                                            
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    comentarios.length === 0 ? <div className="alert alert-warning mt-19"> No se encontraron Comentarios</div> : <div></div>
                }
            </div>
            <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, left: 75,width: "60%"}} >
                {msgSucc}
            </Alert>
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
