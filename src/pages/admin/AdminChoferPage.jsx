  import React,{useState, useEffect} from 'react'
  import MenuUsuarioAdmin from '../../components/menus/MenuUsuarioAdmin'
  import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
  import {Table, Modal, Button, Alert} from 'react-bootstrap'
  import { store, auth } from '../../firebaseconf'
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

      const [choferes, setChoferes] = useState([])
      const [combisCargadas,setCombisCargadas] = useState([])
      const [viajesCargados,setViajesCargados] = useState([])
      

      const [nombres, setNombres] = useState('')
      const [apellido, setApellido] = useState('')
      const [dni, setDni] = useState('')
      const [email, setEmail] = useState('')
      const [telefono, setTelefono] = useState('')
      const [password, setPassword] = useState('')
      const [idUser, setIdUser] = useState('')
      
      

    const getViajesCargados =  () => {
        store.collection('viaje').get()
        .then(response => {
            const fetchedViajes = [];
            response.docs.forEach(document => {
            const fetchedViaje = {
                id: document.id,
                ...document.data()
            };
            fetchedViajes.push(fetchedViaje)
            });
            setViajesCargados(fetchedViajes)
        })
    }

    const getCombisCargadas =  () => {
        store.collection('combi').get()
        .then(response => {
            const fetchedCombis = [];
            response.docs.forEach(document => {
            const fetchedCombi = {
                id: document.id,
                ...document.data()
            };
            fetchedCombis.push(fetchedCombi)
            });
            setCombisCargadas(fetchedCombis)
        })
    }
    
    
  
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
          getCombisCargadas()
          getViajesCargados()
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

          const tieneCombiAsig = combisCargadas.find((itemCombi) => {
            return itemCombi.idChofer === choferEliminar
          })

          if(tieneCombiAsig !== undefined){
            const tieneViajesCombiAsigChofer = viajesCargados.find((itemViaje) => {
                return itemViaje.idCombi === tieneCombiAsig.id
            })

            //PREGUNTO POR "UNDEFINED" PORQUE EL FIND SI NO ENCUENTRA NADA DEVUELVE ESO
            // SI NO TIENE VIAJES ASIGNADOS === UNDEFINED
            if(tieneViajesCombiAsigChofer !== undefined){
                setMsgErrorDelete('El Chofer no se puede eliminar porque se encuentra en una Combi con un viaje asignado')
                setShowAlertDelete(true)
                return
            }
          }

          console.log("hace el eliminar")
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
              setIdUser(item.idUser)

          } else {
              setEsEditar(false)
              setChoferEditar('')
              setNombres('')
              setApellido('')
              setDni('')
              setEmail('')
              setTelefono('')
              setPassword('')
              setIdUser('')
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

        const esChoferRepetido = choferes.find((chofer) => {
            let dniMailRep =  ((chofer.dni === dni) || (chofer.email === email))
            let nombApeDniRep = ((chofer.nombres === nombres) && (chofer.apellido === apellido) && (chofer.dni === dni))
            let nombApeEmailRep = ((chofer.nombres === nombres) && (chofer.apellido === apellido) && (chofer.email === email))
            return (dniMailRep || nombApeDniRep || nombApeEmailRep)
        })

             
          if (esChoferRepetido) {
              setMsgError('Los datos ingresados corresponden a un Chofer ya registrado')
              setShowAlert(true)
              return
          }
          

          const choferAct = {
            nombres: nombres,
            apellido: apellido,
            dni: dni,
            email: email,
            telefono: telefono,
            password: password,
            idUser: idUser
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
                    auth.createUserWithEmailAndPassword(email,password)
                        .then( async (userCredential) => {
                            
                            const nuevoUser = {
                                nombres: nombres,
                                apellido: apellido,
                                fechaNac: '',
                                email: email,
                                tipo: "chofer",
                                esGold: false,
                                tarjetaNum: '',
                                tarjetaCod: '',
                                tarjetaVen: '',
                                idUser: userCredential.user.uid,
                                password:password,
                                esSospechoso:false,
                                sospechosoFecha:''
                            }

                            const choferAct = {
                                nombres: nombres,
                                apellido: apellido,
                                dni: dni,
                                email: email,
                                telefono: telefono,
                                password: password,
                                idUser: userCredential.user.uid
                              }
                            
                            try{
                                await store.collection('choferes').add(choferAct)
                                await store.collection('usuariosConfig').add(nuevoUser)
                                getChoferes()

                            }catch(e){
                                setMsgError('Uups! Hubo un problema al registrar el usuario en el sistema')
                                setShowModal(true)
                                console.log(e)
                            }
                            
                        })
                        .catch (err => {
                            console.log(err)
                            if(err.code === 'auth/invalid-email'){
                                setMsgError('Formato de Email incorrecto')
                                setShowModal(true)
                            }
                    
                            if(err.code === 'auth/weak-password'){
                                setMsgError('La password debe tener 6 caracteres o más')
                                setShowModal(true)
                            }
                            if(err.code === 'auth/email-already-in-use'){
                                setMsgError('El email que ingresó ya se encuentra registrado')
                                setShowModal(true)
                            }
                            
                            console.log(err)
                        })
                  //FALTA MOSTRAR MSJ DE SUCESS
                  
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
          <MenuUsuarioAdmin/>
          <MenuOpcAdmin optionName="listaChoferes"/>
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
                      <tbody className ="animate__animated animate__slideInUp">
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
                  <Modal.Title>Eliminación de Chofer</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Está seguro que desea eliminar el chofer seleccionado?
                <Alert className="mt-4" variant="danger" show={showAlertDelete} onClick = {handleCloseAlertDelete}>
                    {msgErrorDelete}
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