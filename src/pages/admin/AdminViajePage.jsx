import React,{useState, useEffect} from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import {Table, Modal, Button, Alert} from 'react-bootstrap'
import { store } from '../../firebaseconf'
import { TrashFill, PencilFill, CloudHazeFill} from 'react-bootstrap-icons';


function AdminViajePage() {

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
    const [viajeEliminar, setViajeEliminar] = useState('');

    const handleClose = () => setShowModal(false);

    //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);
    const [showAlertDanger, setShowAlertDanger] = useState(false)
    const handleCloseAlertDanger = () => setShowAlertDanger(false)
    const [msgError, setMsgError] = useState (null)
    const [msgDanger, setMsgDanger] = useState(null)
    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState (null)


    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [viajeEditar, setViajeEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    

    const handleCloseEdit = () => setShowModalEdit(false)

    const [viajes, setViajes] = useState([])
    
    const [fecha, setFecha] = useState('')
    const [combi,setCombi] = useState('')
    const [butacaDisponible, setButacaDisponible] = useState('')
    const [precio,setPrecio] = useState('')
    const [rutaSelect,setRutaSelect] = useState([])
    const [rutas,setRutas] = useState('')
    const [combiSelect,setCombiSelect] = useState([])
    const [auxiliar,setAuxiliar] = useState([])
    var hoy = new Date().toLocaleDateString()


    const getViajes =  () => {
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
            setViajes(fetchedViajes)
        })
    }    
 

    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        const datos = async() =>{
            const {docs} = await store.collection('combi').get()
            const combiArray = docs.map( item => ({id:item.id, ...item.data()}))
            setCombiSelect(combiArray)
            const respuesta = await store.collection('rutasZaca').get()
            const rutaArray = respuesta.docs.map( item => ({id:item.id, ...item.data()}))
            setRutaSelect(rutaArray)
        }
        
        datos()
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
            setViajes(fetchedViajes)
        })
        .catch(error => {
            setMsgError(error)
            setShowAlert(true)
        });
    },[]);    

    const borrarViaje = async (id) => {
        setViajeEliminar(id)
        setShowModal(true);
    }    

    const confirmarEliminacion = async () => {
        let ok = false
        let fecha2
        let dia = 1
        let aux 
        const { docs } = await store.collection('viaje').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setViajes(nuevoArray)
        viajes.map(itemviaje =>{
            fecha2 = new Date(itemviaje.fechaviaje)
            aux = new Date(fecha2.setDate(fecha2.getDate() + dia))
            if(itemviaje.id === viajeEliminar){
                if(hoy === aux.toLocaleDateString()){
                    ok = true 
                    setShowModal(false) 
                }
            }
        })
        if (ok){
            setMsgDanger('No se pudo eliminar ya que el viaje esta en curso! Click aqui para cerrar')
            setShowAlertDanger(true)
            return
        }

        await store.collection('viaje').doc(viajeEliminar).delete()
        getViajes()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }
    

    const crearModificarViaje = (oper, item) =>{
        if (oper === 'E') {
            setEsEditar(true)
            setAuxiliar(item)
            setViajeEditar(item.id)
            setFecha(item.fechaviaje)
            setRutas(item.idRuta)
            setCombi(item.idCombi)
            setButacaDisponible(item.butacaDisponible)
            setPrecio(item.precio)

        } else {
            setEsEditar(false)
            setViajeEditar('')
            setFecha('')
            setRutas('')
            setCombi('')
            setButacaDisponible('')
            setPrecio('')
        }
        setShowModalEdit(true)
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault()
        let encontre = false
        let fecha2
        let dia = 1
        let aux

        if (!fecha.trim()) {
            setMsgError('El campo Fecha esta vacio' )
            setShowAlert(true)
            return
        }

        if (!rutas.trim()) {
          setMsgError('El campo Ruta esta vacio' )
          setShowAlert(true)
          return
        }

        if (!combi.trim()) {
              setMsgError('El campo Combi esta vacio' )
              setShowAlert(true)
              return
        }

        if (butacaDisponible === '') {
          setMsgError('El campo Butacas disponibles esta vacio' )
          setShowAlert(true)
          return
       }

       if (!precio.trim()) {
        setMsgError('El campo Precio esta vacio' )
        setShowAlert(true)
        return
        }

        if (precio < 0) {
            setMsgError('El precio tiene que ser mayor que 0' )
            setShowAlert(true)
            return
        }

        fecha2 = new Date(fecha)
        aux = new Date(fecha2.setDate(fecha2.getDate() + dia)).toLocaleDateString()
        if(hoy > aux){
            setMsgError('No se puede cargar fechas anteriores a la de hoy' )
            setShowAlert(true)
            return
        }

        combiSelect.map( itemcombi =>{
            if(itemcombi.id === combi ){
                if(parseInt(butacaDisponible) > parseInt(itemcombi.butaca) ){
                    setMsgError('La cantidad de butacas ingresadas es mayor a las que posee la combi')
                    setShowAlert(true)
                    encontre = true
                }
            }
        })

        // ME GUARDO TODOS LOS DATOS DE LA COMBI ELEGIDA EN EL SELECT
        const datosCombi = combiSelect.find((item) => {
            return item.id === combi
        })

       
        let destino_seleccionado,origen_seleccinado
        let ruta_select
        rutaSelect.map(item =>{
            if(item.id === rutas){
                destino_seleccionado= item.provDest+'-'+item.ciudadDest
                origen_seleccinado = item.provOrigen+'-'+item.ciudadOrigen
                ruta_select = 'Origen: '+ origen_seleccinado + ' Destino: '+ destino_seleccionado +' Hora:'+ item.horario+' hs - '+item.km+' Km'
            }
            
        })

        if (esEditar) {
            if (auxiliar.fechaviaje !== fecha) {
                viajes.map (itemviaje =>{
                    if(datosCombi.id === itemviaje.idCombi && fecha === itemviaje.fechaviaje  && ruta_select === itemviaje.ruta_entera){
                        setMsgError('Se esta repitiendo el viaje para la misma fecha, combi y ruta')
                        setShowAlert(true)
                        encontre= true 
                    }
                })
            }
            viajes.map(itemviaje =>{
                fecha2 = new Date(itemviaje.fechaviaje)
                aux = new Date(fecha2.setDate(fecha2.getDate() + dia))
                if(itemviaje.id === auxiliar.id){
                    if(hoy === aux.toLocaleDateString()){
                        console.log('entre')
                        setMsgError('El viaje esta en curso por lo cual no se puede modificar')
                        setShowAlert(true)
                        encontre = true  
                    }
                }
            })
        }else{
            viajes.map (itemviaje =>{
                if(datosCombi.id === itemviaje.idCombi && fecha === itemviaje.fechaviaje  && ruta_select === itemviaje.ruta_entera){
                    setMsgError('Se esta repitiendo el viaje para la misma fecha, combi y ruta')
                    setShowAlert(true)
                    encontre= true 
                }
            })
        }

        if(encontre){
            return
        }
        const regviaje= {
            fechaviaje:fecha,
            ruta_entera:ruta_select,
            idRuta:rutas,
            idCombi:datosCombi.id,
            combi:datosCombi.patente,
            butacaDisponible:butacaDisponible,
            precio:precio,
            destino:destino_seleccionado,
            origen:origen_seleccinado
        }
        if (esEditar){
            try{
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('viaje').doc(viajeEditar).set(regviaje)
                getViajes()
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
                await store.collection('viaje').add(regviaje)
                getViajes()
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
        <MenuOpcAdmin optionName="listaViajes"/>
        <div>
            <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Listado de Viajes</h3>
            <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} onClick={(e) => { crearModificarViaje('A', '') }} variant="secondary " > + Agregar Viaje</Button>
            <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
                {msgSucc}
            </Alert>
            <Alert id="danger" className="" variant="danger" show={showAlertDanger} onClick={handleCloseAlertDanger} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgDanger}
            </Alert>
            <div style={subPageStyle} >
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Ruta</th>
                          <th>Combi</th>
                          <th>Butacas Disponibles</th>
                          <th>Precio</th>
                          <th>Acciones</th>           
                        </tr>
                    </thead>
                    <tbody>
                        {
                            viajes.length !== 0 ?
                                (
                                  viajes.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.fechaviaje}</td>
                                            <td>{item.ruta_entera}</td>
                                            <td>{item.combi}</td>
                                            <td>{item.butacaDisponible}</td>
                                            <td>{item.precio}</td>
                                            <td style={{width: "12%"}} >
                                                <div className="d-flex justify-content-around">
                                                  <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarViaje('E', item) }} >
                                                    <PencilFill color="white"></PencilFill>
                                                  </button>
                                                  <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => {borrarViaje(item.id) }}>
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
                    viajes.length === 0 ? <div className="alert alert-warning mt-19"> No se encontraron Viajes registrados, agregue nuevos para visualizar en la lista </div> : <div></div>
                }
            </div>
        </div>
        <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>Eliminación de Viaje</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Está seguro que desea eliminar el viaje seleccionado?
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
                        <Modal.Title>{esEditar ? "Editar Viaje" : "Agregar Viaje" }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-group'>
                            <input onChange={(e) => { setFecha(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="date"
                                placeholder='Fecha del viaje'
                                id="fecha"
                                value={fecha}   
                            />
                            <select
                                value={rutas} onChange={(e) => { setRutas(e.target.value)}}
                                onClick = {handleCloseAlert}
                                className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                <option disabled="disabled" value="">Seleccione una Ruta </option>
                                {
                                rutaSelect.map( item2=> (
                                    <option value={item2.id} key ={item2.id}>Origen: {item2.provOrigen}-{item2.ciudadOrigen} Destino: {item2.provDest}-{item2.ciudadDest} Hora:{item2.horario} HS - {item2.km} Km</option>
                                )
                                )
                                 }
                            </select>
                            <select
                                value={combi} onChange={(e) => { setCombi(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                <option disabled="disabled" value="">Seleccione una Combi </option>
                                {
                                combiSelect.map( item2=> (
                                    <option key ={item2.id} value={item2.id}>{item2.patente}</option>
                                )
                                )
                                 }
                            </select>
                            
                            <input onChange={(e) => { setButacaDisponible(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="text"
                                maxLength = '2'                       
                                placeholder='Ingrese las Butacas Disponibles'
                                id="butacas"
                                value={butacaDisponible}
                            />
                            <input onChange={(e) => { setPrecio(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className='form-control mt-2'
                                type="number"
                                placeholder='Ingrese Precio'
                                id="precio"
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
  
  export default AdminViajePage;