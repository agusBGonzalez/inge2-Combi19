import React,{useState,useEffect} from 'react'
import {Button,Modal,ModalHeader,ModalBody,ModalFooter,Table} from 'reactstrap' 
import {store} from '../firebaseconf'
const Listadoviaje = () => {

        const [idViaje,setIdViaje] = useState([])
        const [viaje,setViaje] = useState([])
        const [fecha, setFecha] = useState('')
        const [combi,setCombi] = useState('')
        const [butacaDisponible, setButacaDisponible] = useState('')
        const [error,setError] = useState({id:'',dato:null})
        const [modal,setModal] = useState(false)
        const [modal2,setModal2] = useState(false)
        const [combiSelect,setCombiSelect] = useState([])
        const [rutaSelect,setRutaSelect] = useState([{}])
        const [ruta,setRuta] = useState('')
        const [precio,setPrecio] = useState('')
        var hoy = new Date().toLocaleDateString()


        useEffect(()=>{
            const datos = async() =>{
                const {docs} = await store.collection('combi').get()
                const combiArray = docs.map( item => ({id:item.id, ...item.data()}))
                setCombiSelect(combiArray)
                const respuesta = await store.collection('ruta').get()
                const rutaArray = respuesta.docs.map( item => ({id:item.id, ...item.data()}))
                setRutaSelect(rutaArray)
            }
            datos()    
        },[]) 
        
        const getViaje = async () =>{
            const {docs} = await store.collection('viaje').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setViaje(nuevoArray)
        }
    
        const borrarViaje = async (e) => {
            e.preventDefault()
            let ok = false
            let fecha
            let dia = 1
            let aux 
            viaje.map(itemviaje =>{
                console.log(idViaje)
                fecha = new Date(itemviaje.fechaviaje)
                aux = new Date(fecha.setDate(fecha.getDate() + dia))
                if(itemviaje.id === idViaje){
                    if(hoy === aux.toLocaleDateString()){
                       setError({id:'viajecurso',dato:'El viaje esta en curso por lo cual no se puede eliminar'})
                        ok = true  
                    }
                }
            })
            if (ok){
                return
            }

            try {
                await store.collection('viaje').doc(idViaje).delete()
                const {docs} = await store.collection('viaje').get()
                const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
                setViaje(nuevoArray)
            } catch (e) {
                console.log(e)
            }
            setError({id:'',dato:null})
            setModal2(false)
            
        }
    
        const setUpdate = async (e) =>{
            e.preventDefault()
            let ok,ok2 = false
            let fecharepe
            let dia = 1 
            let aux 
            if(!fecha.trim()){
                setError({id:'fecha',dato:'El campo fecha esta vacio'})
                return
            }else if(!ruta.trim()){
                setError({id:'ruta',dato:'El campo ruta esta vacio'})
                return
            }else if(!combi.trim()){
                setError({id:'combi',dato:'El campo combi esta vacio'})
                return
            }else if(!butacaDisponible.trim()){
                setError({id:'butacaDisponible',dato:'El campo butacas disponibles estan vacias'})
                return
            }else if (!precio.trim()){
                setError({id:'precio',dato:'El campo precio esta vacio'})
                return
            }
            viaje.map(itemviaje =>{
                fecharepe = new Date(itemviaje.fechaviaje)
                aux = new Date(fecharepe.setDate(fecharepe.getDate() + dia))
                if(itemviaje.id === idViaje){
                    if(hoy === aux.toLocaleDateString()){
                       setError({id:'viajecurso',dato:'El viaje esta en curso por lo cual no se puede modificar'})
                        ok = true  
                    }
                }
            })

            combiSelect.map( itemcombi =>{
                if(itemcombi.patente === combi ){
                    if(butacaDisponible > itemcombi.butaca ){
                        setError({id:'butacaextra',dato:'La cantidad de butacas ingresadas es mayor a las que posee la combi'})
                        ok = true
                    }
                }
            })
    

            if (ok){
                return
            }

            const regviaje= {
                fechaviaje:fecha,
                ruta:ruta,
                combi:combi,
                butacaDisponible:butacaDisponible,
                precio:precio
            }
            try {
                await store.collection('viaje').doc(idViaje).set(regviaje)
                const {docs} = await store.collection('viaje').get()
                const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
                setViaje(nuevoArray)
               
            } catch (e) {
                console.log(e)
                
            }
            setFecha('')
            setButacaDisponible('')
            setPrecio('')
            setError({id:'',dato:null})
            setModal(false)
        }
    
        const actualizarViaje = async(idv) =>{
            try {
                store.collection('viaje').onSnapshot(info => {
                    info.forEach(doc => {
                        if(idv === doc.id){
                            setFecha(doc.data().fechaviaje)
                            setRuta(doc.data().ruta)
                            setCombi(doc.data().combi)
                            setPrecio(doc.data().precio)
                            setButacaDisponible(doc.data().butacaDisponible)     
                        }
  
                    })
                })
                
                setModal(false)
            } catch (e) {
                console.log(e)
                
            }
        }


        const abrirModalBorrar = (e,idc) => {
            e.preventDefault()
            setIdViaje(idc)
            setModal2(!modal2)
        }
    
        const cerrarModal2 = (e) => {
            e.preventDefault()
            setModal2(!modal2)
        }

        const abrirModal = (e,idv) => {
            e.preventDefault()
            setIdViaje(idv)
            actualizarViaje(idv)
            setModal(!modal)
        }
    
        const cerrarModal = (e) => {
            e.preventDefault()
            setModal(!modal)
        }    
        const cambiar = () =>{
            document.location.href = '/registrov'
        }    

    return (
        <div>
            <h3>Listado de Viajes</h3>
            <button onClick= {() =>getViaje()} className ="btn btn-info btn-m">Buscar</button>
            <button onClick= {() =>cambiar()} className="btn btn-info btn-m ml-3">Agregar Viaje</button>
            <Table>
                <thead>
                    <tr align='center'>
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
                                
                                viaje.length !== 0?
                                (
                                    
                                    viaje.map(item =>(
                                        
                                        <tr align='center' key = {item.id}> 
                                        <td>{item.fechaviaje} </td> 
                                        <td>{item.ruta}</td> 
                                        <td>{item.combi}</td> 
                                        <td>{item.butacaDisponible}</td>  
                                        <td>{item.precio}</td>  
                                        <td>  
                                            <button onClick = {(e,id) => {abrirModalBorrar(e,item.id)}} className = "btn btn-danger float-right">Borrar</button>
                                            <button onClick = {(e,id) => {abrirModal(e,item.id)}} className = "btn btn-info float-right mr-3">Modificar</button>
                                        </td>
                                        </tr>
                                        
                                    )) 
                                    
                                ):(
                                    
                                    <p>No hay elementos en la lista</p>
                                )
                            }
                </tbody>               
            </Table>
            <Modal isOpen={modal}>
                <ModalHeader>
                    <h4>Modificar Viaje</h4>
                </ModalHeader>
                <ModalBody>
                <form className ='form-group'>
                <input 
                        onChange= {(e) => {setFecha(e.target.value)}} 
                        className='form-control mt-3' 
                        type="date" 
                        placeholder= 'Fecha de Viaje'  
                        value={fecha}
                    />
                    <select onChange={(e) => {setRuta(e.target.value)}} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                    <option disabled="disabled" selected  name='1'>Seleccione una Ruta</option>
                    {
                        
                        rutaSelect.map( item => (
                            <option  key ={item.id}>Origen:{item.origen} Destino:{item.destino} Hora:{item.hora}-{item.kilometro}Km</option>
                        )
                        )
                      }
                    </select>

                    <select onChange={(e) => {setCombi(e.target.value)}} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                    <option selected disabled="disabled" name='1'>Seleccione una Combi</option>
                    {
                        combiSelect.map( item => (
                            <option key ={item.id}>{item.patente}</option>
                        )
                        )
                      }
                    </select>
                                    
                    <input 
                        onChange= {(e) => {setButacaDisponible(e.target.value)}} 
                        className='form-control mt-3' 
                        type="text" 
                        placeholder='Butacas Disponibles'
                        value={butacaDisponible}
                    />
                    <input 
                        onChange= {(e) => {setPrecio(e.target.value)}} 
                        className='form-control mt-3' 
                        type="text" 
                        placeholder='Precio viaje'
                        value={precio}
                    /> 
                </form>
                {
                       error.dato  != null ?(
                            <div className="alert alert-danger">
                                {error.dato}
                            </div>                               
                       ):(<span></span>)
                   }
                 </ModalBody>    
                <ModalFooter>
                    <Button onClick = {(e)=> setUpdate(e)} className = "btn btn-danger float-right">Aceptar</Button>
                    <Button onClick={(e) => cerrarModal(e)} color= "secondary">Cancelar</Button>
                    
                </ModalFooter>   
            </Modal>
            <Modal isOpen={modal2}>
                <ModalHeader>
                    <h4>Borrar Viaje</h4>
                </ModalHeader>
                <ModalBody>
                        Esta seguro/a de que desea borrar el Viaje?
                        <p></p>
                        {
                       error.dato  != null ?(
                            <div className="alert alert-danger">
                                {error.dato}
                            </div>                               
                       ):(<span></span>)
                   }
                </ModalBody>    
                <ModalFooter>
                    <Button onClick={(e) => borrarViaje(e)} color= "primary">Aceptar</Button>
                    <Button onClick={(e) => cerrarModal2(e)} color= "secondary">Cancelar</Button>
                </ModalFooter>   
            </Modal>
        </div>
    )
}

export default Listadoviaje
