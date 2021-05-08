import React, {useState} from 'react'
import {Button,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap' 
import {store} from '../../firebaseconf'

const RegistrarCombi = () => {
    const [patente, setPatente] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [año, setAño] = useState('')
    const [butaca, setButaca] = useState('')
    const [tipo,setTipo] = useState('')
    const [chofer,setChofer] = useState('')
    const [error,setError] = useState({id:'',dato:null})
    const [errorRepetido, setErrorRepetido] = useState(null)
    const [modal,setModal] = useState(false)
    



    const agregar = async (e)=>{
        e.preventDefault()
        if(!patente.trim()){
            setError({id:'patente',dato:'El campo patente esta vacio'})
            return
        }else if(!marca.trim()){
            setError({id:'marca',dato:'El campo marca esta vacio'})
            return
        }else if(!modelo.trim()){
            setError({id:'modelo',dato:'El campo modelo esta vacio'})
            return
        }else if(!año.trim()){
            setError({id:'año',dato:'El campo año esta vacio'})
            return
        }else if(!butaca.trim()){
            setError({id:'butaca',dato:'El campo butaca esta vacio'})
            return
        }else if(!tipo.trim()){
            setError({id:'tipo',dato:'El campo tipo esta vacio'})
            return
        }else if(!chofer.trim()){
            setError({id:'chofer',dato:'El campo chofer esta vacio'})
            return
        }
        const regcombi= {
            patente:patente,
            marca:marca,
            modelo:modelo,
            año:año,
            butaca:butaca,
            tipocombi:tipo
        }
        try {
            const data = await store.collection('combi').add(regcombi)
            alert('La combi se registro correctamente')
        } catch (e) {
            console.log(e)
        }
        
        
        setError({id:'',dato:null})
        setButaca('')
        setAño('')
        setModelo('')
        setMarca('')
        setPatente('')
        
    }

    const cancelar =(e) =>{
        e.preventDefault()
        setButaca('')
        setAño('')
        setModelo('')
        setMarca('')
        setPatente('')
        setModal(false)
    }

    const abrirModal = (e) => {
        e.preventDefault()
        setModal(!modal)
    }

    return (
        <div>
            <h3 className='Titulo mt-5'>Registrar Combi</h3>
            <div className = "row">
                 
                <div className = "col">
                   <form className ='form-group'>
                    <input 
                        onChange= {(e) => {setPatente(e.target.value)}} 
                        className='form-control mt-5' 
                        type="text" 
                        placeholder= 'Patente'  
                        value={patente}
                    />
                    <input 
                        onChange= {(e) => {setMarca(e.target.value)}} 
                        className='form-control mt-3'
                        type="text" 
                        placeholder='Marca'
                        value={marca}
                    />
                    <input 
                        onChange= {(e) => {setModelo(e.target.value)}} 
                        className='form-control mt-3' 
                        type="text" 
                        placeholder='Modelo'
                        value= {modelo}
                    />
                    <input 
                        onChange= {(e) => {setAño(e.target.value)}} 
                        className='form-control mt-3'
                        type="date" 
                        placeholder='Año'
                        value= {año}
                    />
                    <input 
                        onChange= {(e) => {setButaca(e.target.value)}} 
                        className='form-control mt-3' 
                        type="text" 
                        placeholder='Cantidad de Butacas'
                        value={butaca}
                    />
                    <select onChange={(e) => {setTipo(e.target.value)}} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                        <option selected id='Tipo'>Seleccione Tipo de Combi</option>
                        <option name='C'>Comoda</option>
                        <option name='Super Comoda'>Super Comoda</option>
                    </select>
                    <select onChange={(e) => {setChofer(e.target.value)}} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                        <option selected id='Opcion'>Seleccione un Chofer</option>
                        <option name='1'>Fabian Micieli</option>
                        <option name='2'>Juan Comun</option>
                        <option name='3'>Ruben Barroso</option>
                        <option name='4'>Jorge Calvo</option>
                        <option name='5'>Gimena Fernandez</option>
                        <option name='6'>Susana Ret</option>
                    </select>
                    <input onClick= {(e) => agregar(e)} className='btn btn-info btn-m mt-3' type="submit" value ='Registrar'/>
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
                        Desea cancelar la carga del registro Combi?
                </ModalBody>    
                <ModalFooter>
                    <Button onClick={(e) => cancelar(e)} color= "primary">Aceptar</Button>
                    <Button onClick={(e) => abrirModal(e)} color= "secondary">Cancelar</Button>
                </ModalFooter>   
            </Modal>
        </div>
    )
}

export default RegistrarCombi
