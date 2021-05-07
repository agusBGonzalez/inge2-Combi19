import React, { useState, useEffect } from 'react'
import { store } from '../../firebaseconf'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const ListarSitios = () => {

    const [sitios, setSitios] = useState([])
    const [modal, setModal] = useState(false)


    //useEffect(()=>{
    const getSitios = async () => {
        const { docs } = await store.collection('sitios').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setSitios(nuevoArray)
    }
    //  },[])

    const borrarSitio = async (id) => {
        try {
            await store.collection('sitios').doc(id).delete()
            const { docs } = await store.collection('sitios').get()
            const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setSitios(nuevoArray)
        } catch (e) {
            console.log(e)
        }
    }

    const modificarSitio = async (id) => {
        try {
            const data = await store.collection('sitio').doc(id).get()
        } catch (e) {
            console.log(e)
        }
    }


    const cancelar = (e) => {
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
            <button onClick={() => getSitios()} className="btn btn-info btn-m">Refrescar</button>
            <ul className="list-group">
                {
                    sitios.length !== 0 ?
                        (
                            sitios.map(item => (
                                <li className="list-group-item" key={item.id}> {item.provincia} -- {item.ciudad}
                                    <button onClick={(id) => { borrarSitio(item.id) }} className="btn btn-danger float-right">Borrar</button>
                                    <button onClick={(e) => { abrirModal(e) }} className="btn btn-info float-right mr-3">Modificar</button>
                                </li>

                            ))

                        ) : (
                            <div></div>
                        )
                }
            </ul>
            <Modal isOpen={modal}>
                <ModalHeader>
                    <h4>Modificar Combi</h4>
                </ModalHeader>
                <ModalBody>
                    <form className='form-group'>
                        <select //onChange={(e) => {setTipo(e.target.value)}} 
                            className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                            <option selected id='provincia'>Seleccione Provincia</option>
                            <option value="Buenos Aires">Buenos Aires</option>
                            <option value="Catamarca">Catamarca</option>
                            <option value="Chaco">Chaco</option>
                            <option value="Chubut">Chubut</option>
                            <option value="Córdoba">Córdoba</option>
                            <option value="Corrientes">Corrientes</option>
                            <option value="Entre Ríos">Entre Ríos</option>
                            <option value="Formosa">Formosa</option>
                            <option value="Jujuy">Jujuy</option>
                            <option value="La Pampa">La Pampa</option>
                            <option value="La Rioja">La Rioja</option>
                            <option value="Mendoza">Mendoza</option>
                            <option value="Misiones">Misiones</option>
                            <option value="Neuquén">Neuquén</option>
                            <option value="Río Negro">Río Negro</option>
                            <option value="Salta">Salta</option>
                            <option value="San Juan">San Juan</option>
                            <option value="San Luis">San Luis</option>
                            <option value="Santa Cruz">Santa Cruz</option>
                            <option value="Santa Fe">Santa Fe</option>
                            <option value="Santiago del Estero">Santiago del Estero</option>
                            <option value="Tierra del Fuego, Antártida e Isla del Atlántico Sur">Tierra del Fuego, Antártida e Isla del Atlántico Sur</option>
                            <option value="Tucumán">Tucumán</option>
                        </select>
                        <input
                            //onChange= {(e) => {setPatente(e.target.value)}} 
                            className='form-control mt-5'
                            type="text"
                            placeholder='Sitio'
                        //value={patente}
                        />
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={(e) => modificarSitio(e)} className="btn btn-danger float-right">Aceptar</Button>
                    <Button onClick={(e) => abrirModal(e)} color="secondary">Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>

    )
}

export default ListarSitios
