import React,{useState,useEffect} from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import {Table, Modal, Button, Alert} from 'react-bootstrap'
import { store } from '../../firebaseconf'
import { TrashFill, PencilFill} from 'react-bootstrap-icons';


const AdminCombiPage = () => {
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
    const [combiEliminar, setCombiEliminar] = useState('');
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
    const [combiEditar, setCombiEditar] = useState('')
    const [esEditar, setEsEditar] = useState(false)
    const handleCloseEdit = () => setShowModalEdit(false)


    const [combi, setCombi] = useState([])
    
    const [patente, setPatente] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [año, setAño] = useState('')
    const [butaca, setButaca] = useState('')
    const [tipo,setTipo] = useState('')
    const [choferselect,setChoferSelect] = useState([])
    const [chofer,setChofer] = useState('')
    const [viaje,setViaje] = useState([])
    const [auxiliar,setAuxiliar] = useState([])

    const getCombis =  () => {
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
            setCombi(fetchedCombis)
        })
    }    
 

    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        const datoschoferes = async() =>{
            const {docs} = await store.collection('choferes').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setChoferSelect(nuevoArray)
            const r = await store.collection('viaje').get()
            const viajesArray = r.docs.map( item => ({id:item.id, ...item.data()}))
            setViaje(viajesArray)
        }
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
            setCombi(fetchedCombis)
        })
        .catch(error => {
            setMsgError(error)
            setShowAlert(true)
        });
        datoschoferes()
    }, []);    



    const borrarCombi = async (id) => {
        setCombiEliminar(id)
        setShowModal(true);
    }    

    const confirmarEliminacion = async () => {
        let encontre2 = false 
       
        const { docs } = await store.collection('combi').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setCombi(nuevoArray)
        viaje.map( itemviaje =>{
            combi.map (itemcombi =>{
                if(itemcombi.patente == itemviaje.combi){
                    setMsgError('La combi ya se encuentra asignada a un viaje')
                    setShowAlert(true)
                    encontre2 = true 
                }
           })
        }) 
        if (encontre2){
            return
        }
        await store.collection('combi').doc(combiEliminar).delete()
        getCombis()
        setShowModal(false)
        setMsgSucc('Se elimino con exito! Click aqui para cerrar')
        setShowAlertSucc(true)
        setShowModalEdit(false)
    }
    

    const crearModificarCombi = (oper, item) =>{
      
        if (oper === 'E') {
            setEsEditar(true)
            setAuxiliar(item)
            setCombiEditar(item.id)
            setPatente(item.patente)
            setMarca(item.marca)
            setModelo(item.modelo)
            setAño(item.año)
            setButaca(item.butaca)
            setTipo(item.tipocombi)
            setChofer(item.chofer)
        } else {
            setEsEditar(false)
            setCombiEditar('')
            setPatente('')
            setMarca('')
            setModelo('')
            setButaca('')
            setAño('')
            setTipo('')
            setChofer('')

        }
        setShowModalEdit(true)
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault()
        let encontre2 = false
        let ok = false
        if(!patente.trim()){
            setMsgError('El campo patente esta vacio')
            setShowAlert(true)
            return
        }else if(!marca.trim()){
            setMsgError('El campo marca esta vacio' )
            setShowAlert(true)
            return
        }else if(!modelo.trim()){
            setMsgError('El campo modelo esta vacio' )
            setShowAlert(true)
            return
        }else if(!año.trim()){
            setMsgError('El campo año esta vacio' )
            setShowAlert(true)
            return
        }else if(!butaca.trim()){
            setMsgError('El campo butaca esta vacio' )
            setShowAlert(true)
            return
        }else if(!tipo.trim()){
            setMsgError('El campo tipo esta vacio')
            setShowAlert(true)
            return
        }else if(!chofer.trim()){
            setMsgError('El campo chofer esta vacio')
            setShowAlert(true)
            return
        }
        
        

        if (esEditar) {
            if (auxiliar.patente !== patente) {
                combi.map(item =>{
                    if(patente === item.patente){
                        setMsgError('Esta patente ya se encuentra cargada')
                        setShowAlert(true)
                        encontre2 = true
                    }
                })
                

            }
            viaje.map(itemviaje =>{
                if(itemviaje.combi === auxiliar.patente){
                    if(itemviaje.combi === patente){
                        console.log('ENTRO AL IF DE IGUALES')
                        setMsgError('La combi que desea modificar ya se encuentra en un viaje')
                        setShowAlert(true)
                        encontre2 = true 
                    }else{
                        console.log('ENTRO AL ELSE')
                        setMsgError('La combi que desea modificar ya se encuentra en un viaje')
                        setShowAlert(true)
                        encontre2 = true
                    }
                }
            })
        
        }else{
            if (!encontre2) {
                combi.map(item =>{
                    if(patente === item.patente){
                        setMsgError('Esta patente ya se encuentra cargada')
                        setShowAlert(true)
                        encontre2 = true
                    }
                })  
            }
            
        }
        
        if (encontre2){
            return
        }

        const regcombi= {
            patente:patente,
            marca:marca,
            modelo:modelo,
            año:año,
            butaca:butaca,
            tipocombi:tipo,
            chofer:chofer

        }
        
        if (esEditar){
            try{
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('combi').doc(combiEditar).set(regcombi)
                getCombis()
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
                await store.collection('combi').add(regcombi)
                getCombis()
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
        <MenuOpcAdmin optionName="listaCombis"/>
        <div>
            <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Listado de Combis</h3>
            <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} onClick={(e) => { crearModificarCombi('A', '') }} variant="secondary " > + Agregar Combi</Button>
            <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{bottom:0,zIndex:5, position: 'absolute', left: 75,width: "60%"}} >
				{msgSucc}
			</Alert>
            <div style={subPageStyle}>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Patente</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Butacas</th>
                            <th>Tipo de Combi</th>
                            <th>Chofer</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            combi.length !== 0 ?
                                (
                                    combi.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.patente} </td> 
                                            <td>{item.marca}</td> 
                                            <td>{item.modelo}</td> 
                                            <td>{item.año}</td>  
                                            <td>{item.butaca}</td> 
                                            <td>{item.tipocombi}</td> 
                                            <td>{item.chofer}</td>
                                            <td style={{width: "12%"}} >
                                                  <div className="d-flex justify-content-around">
                                                    <button className="btn btn-primary d-flex justify-content-center p-2 align-items-center" onClick={(e) => { crearModificarCombi('E', item) }}>
                                                      <PencilFill color="white"></PencilFill>
                                                    </button>
                                                    <button className="btn btn-danger d-flex justify-content-center p-2 align-items-center" onClick={(id) => {borrarCombi(item.id) }}>
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
                    combi.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
                }
            </div>
        </div>
        <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
			<Modal.Header >
				<Modal.Title>Eliminación de Combi</Modal.Title>
			</Modal.Header>
			<Modal.Body>¿Está seguro que desea eliminar la combi seleccionada?
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
                        <input 
                                onChange= {(e) => {setPatente(e.target.value)}} 
                                onClick = {handleCloseAlert}
                                className='form-control mt-5' 
                                type="text" 
                                placeholder= 'Patente'  
                                value={patente}
                            />
                            <input 
                                onChange= {(e) => {setMarca(e.target.value)}} 
                                onClick = {handleCloseAlert}
                                className='form-control mt-3'
                                type="text" 
                                placeholder='Marca'
                                value={marca}
                            />
                            <input 
                                onChange= {(e) => {setModelo(e.target.value)}} 
                                onClick = {handleCloseAlert}
                                className='form-control mt-3' 
                                type="text" 
                                placeholder='Modelo'
                                value= {modelo}
                            />
                           
                           <input 
                                onChange= {(e) => {setButaca(e.target.value)}} 
                                onClick = {handleCloseAlert}
                                className='form-control mt-3' 
                                type="int" 
                                placeholder='Nro. de Butacas'
                                maxLength = '3' 
                                value= {butaca}
                            />
                           
                            <select
                                value={año} onChange={(e) => { setAño(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                <option disabled="disabled" value="">Seleccione un Año</option>
                                <option value='2000'>2000</option>
                                <option value='2001'>2001</option>
                                <option value='2002'>2002</option>
                                <option value='2003'>2003</option>
                                <option value='2004'>2004</option>
                                <option value='2005'>2005</option>
                                <option value='2006'>2006</option>
                                <option value='2007'>2007</option>
                                <option value='2008'>2008</option>
                                <option value='2009'>2009</option>
                                <option value='2010'>2010</option>
                                <option value='2011'>2011</option>
                                <option value='2012'>2012</option>
                                <option value='2013'>2013</option>
                                <option value='2014'>2014</option>
                                <option value='2015'>2015</option>
                                <option value='2016'>2016</option>
                                <option value='2017'>2017</option>
                                <option value='2018'>2018</option>
                                <option value='2019'>2019</option>
                                <option value='2020'>2020</option>
                                <option value='2021'>2021</option>
                            </select>

                            <select
                                value={tipo} onChange={(e) => { setTipo(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                <option disabled="disabled" value="">Seleccione un Tipo de Combi</option>
                                <option value='Comoda'>Comoda</option>
                                <option value='Super Comoda'>Super Comoda</option>
                            </select>

                            <select
                                value={chofer} onChange={(e) => { setChofer(e.target.value) }}
                                onClick = {handleCloseAlert}
                                className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                                <option disabled="disabled" value="">Seleccione un Chofer </option>
                                {
                                choferselect.map( item2=> (
                                    <option name ={item2.id}>{item2.apellido} {item2.nombres}</option>
                                )
                                )
                                 }
                            </select>
                            
                            
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

export default AdminCombiPage
