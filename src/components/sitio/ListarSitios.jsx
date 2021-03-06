import React, { useState, useEffect } from 'react'
import { store } from '../../firebaseconf'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap'

const ListarSitios = () => {
    // colecciones de firebase
    const [sitios, setSitios] = useState([])
    const [rutas, setRutas] = useState([])

    const [modal, setModal] = useState(false)
    const [sitio, setSitio] = useState('')
    const [provincia, setProvincia] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [error, setError] = useState({ id: '', dato: null })
    const [errorRutaAsignada, setErrorRutaAsignada] = useState({ id: '', dato: null })

    //useEffect(()=>{
    const getSitios = async () => {
        const { docs } = await store.collection('sitios').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setSitios(nuevoArray)
    }
    //  },[])
    const getRutas = async () => {
        const { docs } = await store.collection('rutasPruba').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setRutas(nuevoArray)
    }

    const borrarSitio = async (s) => {
        var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento ");
        var encontre = false
        if (opcion === true) {
            rutas.map(r => {
                // esto se hace asi si ruta tiene un objeto de tipo sitio, mañana lo modifico
                if (r.origen.provincia === s.provincia) {
                    if (r.origen.ciudad === s.ciudad) {
                        setErrorRutaAsignada({ id: 'provincia', dato: 'Este sitio no se puede borrar, ya que es el origen de una ruta, primero modifique la ruta' })
                        encontre = true
                    }
                }
                if (r.destino.provincia === s.provincia) {
                    if (r.destino.ciudad === s.ciudad) {
                        setErrorRutaAsignada({ id: 'provincia', dato: 'Este sitio no se puede borrar, ya que es el destino de una ruta, primero modifique la ruta' })
                        encontre = true
                    }
                }
                // quedaria if (r.origenProvincia== s.provicia )
            })
            if (encontre) {
                return
            }
            await store.collection('sitios').doc(s.id).delete()
            getSitios()
            alert('se elimino el sitio')
            setErrorRutaAsignada({ id: '', dato: null })

        }
    }

    const modificarSitio = async (s) => {
        var encontre = false
        var encontre2= false
        if (provincia === "") {
            setError({ id: 'provincia', dato: 'El campo provincia esta vacio' })
            return
        } else if (ciudad === "") {
            setError({ id: 'ciudad', dato: 'El campo ciudad esta vacio' })
            return
        }
        rutas.map(r => {
            // esto se hace asi si ruta tiene un objeto de tipo sitio, mañana lo modifico
            if (r.origen.provincia === s.provincia) {
                if (r.origen.ciudad === s.ciudad) {
                    setErrorRutaAsignada({ id: 'provincia', dato: 'Este sitio no se puede borrar, ya que es el origen de una ruta, primero modifique la ruta' })
                    encontre2 = true
                }
            }
            if (r.destino.provincia === s.provincia) {
                if (r.destino.ciudad === s.ciudad) {
                    setErrorRutaAsignada({ id: 'provincia', dato: 'Este sitio no se puede borrar, ya que es el destino de una ruta, primero modifique la ruta' })
                    encontre2 = true
                }
            }
            // quedaria if (r.origenProvincia== s.provicia )
        })

        sitios.map(s => {
            if (provincia === s.provincia) {
                if (ciudad === s.ciudad) {
                    setError({ id: 'nombre', dato: 'Este sitio ya se encuentra cargado' })
                    encontre = true
                }
            }
        })
        if (encontre) {
            return
        }
        if (encontre2) {
            return
        }
        const sitioRef = store.collection('sitios').doc(sitio.id);
        const res = await sitioRef.update({
            provincia: provincia,
            ciudad: ciudad
        })
        alert ('se modifico el sitio')
        setError({ id: '', dato: null })
        getSitios()
        setProvincia('')
        setCiudad('')
        setModal(false)
    }


    const cancelar = (e) => {
        e.preventDefault()
        setModal(false)
    }

    const abrirModal = (e, item) => {
        e.preventDefault()
        setSitio(item)
        setModal(!modal)
    }

    return (
        <div className="container px-10">
            <h3>LISTADOS</h3>
            <button /* style={{ display: "none" }} */ onClick={() => getSitios()}> Refrescar itios </button>
            <button /* style={{ display: "none" }} */ onClick={() => getRutas()}> Refrescar rutas </button>


            <Table>
                <thead>
                    <tr>
                        <th>Provincia</th>
                        <th>Ciudad</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sitios.length !== 0 ?
                            (
                                sitios.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.provincia}</td>
                                        <td>{item.ciudad}</td>
                                        <td>
                                            <Button color="primary" onClick={(e) => { abrirModal(e, item) }}>Modificar</Button>
                                            <Button color="danger" onClick={(id) => { borrarSitio(item) }}>borrar</Button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <div className="alert alert-warning mt-19"> No hay elementos en la lista </div>
                            )
                    }
                    {
                        errorRutaAsignada.dato != null ? (
                            <div className="alert alert-danger">
                                {errorRutaAsignada.dato}
                            </div>
                        ) : (<span></span>)
                    }
                </tbody>

            </Table>


            <Modal isOpen={modal}>
                <ModalHeader>
                    <h4>Modificar Sitio</h4>
                </ModalHeader>
                <ModalBody>
                    <form className='form-group'>
                        <select
                            value={provincia} onChange={(e) => { setProvincia(e.target.value) }}
                            className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
                            <option disabled="disabled" selected id='provincia'>Seleccione Provincia</option>
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
                        <input onChange={(e) => { setCiudad(e.target.value) }}
                            className='form-control mt-5'
                            type="text"
                            placeholder='ciudad'
                            id="ciudad"
                            value={ciudad}
                        />
                    </form>
                    {
                        error.dato != null ? (
                            <div className="alert alert-danger">
                                {error.dato}
                            </div>
                        ) : (<span></span>)
                    }
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => modificarSitio()} className="btn btn-danger float-right">Aceptar</Button>
                    <Button onClick={(e) => cancelar(e)} color="secondary">Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>

    )
}

export default ListarSitios
