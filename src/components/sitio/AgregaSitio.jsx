import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { store } from '../../firebaseconf'

const AgregarSitio = () => {
  const [provincia, setProvincia] = useState('')
  const [ciudad, setCiudad] = useState('')
const [sitios, setSitios] = useState ([])
  const [error, setError] = useState({ id: '', dato: null })
  const [errorRepetido, setErrorRepetido] = useState(null)
  const [modal, setModal] = useState(false)

  const agregar = async (e) => {
    e.preventDefault()
    var encontre = false
    const { docs } = await store.collection('sitios').get()
    const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
    setSitios(nuevoArray)
    if (!provincia.trim()) {
      setError({ id: 'provincia', dato: 'El campo provincia esta vacio' })
      return
    } else if (!ciudad.trim()) {
      setError({ id: 'ciudad', dato: 'El campo ciudad esta vacio' })
      return
    }
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


    const regSitio = {
      provincia: provincia,
      ciudad: ciudad
    }
    try {
      const data = await store.collection('sitios').add(regSitio)
      alert('el sitio se registro correctamente',)
    } catch (e) {
      console.log(e)
    }
    setError({ id: '', dato: null })
    setProvincia('')
    setCiudad('')

  }

  const cancelar = (e) => {
    e.preventDefault()
    setProvincia('')
    setCiudad('')
    setModal(false)
  }

  const abrirModal = (e) => {
    e.preventDefault()
    setModal(!modal)
  }

  return (
    <div>
      <h3 className='Titulo mt-5 px-100'>Registrar Sitio</h3>
      <div className="row">
        <div className="col"></div>
        <div className="col">
          <form className='form-group'>
            <select onChange={(e) => { setProvincia(e.target.value) }} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
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
              onChange={(e) => { setCiudad(e.target.value) }}
              className='form-control mt-5'
              type="text"
              placeholder='Ciudad'
              value={ciudad}
            />
            <input onClick={(e) => agregar(e)} className='btn btn-info btn-m mt-3' type="submit" value='Agregar' />
            <input onClick={(e) => abrirModal(e)} className='btn btn-info btn-m mt-3 ml-3' type="submit" value='Cancelar' />
          </form>
          {
            error.dato != null ? (
              <div className="alert alert-danger">
                {error.dato}
              </div>
            ) : (<span></span>)
          }
        </div>
        <div className="col"></div>
      </div>
      <Modal isOpen={modal}>
        <ModalHeader>
          <h4>Cancelar carga</h4>
        </ModalHeader>
        <ModalBody>
          Desea cancelar la carga del sitio?
        </ModalBody>
        <ModalFooter>
          <Button onClick={(e) => cancelar(e)} color="primary">Aceptar</Button>
          <Button onClick={(e) => abrirModal(e)} color="secondary">Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AgregarSitio