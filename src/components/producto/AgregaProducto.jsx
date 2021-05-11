import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { store } from '../../firebaseconf'


const AgregarProducto = () => {
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [precio, setPrecio] = useState('')
  const [error, setError] = useState({ id: '', dato: null })
  const [errorRepetido, setErrorRepetido] = useState(null)
  const [modal, setModal] = useState(false)

  const agregar = async (e) => {
    e.preventDefault()
    var encontre=false
    const { docs } = await store.collection('productos').get()
    const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
    setProductos(nuevoArray)
    if (!nombre.trim()) {
      setError({ id: 'nombre', dato: 'El campo nombre esta vacio' })
      return
    } else if (!tipo.trim()) {
      setError({ id: 'tipo', dato: 'El campo tipo esta vacio' })
      return
    } else if (!precio.trim()) {
      setError({ id: 'precio', dato: 'El campo precio esta vacio' })
      return
    } 
    productos.map(prod =>{
      if(nombre === prod.nombre){
        setError({ id: 'nombre', dato: 'El campo nombre esta repetido' })
        encontre = true
      }
    })
    if (encontre){
        return
    }

    const regProducto = {
      nombre: nombre,
      tipo: tipo,
      precio: precio
    }
    try {
      const data = await store.collection('productos').add(regProducto)
      alert('El producto se registro correctamente')
    } catch (e) {
      console.log(e)
    }
    setError({ id: '', dato: null })
    setNombre('')
    setTipo('')
    setPrecio('')


  }

  const cancelar = (e) => {
    e.preventDefault()
    setNombre('')
    setTipo('')
    setPrecio('')
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
            <input
              onChange={(e) => { setNombre(e.target.value) }}
              className='form-control mt-5'
              type="text"
              placeholder='nombre'
              value={nombre}
            />
            <select onChange={(e) => { setTipo(e.target.value) }} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
              <option selected id='provincia'>Seleccione Tipo</option>
              <option value="Dulce">Dulce</option>
              <option value="Salado">Salado</option>
              <option value="Agridulce">Agridulce</option>
            </select>
            <input
              onChange={(e) => { setPrecio(e.target.value) }}
              className='form-control mt-5'
              type="number"
              placeholder='precio'
              value={precio}
            />
            <input onClick={(e) => agregar(e)} className='btn btn-info btn-m mt-3' type="submit" value='Registrar' />
            <input onClick={(e) => abrirModal(e)} className='btn btn-info btn-m mt-3 ml-3' type="submit" value='Cancelar' />
          </form>
          {
            error.dato != null ? (
              <div className="alert alert-danger">
                {error.dato}
              </div>
            ) : (<div></div>)
          }
          {
            errorRepetido != null ? (
              { errorRepetido }
            ) : (<div></div>)
          }
        </div>
        <div className="col"></div>
      </div>
      <Modal isOpen={modal}>
        <ModalHeader>
          <h4>Cancelar carga</h4>
        </ModalHeader>
        <ModalBody>
          Desea cancelar la carga del producto?
        </ModalBody>
        <ModalFooter>
          <Button onClick={(e) => cancelar(e)} color="primary">Aceptar</Button>
          <Button onClick={(e) => abrirModal(e)} color="secondary">Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AgregarProducto