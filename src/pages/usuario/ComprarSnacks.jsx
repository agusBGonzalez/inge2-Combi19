import React,{useState,useEffect} from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import {Table, Modal, Button, Alert} from 'react-bootstrap'
import { store } from '../../firebaseconf'
import { TrashFill, PencilFill} from 'react-bootstrap-icons';

const ComprarSnacks = () => {
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
    const [snackEliminar, setSnackEliminar] = useState('');
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
    const [snackEditar, setSnackEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    const handleCloseEdit = () => setShowModalEdit(false)


    const [snack, setSnack] = useState([])
    
    const [nombre, setNombre] = useState('')
    const [precio, setPrecio] = useState('')
    const [productoSelect,setProductoSelect] = useState([])
    const [producto,setProducto] = useState('')
    const [cantidad,setCantidad] = useState()
    const [idProducto,setIdProducto] = useState('')

    const getSnack =  () => {
        store.collection('comprasnack').get()
        .then(response => {
            const fetchedCombis = [];
            response.docs.forEach(document => {
            const fetchedCombi = {
                id: document.id,
                ...document.data()
            };
            fetchedCombis.push(fetchedCombi)
            });
            setSnack(fetchedCombis)
        })
    }    
 

    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        const datosproductos = async() =>{
            const {docs} = await store.collection('productos').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setProductoSelect(nuevoArray)
        }
        store.collection('comprasnack').get()
        .then(response => {
            const fetchedCombis = [];
            response.docs.forEach(document => {
            const fetchedCombi = {
                id: document.id,
                ...document.data()
            };
            fetchedCombis.push(fetchedCombi)
            });
            setSnack(fetchedCombis)
        })
        .catch(error => {
            setMsgError(error)
            setShowAlert(true)
        });
        datosproductos()
    }, []);    



    const borrarSnack = async (id) => {
        setSnackEliminar(id)
        setShowModal(true);
    }    

    const confirmarEliminacion = async () => {
        await store.collection('comprasnack').doc(snackEliminar).delete()
        getSnack()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }
    

    const crearModificarSnack = (oper, item) =>{
      
        if (oper === 'E') {
            setEsEditar(true)
            setSnackEditar(item.id)
            setNombre(item.nombre)
            setPrecio(item.precio)
            setCantidad(item.cantidad)
            setProducto(item.snack)
        } else {
            setEsEditar(false)
            setSnackEditar('')
            setNombre('')
            setPrecio('')
            setCantidad()
            setProducto('')

        }
        setShowModalEdit(true)
    }

    const cancelarSnacks = async () => {
        await store.collection('comprasnack').doc(snackEliminar).delete()
        getSnack()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }

    const confirmarEdicion = async (e) => {
        e.preventDefault()
        let nombreProducto,precioProducto,snackSelect
        productoSelect.map(item =>{
            if(item.id === idProducto){
                nombreProducto= item.nombre
                precioProducto = item.precio
                snackSelect = item.nombre + ' $'+ item.precio
            }
            
        })


        const regSnack= {
            nombre:nombreProducto,
            snack:snackSelect,
            precioTotal:precioProducto * cantidad,
            cantidad:cantidad
        }
        if (esEditar){
            try{
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('comprasnack').doc(snackEditar).set(regSnack)
                getSnack()
                setMsgSucc('Registro Exitoso! Click aqui para cerrar')
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
                await store.collection('comprasnack').add(regSnack)
                getSnack()
                setMsgSucc('Actualizacion Exitosa! Click aqui para cerrar')
                setShowAlertSucc(true)
                setShowModalEdit(false)
            } catch (err) {
                console.log(err)
                setMsgError(err)
                setShowAlert(true)
            }
            


        }

    }
    const buscarIdProducto = (id) =>{
        setIdProducto(id)
    }
  
    return (
      <div>
        <MenuUsuario/>
        <MenuOpcAdmin/>
        <div>
            <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Compra de Snacks</h3>
            <Button style={{top: 105, position: 'absolute', right:70, width: "160px", height: "40px"}} onClick={(e) => { crearModificarSnack('A', '') }} variant="secondary " > + Agregar Snacks</Button>
            <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
				{msgSucc}
			</Alert>
            <div style={subPageStyle}>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Snack</th>
                            <th>Cantidad</th>
                            <th>Precio Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            snack.length !== 0 ?
                                (
                                    snack.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.snack} </td> 
                                            <td>{item.cantidad}</td> 
                                            <td>{item.precioTotal}</td> 
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
                <button className='btn btn-danger'>Cancelar</button> 
                <button className='btn btn-primary' style = {{marginLeft:'10px'}}>Siguiente</button> 
            </div>
            
        </div>
        <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
			<Modal.Header >
				<Modal.Title>Eliminación de Combi</Modal.Title>
			</Modal.Header>
			<Modal.Body>¿Está seguro que desea eliminar el Snack seleccionado?
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
                        <Modal.Title>{esEditar ? "Editar Combi" : "Agregar Combi" }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-group'>
                            <select
                                value={producto} onChange={(e) => { setProducto(e.target.value) }}
                                onClick = {handleCloseAlert ,(e) => { buscarIdProducto(e.target.value)}}
                                className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                <option disabled="disabled" value="">Seleccione un Snack </option>
                                {
                                productoSelect.map( item2=> (
                                    <option value ={item2.id} name ={item2.id}>{item2.nombre} ${item2.precio}</option>
                                )
                                )
                                 }
                            </select>
                            <input onChange={(e) => { setCantidad(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="number"
                                placeholder='Ingrese Cantidad'
                                id="cantidad"
                                value={cantidad}
                            />
                            
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

export default ComprarSnacks
