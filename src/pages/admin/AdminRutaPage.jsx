import React,{useState, useEffect} from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import {Table, Modal, Button, Alert} from 'react-bootstrap'
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
    const [esRutaRepetida, setEsRutaRepetida] = useState(false)
    

    const handleCloseEdit = () => setShowModalEdit(false)

    const [rutas, setRutas] = useState([])
    

    const [nombres, setNombres] = useState('')
    const [apellido, setApellido] = useState('')
    const [dni, setDni] = useState('')
    const [email, setEmail] = useState('')
    const [telefono, setTelefono] = useState('')
    const [password, setPassword] = useState('')
    


    const getRutas =  () => {
        store.collection('rutas').get()
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
 

    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        store.collection('rutas').get()
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
        const { docs } = await store.collection('rutas').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setRutas(nuevoArray)
        await store.collection('rutas').doc(rutaEliminar).delete()
        getRutas()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }
    

    const crearModificarRuta = (oper, item) =>{

        if (oper === 'E') {
            setEsEditar(true)
            setRutaEditar(item.id)
            setNombres(item.nombres)
            setApellido(item.apellido)
            setDni(item.dni)
            setEmail(item.email)
            setTelefono(item.telefono)
            setPassword(item.password)

        } else {
            setEsEditar(false)
            setRutaEditar('')
            setNombres('')
            setApellido('')
            setDni('')
            setEmail('')
            setTelefono('')
            setPassword('')
        }
        setShowModalEdit(true)
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault()

        if (!nombres.trim()) {
            setMsgError('El campo Nombre esta vacio' )
            setShowAlert(true)
            return
        }
        if (!apellido.trim()) {
          setMsgError('El campo Apellido esta vacio' )
          setShowAlert(true)
          return
        }
        if (!dni.trim()) {
              setMsgError('El campo DNI esta vacio' )
              setShowAlert(true)
              return
        }
        if (!email.trim()) {
          setMsgError('El campo Email esta vacio' )
          setShowAlert(true)
          return
       }

       if (!password.trim() || (password.trim().length < 6)) {
          setMsgError('El campo Password debe tener al menos 6 caracteres' )
          setShowAlert(true)
          return
       }

        store.collection('rutas').where("email", "==", email)
            .get()
            .then((querySnapshot) => {
                let datosRepetidos = false
                querySnapshot.forEach((doc) => {
                    //COMO FILTRO POR PROVINCIA, QUEDA CHEQUEAR QUE NO HAYA UNA CIUDAD IGUAL
                    const dniBusq = doc.data().dni           
                    if (dniBusq === dni) {
                        datosRepetidos = true
                    }
                });  
                setEsRutaRepetida(datosRepetidos)                               
            })
        
        if (esRutaRepetida) {
            setMsgError('Esta Ruta ya se encuentra cargada')
            setShowAlert(true)
            return
        }
        

        const rutaAct = {
          nombres: nombres,
          apellido: apellido,
          dni: dni,
          email: email,
          telefono: telefono,
          password: password
        }
        
        if (esEditar){
            try{
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('rutas').doc(rutaEditar).set(rutaAct)
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
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('rutas').add(rutaAct)
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
        <MenuUsuario/>
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
                          <th>DNI</th>
                          <th>Apellido</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Telefono</th>
                          <th>Acciones</th>           
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rutas.length !== 0 ?
                                (
                                  rutas.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.dni}</td>
                                            <td>{item.apellido}</td>
                                            <td>{item.nombres}</td>
                                            <td>{item.email}</td>
                                            <td>{item.telefono}</td>
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
                        <form className='form-group'>
                            <input onChange={(e) => { setDni(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="text"
                                maxLength = '8'
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                placeholder='Ingrese DNI'
                                id="dni"
                                value={dni}
                            />
                            <input onChange={(e) => { setNombres(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="text"
                                placeholder='Ingrese Nombres'
                                id="nomb"
                                value={nombres}
                            />
                            <input onChange={(e) => { setApellido(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="text"
                                placeholder='Ingrese Apellido'
                                id="ape"
                                value={apellido}
                            />
                            <input onChange={(e) => { setEmail(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="email"
                                placeholder='Ingrese Email'
                                id="email"
                                value={email}
                            />
                            <input onChange={(e) => { setTelefono(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="text"
                                maxLength = '14'
                                onKeyPress={(event) => {
                                  if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }}
                                placeholder='Ingrese Telefono'
                                id="tele"
                                value={telefono}
                            />
                            <input onChange={(e) => { setPassword(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="password"
                                placeholder='Ingrese Password'
                                id="pass"
                                value={password}
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
  
  export default AdminRutaPage;