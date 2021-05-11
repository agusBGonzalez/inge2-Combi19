  import React,{useState, useEffect} from 'react'
  import MenuUsuario from '../components/menus/MenuUsuario'
  import MenuOpcAdmin from '../components/menus/MenuOpcAdmin'
  import {Table, Modal, Button, Alert} from 'react-bootstrap'
  import { store } from '../firebaseconf'
  import { TrashFill, PencilFill} from 'react-bootstrap-icons';
  
  
  function AdminChoferPage() {
  
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
      const [choferEliminar, setChoferEliminar] = useState('');

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
      const [choferEditar, setChoferEditar] = useState('')
      const [esEditar, setEsEditar] = useState(false)
      const [esChoferRepetido, setEsChoferRepetido] = useState(false)
      

      const handleCloseEdit = () => setShowModalEdit(false)

      const [choferes, setChoferes] = useState([])
      

      const [nombres, setNombres] = useState('')
      const [apellido, setApellido] = useState('')
      const [dni, setDni] = useState('')
      const [email, setEmail] = useState('')
      const [telefono, setTelefono] = useState('')
      const [password, setPassword] = useState('')
      
  
  
      const getChoferes =  () => {
          store.collection('choferes').get()
          .then(response => {
              const fetchedChoferes = [];
              response.docs.forEach(document => {
              const fetchedChofer = {
                  id: document.id,
                  ...document.data()
              };
              fetchedChoferes.push(fetchedChofer)
              });
              setChoferes(fetchedChoferes)
          })
      }    
   
  
      //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
      useEffect(() => {
          store.collection('choferes').get()
          .then(response => {
              const fetchedChoferes = [];
              response.docs.forEach(document => {
              const fetchedChofer = {
                  id: document.id,
                  ...document.data()
              };
              fetchedChoferes.push(fetchedChofer)
              });
              setChoferes(fetchedChoferes)
          })
          .catch(error => {
              setMsgError(error)
              setShowAlert(true)
          });
      }, []);    
  
      const borrarChofer = async (id) => {
          setChoferEliminar(id)
          setShowModal(true);
      }    
  
      const confirmarEliminacion = async () => {
          const { docs } = await store.collection('choferes').get()
          const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
          setChoferes(nuevoArray)
          await store.collection('choferes').doc(choferEliminar).delete()
          getChoferes()
          setShowModal(false)
          setMsgSucc('Se elimino con exito! Click aqui para cerrar')
          setShowAlertSucc(true)
          setShowModalEdit(false)
      }
      
  
      const crearModificarChofer = (oper, item) =>{
  
          if (oper === 'E') {
              setEsEditar(true)
              setChoferEditar(item.id)
              setNombres(item.nombres)
              setApellido(item.apellido)
              setDni(item.dni)
              setEmail(item.email)
              setTelefono(item.telefono)
              setPassword(item.password)

          } else {
              setEsEditar(false)
             
              setChoferEditar('')
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
         if (!telefono.trim()) {
            setMsgError('El campo Telefono esta vacio' )
            setShowAlert(true)
            return
         }
         if (!password.trim()) {
            setMsgError('El campo Password esta vacio' )
            setShowAlert(true)
            return
         }
  
          store.collection('choferes').where("email", "==", email)
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
                  setEsChoferRepetido(datosRepetidos)                               
              })
          
          if (esChoferRepetido) {
              setMsgError('Este Chofer ya se encuentra cargado')
              setShowAlert(true)
              return
          }
          

          const choferAct = {
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
                  await store.collection('choferes').doc(choferEditar).set(choferAct)
                  getChoferes()
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
                  await store.collection('choferes').add(choferAct)
                  getChoferes()
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
          <MenuOpcAdmin/>
          <div>
              <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Listado de Choferes</h3>
              <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} onClick={(e) => { crearModificarChofer('A', '') }} variant="secondary " > + Agregar Chofer</Button>
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
                              choferes.length !== 0 ?
                                  (
                                    choferes.map(item => (
                                          <tr key={item.id}>
                                              <td>{item.dni}</td>
                                              <td>{item.apellido}</td>
                                              <td>{item.nombres}</td>
                                              <td>{item.email}</td>
                                              <td>{item.telefono}</td>
                                              <td style={{width: "12%"}} >
                                                  <div className="d-flex justify-content-around">
                                                    <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarChofer('E', item) }}>
                                                      <PencilFill color="white"></PencilFill>
                                                    </button>
                                                    <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => {borrarChofer(item.id) }}>
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
                      choferes.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
                  }
              </div>
          </div>
          <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
              <Modal.Header >
                  <Modal.Title>Eliminación de Sitio</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Está seguro que desea eliminar el sitio seleccionado?</Modal.Body>
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
                          <Modal.Title>{esEditar ? "Editar Chofer" : "Agregar Chofer" }</Modal.Title>
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
    
    export default AdminChoferPage;