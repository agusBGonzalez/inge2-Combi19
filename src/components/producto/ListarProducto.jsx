// import React, { useState, useEffect } from 'react'
// import { store } from '../../firebaseconf'
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap'

// const ListarProductos = () => {


//     const [productos, setProductos] = useState([])
//     const [modal, setModal] = useState(false)
//     const [prod, setProd] = useState('')
//     const [nombre, setNombre] = useState('')
//     const [tipo, setTipo] = useState('')
//     const [precio, setPrecio] = useState('')
//     const [error, setError] = useState({ id: '', dato: null })

//     //useEffect(()=>{
//     const getProductos = async () => {
//         const { docs } = await store.collection('productos').get()
//         const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
//         setProductos(nuevoArray)
//     }
//     //  },[])

//     const borrarProducto = async (id) => {
//         var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento ");
//         if (opcion === true) {
//             try {

//                 await store.collection('productos').doc(id).delete()
//                 const { docs } = await store.collection('productos').get()
//                 const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
//                 setProductos(nuevoArray)
//             } catch (e) {
//                 console.log(e)
//             }
//         }
//     }

//     const modificarProducto = async () => {
//         var encontre = false
//         if (nombre === "") {
//             setError({ id: 'nombre', dato: 'El campo nombre esta vacio' })
//             return
//           } else if (tipo === "") {
//             setError({ id: 'tipo', dato: 'El campo tipo esta vacio' })
//             return
//           } else if (precio === "") {
//             setError({ id: 'precio', dato: 'El campo precio esta vacio' })
//             return
//           }
//           productos.map(prod =>{
//             if(nombre === prod.nombre){
//               setError({ id: 'nombre', dato: 'El campo nombre esta repetido' })
//               encontre = true
//             }
//           })
//           if (encontre){
//               return
//           }

//         const sitioRef = store.collection('productos').
//             doc(prod.id).
//             update({
//                 nombre: nombre,
//                 tipo: tipo,
//                 precio: precio
//             });
            
//         setError({ id: '', dato: null })
//         getProductos()
//         setNombre()
//         setTipo()
//         setPrecio()
//         setModal(false)
//     }

//     const cancelar = (e) => {
//         e.preventDefault()
//         setModal(false)
//     }

//     const abrirModal = (e, item) => {
//         e.preventDefault()
//         setProd(item)
//         setModal(!modal)
//     }
//     var ok = true
//     const automaticamente = () => {
//         if (ok) {
//             getProductos()
//             ok = false
//         }
//     }
//     return (
//         <div className="container px-10">
//             <h3>LISTADOS</h3>
//             <button
//                 //style={{ display: "none" }}
//                 onClick={ () => getProductos()}> Refrescar </button>
//             <Table>
//                 <thead>
//                     <tr>
//                         <th>Nombre</th>
//                         <th>Tipo</th>
//                         <th>Precio</th>
//                         <th>Acción</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         productos.length !== 0 ?
//                             (
//                                 productos.map(item => (
//                                     <tr key={item.id}>
//                                         <td>{item.nombre}</td>
//                                         <td>{item.tipo}</td>
//                                         <td>{item.precio}</td>
//                                         <td>
//                                             <Button color="primary" onClick={(e) => { abrirModal(e, item) }}>Modificar</Button>
//                                             <Button color="danger" onClick={(id) => { borrarProducto(item.id) }}>borrar</Button>
//                                         </td>

//                                     </tr>
//                                 ))
//                             ) : (
//                                 <div className="alert alert-warning mt-19"> No hay elementos en la lista </div>
//                             )
//                     }
//                 </tbody>

//             </Table>
//             <Modal isOpen={modal}>
//                 <ModalHeader>
//                     <h4>Modificar Productos</h4>
//                 </ModalHeader>
//                 <ModalBody>
//                     <form className='form-group'>
//                         <input
//                             onChange={(e) => { setNombre(e.target.value) }}
//                             className='form-control mt-5'
//                             type="text"
//                             placeholder='nombre'
//                             value={nombre}
//                         />
//                         <select onChange={(e) => { setTipo(e.target.value) }} className="form-control form-select-lg mt-3" aria-label=".form-select-lg example">
//                             <option selected id='tipo'>Seleccione Tipo</option>
//                             <option value="Dulce">Dulce</option>
//                             <option value="Salado">Salado</option>
//                             <option value="Agridulce">Agridulce</option>
//                         </select>
//                         <input
//                             onChange={(e) => { setPrecio(e.target.value) }}
//                             className='form-control mt-5'
//                             type="number"
//                             placeholder='precio'
//                             value={precio}
//                         />
//                     </form>
//                     {
//                         error.dato != null ? (
//                             <div className="alert alert-danger">
//                                 {error.dato}
//                             </div>
//                         ) : (<span></span>)
//                     }
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button onClick={() => modificarProducto()} className="btn btn-danger float-right">Aceptar</Button>
//                     <Button onClick={(e) => cancelar(e)} color="secondary">Cancelar</Button>
//                 </ModalFooter>
//             </Modal>
//         </div>

//     )
// }


// export default ListarProductos

