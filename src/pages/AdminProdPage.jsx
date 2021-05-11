import React, { useState, useEffect } from 'react'
import MenuUsuario from '../components/menus/MenuUsuario'
import MenuOpcAdmin from '../components/menus/MenuOpcAdmin'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store } from '../firebaseconf'


function AdminProdPage() {

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
    const [productoEliminar, setProductoEliminar] = useState('');
    const handleClose = () => setShowModal(false);

    //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

    const [msgError, setMsgError] = useState(null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState(null)


    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [productoEditar, setProductoEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    const [esProductoRepetido, setEsProductoRepetido] = useState(false)
    const handleCloseEdit = () => setShowModalEdit(false)


    const [productos, setProductos] = useState([])
    const [modal, setModal] = useState(false)

    const [nombre, setNombre] = useState('')
    const [tipo, setTipo] = useState('')
    const [precio, setPrecio] = useState('')



    const getProductos = () => {
        store.collection('productos').get()
            .then(response => {
                const fetchedProductos = [];
                response.docs.forEach(document => {
                    const fetchedProductos = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedProductos.push(fetchedProductos)
                });
                setProductos(fetchedProductos)
            })
    }


    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        store.collection('productos').get()
            .then(response => {
                const fetchedProductos = [];
                response.docs.forEach(document => {
                    const fetchedProductos = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedProductos.push(fetchedProductos)
                });
                setProductos(fetchedProductos)
            })
            .catch(error => {
                setMsgError(error)
                setShowAlert(true)
            });
    }, []);

    const borrarProducto = async (id) => {
        setProductoEliminar(id)
        setShowModal(true);
    }

    const confirmarEliminacion = async () => {
        const { docs } = await store.collection('productos').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setProductos(nuevoArray)
        await store.collection('productos').doc(productoEliminar).delete()
        getProductos()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }


    const crearModificarProd = (oper, item) => {

        if (oper === 'E') {
            setEsEditar(true)
            console.log("entra")
            setProductoEditar(item.id)
            setNombre(item.nombre)
            setTipo(item.tipo)
            setPrecio(item.precio)
        } else {
            setEsEditar(false)
            console.log("entra2222")
            setProductoEditar('') 
            setNombre('')
            setTipo('')
            setPrecio('')
        }
        setShowModalEdit(true)
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault()

        if (nombre === "") {
            setMsgError('El campo nombre esta vacio')
            setShowAlert(true)
            return
        }
        if (tipo === "") {
            setMsgError('El campo tipo esta vacio')
            setShowAlert(true)
            return
        }
        if (precio === "") {
            setMsgError('El precio tipo esta vacio')
            setShowAlert(true)
            return
        }
        store.collection('productos').where("nombre", "==", nombre)
            .get()
            .then((querySnapshot) => {
                let datosRepetidos = true
              /*  querySnapshot.forEach((doc) => {
                    //COMO FILTRO POR PROVINCIA, QUEDA CHEQUEAR QUE NO HAYA UNA CIUDAD IGUAL
                    const nomCuidad = doc.data().ciudad
                    console.log(nomCuidad)
                    console.log(ciudad)
                    if (nomCuidad === ciudad) {
                        datosRepetidos = true
                    }
                }); */
                setEsProdRepetido(datosRepetidos)
            })

        if (esProdRepetido) {
            setMsgError('Este Prod ya se encuentra cargado')
            setShowAlert(true)
            return
        }

        const prodAct = {
            nombre: nombre,
            tipo: tipo,
            precio: precio
        }

        if (esEditar) {
            try {
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('productos').doc(productoEditar).set(productoAct)
                getProductos()
                setMsgSucc('Registro Exitoso! Click aqui para cerrar')
                setShowAlertSucc(true)
                setShowModalEdit(false)
            } catch (err) {
                console.log(err)
                setMsgError(err)
                setShowAlert(true)
            }

        } else {
            try {
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('productos').add(prodAct)
                getProductos()
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


    return (
        <div>
            <MenuUsuario />
            <MenuOpcAdmin />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}> Listado de Productos</h3>
                <Button style={{ top: 105, position: 'absolute', right: 70, width: "150px", height: "40px" }} onClick={(e) => { crearModificarProducto('A', '') }} variant="secondary " > + Agregar Producto</Button>
                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>
                <div style={subPageStyle}>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                productos.length !== 0 ?
                                    (
                                        productos.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.nombre}</td>
                                                <td>{item.tipo}</td>
                                                <td style={{ width: "20%" }} >
                                                    <div className="d-flex justify-content-around">
                                                        <button className="btn btn-primary " onClick={(e) => { crearModificarSitio('E', item) }}>Modificar</button>
                                                        <button className="btn btn-danger md-3 float-right" onClick={(id) => { borrarProducto(item.id) }}>Borrar</button>
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
                        productos.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
                    }
                </div>
            </div>
            <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>Eliminación de Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Está seguro que desea eliminar el producto seleccionado?</Modal.Body>
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
                                <Modal.Title>{esEditar ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form className='form-group'>
                                    <input
                                        onChange={(e) => { setNombre(e.target.value) }}
                                        className='form-control mt-5'
                                        type="text"
                                        placeholder='nombre'
                                        value={nombre}
                                    />
                                    <select onChange={(e) => { setTipo(e.target.value) }} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                        <option selected id='tipo'>Seleccione Tipo</option>
                                        <option value="Dulce">Dulce</option>
                                        <option value="Salado">Salado</option>
                                        <option value="Agridulce">Agridulce</option>
                                    </select>
                                    <input
                                        onChange={(e) => { setPrecio(e.target.value) }}
                                        className='form-control mt-5'
                                        type="number"
                                        placeholder='precio'
                                        value={precio}
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

export default AdminProdPage;