import React,{useState, useEffect} from 'react'
import {Button,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap' 
import {store} from '../firebaseconf'

const RegistrarViaje = () => {
    const [fecha, setFecha] = useState('')
    const [combi,setCombi] = useState('')
    const [butacaDisponible, setButacaDisponible] = useState('')
    const [error,setError] = useState({id:'',dato:null})
    const [modal,setModal] = useState(false)
    const [combiSelect,setCombiSelect] = useState([])
    const [rutaSelect,setRutaSelect] = useState([{}])
    const [ruta,setRuta] = useState('')
    const [precio,setPrecio] = useState('')
    const [viaje,setViaje] = useState ([{}])
    
    useEffect(()=>{
        const datos = async() =>{
            const {docs} = await store.collection('combi').get()
            const combiArray = docs.map( item => ({id:item.id, ...item.data()}))
            setCombiSelect(combiArray)
            const respuesta = await store.collection('ruta').get()
            const rutaArray = respuesta.docs.map( item => ({id:item.id, ...item.data()}))
            setRutaSelect(rutaArray)
            const res = await store.collection('viaje').get()
            const viajeArray = res.docs.map( item => ({id:item.id, ...item.data()}))
            setViaje(viajeArray)
        }
        datos()    
    },[]) 


    const cancelar =(e) =>{
        e.preventDefault()
        setFecha('')
        setButacaDisponible('')
        setPrecio('')
        setError({id:'',dato:null})
        setModal(false)
    }

    const abrirModal = (e) => {
        e.preventDefault()
        setModal(!modal)
    }
    
    const agregarViaje = async (e) =>{
        e.preventDefault()
        let encontre = false
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
        combiSelect.map( itemcombi =>{
            if(itemcombi.patente === combi ){
                if(butacaDisponible > itemcombi.butaca ){
                    setError({id:'butacaextra',dato:'La cantidad de butacas ingresadas es mayor a las que posee la combi'})
                    encontre = true
                    console.log('entro')
                }
            }
        })

        viaje.map (itemviaje =>{
            if(combi === itemviaje.combi && fecha === itemviaje.fechaviaje  && ruta === itemviaje.ruta){
                setError({id:'repetido',dato:'Se esta repitiendo el viaje para la misma fecha, combi y ruta'})
                encontre= true 
            }
        })

        if(encontre){
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
            const data = await store.collection('viaje').add(regviaje)
            alert('El viaje se registro correctamente')
            
        } catch (e) {
            console.log(e)
        }
        setFecha('')
        setButacaDisponible('')
        setPrecio('')
        
        setError({id:'',dato:null})
    }
    
    return (
        <div>
            <h3 className='Titulo mt-3'>Registrar Viaje</h3>
            <div className = "row">
                 
                <div className = "col">
                   <form className ='form-group'>
                    <input 
                        onChange= {(e) => {setFecha(e.target.value)}} 
                        className='form-control mt-3' 
                        type="date" 
                        placeholder= 'Fecha de Viaje'  
                        value={fecha}
                    />
                    <select onChange={(e) => {setRuta(e.target.value)}} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                    <option disabled="disabled" selected  name='rutas'>Seleccione una Ruta</option>
                    {
                        
                        rutaSelect.map( item => (
                            <option  name ={item.id}>Origen:{item.origen} Destino:{item.destino} Hora:{item.hora}-{item.kilometro}Km</option>
                        )
                        )
                      }
                    </select>

                    <select onChange={(e) => {setCombi(e.target.value)}} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                    <option selected disabled="disabled" name='1'>Seleccione una Combi</option>
                    {
                        combiSelect.map( item => (
                            <option name ={item.id}>{item.patente}</option>
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
                    <input onClick= {(e) => agregarViaje(e)} className='btn btn-info btn-m mt-3' type="submit" value ='Registrar'/>
                    <input onClick={(e) => abrirModal(e)} className='btn btn-info btn-m mt-3 ml-3' type="submit" value ='Cancelar'/>
                </form>
                {
                       error.dato  != null ?(
                            <div className="alert alert-danger">
                                {error.dato}
                            </div>                               
                       ):(<span></span>)
                   }
                  
                </div>
                    
            </div>
            <Modal isOpen={modal}>
                <ModalHeader>
                    <h4>Cancelar carga</h4>
                </ModalHeader>
                <ModalBody>
                        Desea cancelar la carga del registro Viaje?
                </ModalBody>    
                <ModalFooter>
                    <Button onClick={(e) => cancelar(e)} color= "primary">Aceptar</Button>
                    <Button onClick={(e) => abrirModal(e)} color= "secondary">Cancelar</Button>
                </ModalFooter>   
            </Modal>
        </div>
    )
}

export default RegistrarViaje
