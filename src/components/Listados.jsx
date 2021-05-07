import React,{useState,useEffect} from 'react'
import {store} from '../firebaseconf'
import {Button,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap' 

const Listados = () => {
    
    const[combis,setCombis] = useState([])
    const [modal,setModal] = useState(false)


    //useEffect(()=>{
        const getCombis = async () =>{
            const {docs} = await store.collection('combi').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setCombis(nuevoArray)
        }
 //  },[])
    
    const borrarCombi = async (id) => {
        try {
            await store.collection('combi').doc(id).delete()
            const {docs} = await store.collection('combi').get()
            const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
            setCombis(nuevoArray)
        } catch (e) {
            console.log(e)
        }
    }
    
    const modificarCombi = async (id) =>{
        try {
            const data = await store.collection('combi').doc(id).get()
        } catch (e) {
            console.log(e)
        }
    }


    const cancelar =(e) =>{
        e.preventDefault()
        setModal(false)
    }

    const abrirModal = (e) => {
        e.preventDefault()
        setModal(!modal)
    }


    return (
        <div>
            <h3>LISTADOS</h3>
            <button onClick= {() =>getCombis()} className ="btn btn-info btn-m">Buscar</button>
            <ul className = "list-group">
            {
                combis.length !== 0 ?
                (
                
                    combis.map(item =>(
                        <li className = "list-group-item" key = {item.id}> {item.patente} -- {item.marca} -- {item.modelo} -- {item.año} -- {item.butaca} -- {item.tipocombi}  
                            <button onClick = {(id) => {borrarCombi(item.id)}} className = "btn btn-danger float-right">Borrar</button>
                            <button onClick = {(e) => {abrirModal(e)}} className = "btn btn-info float-right mr-3">Modificar</button>
                        </li>
                        
                    )) 
                       
                ):(
                    <div></div>
                )
            }
            </ul>
            <Modal isOpen={modal}>
                <ModalHeader>
                    <h4>Modificar Combi</h4>
                </ModalHeader>
                <ModalBody>
                <form className ='form-group'>
                    <input 
                        //onChange= {(e) => {setPatente(e.target.value)}} 
                        className='form-control mt-5' 
                        type="text" 
                        placeholder= 'Patente'  
                        //value={patente}
                    />
                    <input 
                        //onChange= {(e) => {setMarca(e.target.value)}} 
                        className='form-control mt-3'
                        type="text" 
                        placeholder='Marca'
                        //value={marca}
                    />
                    <input 
                        //onChange= {(e) => {setModelo(e.target.value)}} 
                        className='form-control mt-3' 
                        type="text" 
                        placeholder='Modelo'
                        //value= {modelo}
                    />
                    <input 
                        //onChange= {(e) => {setAño(e.target.value)}} 
                        className='form-control mt-3'
                        type="date" 
                        placeholder='Año'
                        //value= {año}
                    />
                    <input 
                        //onChange= {(e) => {setButaca(e.target.value)}} 
                        className='form-control mt-3' 
                        type="text" 
                        placeholder='Cantidad de Butacas'
                        //value={butaca}
                    />
                    <select //onChange={(e) => {setTipo(e.target.value)}} 
                    className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                        <option selected id='Tipo'>Seleccione Tipo de Combi</option>
                        <option name='C'>Comoda</option>
                        <option name='Super Comoda'>Super Comoda</option>
                    </select>
                    <select //onChange={(e) => {setChofer(e.target.value)}} 
                    className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                        <option selected id='Opcion'>Seleccione un Chofer</option>
                        <option name='1'>Fabian Micieli</option>
                        <option name='2'>Juan Comun</option>
                        <option name='3'>Ruben Barroso</option>
                        <option name='4'>Jorge Calvo</option>
                        <option name='5'>Gimena Fernandez</option>
                        <option name='6'>Susana Ret</option>
                    </select>
                </form>
                </ModalBody>    
                <ModalFooter>
                    <Button onClick = {(e)=> cancelar(e)} className = "btn btn-danger float-right">Aceptar</Button>
                    <Button onClick={(e) => abrirModal(e)} color= "secondary">Cancelar</Button>
                </ModalFooter>   
            </Modal>
        </div>
        
    )
}

export default Listados
