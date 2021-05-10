import React, {useState,useEffect} from 'react'
import {Button,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap' 
import {store} from '../firebaseconf'

const RegistrarCombi = () => {
    const [repetido,setRepetido] = useState ([{}])
    const [patente, setPatente] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [año, setAño] = useState('')
    const [butaca, setButaca] = useState('')
    const [tipo,setTipo] = useState('')
    const [choferselect,setChoferSelect] = useState([{}])
    const [chofer,setChofer] = useState('')
    const [error,setError] = useState({id:'',dato:null})
    const [modal,setModal] = useState(false)
    
 
    useEffect(()=>{
        const datoschoferes = async() =>{
            const {docs} = await store.collection('choferselect').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setChoferSelect(nuevoArray)
            const r = await store.collection('combi').get()
            const nuevoArray2 = r.docs.map( item => ({id:item.id, ...item.data()}))
            setRepetido(nuevoArray2)
        }
        datoschoferes()    
    },[])    

    const agregar = async (e)=>{
        let encontre = false
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
            repetido.map(item =>{
            if(patente === item.patente){
                setError({id:'repetido',dato:'La patente ya se encuentra cargada'})
                encontre = true
            }
        })
        
        if(encontre){
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
        try {
            const data = await store.collection('combi').add(regcombi)
            const {docs} = await store.collection('combi').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setRepetido(nuevoArray)
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
                    <select onChange={(e) => {setAño(e.target.value)}} defaultValue='Tipo' className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                        <option selected disabled="disabled" value='Tipo'>Seleccione un Año</option>
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
                    <input 
                        onChange= {(e) => {setButaca(e.target.value)}} 
                        className='form-control mt-3' 
                        type="text" 
                        placeholder='Cantidad de Butacas'
                        value={butaca}
                    />
                    <select onChange={(e) => {setTipo(e.target.value)}} defaultValue='Tipo' className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                        <option selected disabled="disabled" value='Tipo'>Seleccione Tipo de Combi</option>
                        <option value='Comoda'>Comoda</option>
                        <option value='Super Comoda'>Super Comoda</option>
                    </select>
                    <select onChange={(e) => {setChofer(e.target.value)}} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                    <option selected disabled="disabled" name='1'>Seleccione un Chofer</option>
                    {
                        choferselect.map( item => (
                            <option name ={item.id}>{item.apellido} {item.nombre}</option>
                        )
                        )
                      }
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
