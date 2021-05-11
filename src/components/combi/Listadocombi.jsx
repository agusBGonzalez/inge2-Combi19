import React,{useState,useEffect} from 'react'
import {store} from '../firebaseconf'
import {Button,Modal,ModalHeader,ModalBody,ModalFooter,Table} from 'reactstrap' 



const Listadocombi = () => {
    const [error,setError] = useState({id:'',dato:null})
    const [idcombi,setIdCombi] = useState([])
    const [combis,setCombis] = useState([{}])
    const [modal,setModal] = useState(false)
    const [modal2,setModal2] = useState(false)
    const [patente, setPatente] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [año, setAño] = useState('')
    const [butaca, setButaca] = useState('')
    const [tipo,setTipo] = useState('')
    const [chofer,setChofer] = useState('')
    const [choferselect,setChoferSelect] = useState([{}])
    const [viaje, setViaje] = useState ([{}])

    useEffect(()=>{
        const datoschoferes = async() =>{
            const {docs} = await store.collection('choferselect').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setChoferSelect(nuevoArray)
            const r = await store.collection('viaje').get()
            const viajesArray = r.docs.map( item => ({id:item.id, ...item.data()}))
            setViaje(viajesArray)
        }
        datoschoferes()    
    },[])


        const getCombis = async () =>{
            const {docs} = await store.collection('combi').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setCombis(nuevoArray)
           
        }

    
    const borrarCombi = async (e) => {
        e.preventDefault()
        let encontre2 = false 
        viaje.map( itemviaje =>{
            combis.map (itemcombi =>{
                if(itemcombi.patente == itemviaje.combi){
                    setError({id:'repetido',dato:'La combi se encuentra en un viaje asignado'})
                    encontre2 = true 
                }
           })
        }) 
        if (encontre2){
            return
        }


        try {
            await store.collection('combi').doc(idcombi).delete()
            const {docs} = await store.collection('combi').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setCombis(nuevoArray)
        } catch (e) {
            console.log(e)
        }
        setModal2(false)
    }


    const setUpdate = async (e) =>{
        e.preventDefault()
        let aux = ''
        let encontre = false
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
        }else if(tipo === 'Seleccione Tipo de Combi'){
            setError({id:'tipo',dato:'El campo Tipo de Combi esta vacio'})
            return
        }else if(chofer === 'Seleccione un Chofer'){
            setError({id:'chofer',dato:'El campo chofer esta vacio'})
            return
        }combis.map(item =>{
            if(idcombi === item.id){

            }else if(patente === item.patente){
                    setError({id:'repetido',dato:'La patente ya se encuentra cargada'})
                    encontre = true
            }
 
        })
        
        if(encontre){
            return
        }
        const combiUpdate = {
            patente:patente,
            marca:marca,
            modelo:modelo,
            año:año,
            butaca:butaca,
            tipocombi:tipo,
            chofer:chofer
        }
        try {
            await store.collection('combi').doc(idcombi).set(combiUpdate)
            const {docs} = await store.collection('combi').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setCombis(nuevoArray)
        } catch (e) {
            console.log(e)
            
        }
        setPatente('')
        setModelo('')
        setMarca('')
        setAño('')
        setButaca('')
        setTipo('')
        setChofer('')
        setModal(false)
    }

    const actualizarCombi = async(idc) =>{
        try {
            store.collection('combi').onSnapshot(info => {
                info.forEach(doc => {
                    if(idc === doc.id){
                        setPatente(doc.data().patente)
                        setMarca(doc.data().marca)
                        setModelo(doc.data().modelo)
                        setAño(doc.data().año)
                        setButaca(doc.data().butaca)
                        setTipo(doc.data().tipocombi)
                        setChofer(doc.data().chofer)
                    }
                })
            })

            setModal(false)
        } catch (e) {
            console.log(e)
            
        }
    }


    const abrirModal = (e,idc) => {
        e.preventDefault()
        setIdCombi(idc)
        actualizarCombi(idc)
        setModal(!modal)
    }

    const abrirModalBorrar = (e,idc) => {
        e.preventDefault()
        setIdCombi(idc)
        setModal2(!modal2)
    }

    const cerrarModal2 = (e) => {
        e.preventDefault()
        setModal2(!modal2)
    }

    const cerrarModal = (e) => {
        e.preventDefault()
        setModal(!modal)
    }

    const cambiar = () =>{
        document.location.href = '/registroc'
    }

    return (
        <div>
            <h3>Listado de Combis</h3>
            <button onClick= {() =>getCombis()} className ="btn btn-info btn-m">Buscar</button>
            <button onClick= {()=> cambiar()} className ="btn btn-info btn-m ml-3">Agregar Combi</button>
            <Table>
                <thead>
                    <tr align='center'>
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
                                combis.length !== 1?
                                (
                                
                                    combis.map(item =>(
                                        <tr align='center' key = {item.id}> 
                                        <td>{item.patente} </td> 
                                        <td>{item.marca}</td> 
                                        <td>{item.modelo}</td> 
                                        <td>{item.año}</td>  
                                        <td>{item.butaca}</td>  
                                        <td>{item.tipocombi}</td> 
                                        <td>{item.chofer}</td> 
                                            <td>  
                                                <Button onClick = {(e,id) => {abrirModalBorrar(e,item.id)}} className = "btn btn-danger float-right">Borrar</Button>
                                                <Button onClick = {(e,id) => {abrirModal(e,item.id)}} className = "btn btn-info float-right mr-3">Modificar</Button>
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
                    <h4>Modificar Combi</h4>
                </ModalHeader>
                <ModalBody>
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
                    <select onChange={(e) => {setTipo(e.target.value)}} 
                    className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                        <option disabled="disabled" selected id='Tipo'>Seleccione Tipo de Combi</option>
                        <option name='C'>Comoda</option>
                        <option name='Super Comoda'>Super Comoda</option>
                    </select>
                    <select onChange={(e) => {setChofer(e.target.value)} } defaultValue= {1} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                    <option selected disabled="disabled" value='1'>Seleccione un Chofer</option>
                    {
                        choferselect.map( item => (
                            <option key ={item.id}>{item.apellido} {item.nombre}</option>
                        )
                        )
                      }
                    </select>
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
                    <h4>Borrar Combi</h4>
                </ModalHeader>
                <ModalBody>
                        Esta seguro/a de que desea borrar la combi?
                        {
                       error.dato  != null ?(
                            <div className="alert alert-danger">
                                {error.dato}
                            </div>                               
                       ):(<span></span>
                        )
                   }
                   
                </ModalBody>    
                <ModalFooter>
                    <Button onClick={(e) => borrarCombi(e)} color= "primary">Aceptar</Button>
                    <Button onClick={(e) => cerrarModal2(e)} color= "secondary">Cancelar</Button>
                </ModalFooter>   
            </Modal>
        </div>
        
    )
}

export default Listadocombi
