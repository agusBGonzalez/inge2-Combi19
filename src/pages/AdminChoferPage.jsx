
  import React,{useState, useEffect} from 'react'
  import MenuUsuario from '../components/menus/MenuUsuario'
  import MenuOpcAdmin from '../components/menus/MenuOpcAdmin'
  import {Table, Modal, Button, Alert} from 'react-bootstrap'
  import { store } from '../firebaseconf'
  
  
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
      const [sitioEliminar, setSitioEliminar] = useState('');
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
      const [sitioEditar, setSitioEditar] = useState('')
      const [esEditar, setEsEditar] = useState(false)
      const [esSitioRepetido, setEsSitioRepetido] = useState(false)

      const [esChoferRepetido, setEsChoferRepetido] = useState(false)
      const handleCloseEdit = () => setShowModalEdit(false)
  
  
      const [sitios, setSitios] = useState([])

      const [choferes, setChoferes] = useState([])
    //   const [modal, setModal] = useState(false)
      
      const [provincia, setProvincia] = useState('')
      const [ciudad, setCiudad] = useState('')
      //
      const [nombres, setNombres] = useState('')
      const [apellido, setApellido] = useState('')
      const [dni, setDni] = useState('')
      const [email, setEmail] = useState('')
      const [telefono, setTelefono] = useState('')
      const [password, setPassword] = useState('')
      
  
  
      const getSitios =  () => {
          store.collection('sitios').get()
          .then(response => {
              const fetchedSitios = [];
              response.docs.forEach(document => {
              const fetchedSitio = {
                  id: document.id,
                  ...document.data()
              };
              fetchedSitios.push(fetchedSitio)
              });
              setSitios(fetchedSitios)
          })
      }    
   
  
      //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
      useEffect(() => {
          store.collection('sitios').get()
          .then(response => {
              const fetchedSitios = [];
              response.docs.forEach(document => {
              const fetchedSitio = {
                  id: document.id,
                  ...document.data()
              };
              fetchedSitios.push(fetchedSitio)
              });
              setSitios(fetchedSitios)
          })
          .catch(error => {
              setMsgError(error)
              setShowAlert(true)
          });
      }, []);    
  
      const borrarSitio = async (id) => {
          setSitioEliminar(id)
          setShowModal(true);
      }    
  
      const confirmarEliminacion = async () => {
          const { docs } = await store.collection('sitios').get()
          const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
          setSitios(nuevoArray)
          await store.collection('sitios').doc(sitioEliminar).delete()
          getSitios()
          setShowModal(false)
          setMsgSucc('Se elimino con exito! Click aqui para cerrar')
          setShowAlertSucc(true)
          setShowModalEdit(false)
      }
      
  
      const crearModificarSitio = (oper, item) =>{
  
          if (oper === 'E') {
              setEsEditar(true)
              console.log("entra")
              setSitioEditar(item.id)
              setProvincia(item.provincia)
              setCiudad(item.ciudad)
          } else {
              setEsEditar(false)
              console.log("entra2222")
              setSitioEditar('')
              setProvincia('')
              setCiudad('') 
          }
          setShowModalEdit(true)
      }
  
  
      const confirmarEdicion = async (e) => {
          e.preventDefault()
  
          if (provincia === "") {
              setMsgError('El campo provincia esta vacio' )
              setShowAlert(true)
              return
          }
          if (ciudad === "") {
              setMsgError('El campo ciudad esta vacio')
              setShowAlert(true)
              return
          }
  
          store.collection('sitios').where("provincia", "==", provincia)
              .get()
              .then((querySnapshot) => {
                  let datosRepetidos = false
                  querySnapshot.forEach((doc) => {
                      //COMO FILTRO POR PROVINCIA, QUEDA CHEQUEAR QUE NO HAYA UNA CIUDAD IGUAL
                      const nomCuidad = doc.data().ciudad
                      console.log(nomCuidad)   
                      console.log(ciudad)             
                      if (nomCuidad === ciudad) {
                          datosRepetidos = true
                      }
                  });
                  setEsSitioRepetido(datosRepetidos)                               
              })
          
          if (esSitioRepetido) {
              setMsgError('Este sitio ya se encuentra cargado')
              setShowAlert(true)
              return
          }
  
          const sitioAct = {
              ciudad: ciudad,
              provincia: provincia
          }
          
          if (esEditar){
              try{
                  //FALTA MOSTRAR MSJ DE SUCESS
                  await store.collection('sitios').doc(sitioEditar).set(sitioAct)
                  getSitios()
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
                  await store.collection('sitios').add(sitioAct)
                  getSitios()
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
          <MenuUsuario/>
          <MenuOpcAdmin/>
          <div>
              <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Listado de Choferes</h3>
              <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} onClick={(e) => { crearModificarSitio('A', '') }} variant="secondary " > + Agregar Chofer</Button>
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
                              sitios.length !== 0 ?
                                  (
                                      sitios.map(item => (
                                          <tr key={item.id}>
                                              <td>{item.provincia}</td>
                                              <td>{item.ciudad}</td>
                                              <td style={{width: "20%"}} >
                                                  <div className="d-flex justify-content-around">
                                                  <button className="btn btn-primary d-flex" onClick={(e) => { crearModificarSitio('E', item) }}>Modificar</button>
                                                  <button className="btn btn-danger pr-3 flex" onClick={(id) => {borrarSitio(item.id) }}>Borrar</button>
                                                  </div>
                                              </td>
                                              <td>
                                                  
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
                      sitios.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
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