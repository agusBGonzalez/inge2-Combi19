import React,{useState, useEffect} from 'react'
import MenuUsuario from '../components/menus/MenuUsuario'
import MenuOpcAdmin from '../components/menus/MenuOpcAdmin'
import {Table, Modal, Button, Alert} from 'react-bootstrap'
import { store } from '../firebaseconf'
import AgregarSitio from '../components/sitio/AgregaSitio'


function AdminSitiosPage() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'
        
    };

    //MODAL ELIMINAR
    const [showModal, setShowModal] = useState(false);
    const [sitioEliminar, setSitioEliminar] = useState('');
    const handleClose = () => setShowModal(false);

    //ALERT
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

    const [msgError, setMsgError] = useState (null)


    //MODAL REGISTRAR / MODIFICAR
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [sitioEditar, setSitioEditar] = useState('');
    const [esEditar, setEsEditar] = useState(false);
    const [esSitioRepetido, setEsSitioRepetido] = useState(false);
    const handleCloseEdit = () => setShowModalEdit(false);


    const [sitios, setSitios] = useState([])
    const [modal, setModal] = useState(false)
    
    const [provincia, setProvincia] = useState('')
    const [ciudad, setCiudad] = useState('')
    


    const getSitios =  () => {
        const { docs } = store.collection('sitios').get()
            .then
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setSitios(nuevoArray)
        console.log(nuevoArray)
    }    
 

    //CARGA LA LISTA CUANDO SE CARGA EL COMPONENTE
    useEffect(() => {
        store.collection('sitios').get()
        .then(response => {
            const fetchedSitios = [];
            response.docs.forEach(document => {
            const fetchedSitio = {
                id: document.id,
                ...document.data()
            };
            fetchedSitios.push(fetchedSitio)
            });
            setSitios(fetchedSitios)
        })
        .catch(error => {
            setMsgError(error)
            setShowAlert(true)
        });
    }, []);    

    const borrarSitio = async (id) => {
        setSitioEliminar(id)
        setShowModal(true);
    }    

    const confirmarEliminacion = async () => {
        const { docs } = await store.collection('sitios').get()
        const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        setSitios(nuevoArray)
        await store.collection('sitios').doc(sitioEliminar).delete()
        getSitios()
        alert('se elimino el sitio')

    }
    

    const crearModificarSitio = (oper, item) =>{

        (oper === 'A') ? setEsEditar(false) : setEsEditar(true)
        if (esEditar) {
            setSitioEditar(item.id)
            setProvincia(item.provincia)
            setCiudad(item.ciudad)
        } else {
            setSitioEditar('')
            setProvincia('')
            setCiudad('') 
        }
        setShowModalEdit(true);
    }


    const confirmarEdicion = async (e) => {
        e.preventDefault()

        if (provincia === "") {
            setMsgError('El campo provincia esta vacio' )
            setShowAlert(true)
            return
        }
        if (ciudad === "") {
            setMsgError('El campo ciudad esta vacio')
            setShowAlert(true)
            return
        }

        store.collection('sitios').where("provincia", "==", provincia)
            .get()
            .then((querySnapshot) => {
                let datosRepetidos = false
                querySnapshot.forEach((doc) => {
                    //COMO FILTRO POR PROVINCIA, QUEDA CHEQUEAR QUE NO HAYA UNA CIUDAD IGUAL
                    const nomCuidad = doc.data().ciudad
                    console.log(nomCuidad)   
                    console.log(ciudad)             
                    if (nomCuidad === ciudad) {
                        datosRepetidos = true
                    }
                });
                setEsSitioRepetido(datosRepetidos)                               
            })
        
        if (esSitioRepetido) {
            setMsgError('Este sitio ya se encuentra cargado')
            setShowAlert(true)
            return
        }

        const sitioAct = {
            ciudad: ciudad,
            provincia: provincia
        }
        
        if (esEditar){
            try{
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('sitios').doc(sitioEditar).set(sitioAct)
            } catch (err) {
                console.log(err)
                setMsgError(err)
                setShowAlert(true)
            }

        } else {
            try{
                //FALTA MOSTRAR MSJ DE SUCESS
                await store.collection('sitios').add(sitioAct)
            } catch (err) {
                console.log(err)
                setMsgError(err)
                setShowAlert(true)
            }
            

        }


        // const { docs } = await store.collection('sitios').get()
        // const nuevoArray = docs.map(item => ({ id: item.id, ...item.data() }))
        // setSitios(nuevoArray)
        // await store.collection('sitios').doc(sitioEliminar).delete()
        // getSitios()
        // alert('se elimino el sitio')

    }

    

    const modificarSitio = async () => {
            var encontre = false
            if (provincia === "") {
                setMsgError( 'El campo provincia esta vacio' )
                return
            } else if (ciudad === "") {
                setMsgError('El campo ciudad esta vacio' )
                return
            }
            sitios.map(s => {
                if (provincia === s.provincia) {
                    if (ciudad === s.ciudad) {
                        setMsgError('Este sitio ya se encuentra cargado')
                        encontre = true
                    }
                }
            })
            if (encontre) {
                return
            }

        const sitioRef = store.collection('sitios').doc(sitioEditar).set();
        const res = await sitioRef.update({
            provincia: provincia,
            ciudad: ciudad
        });

        setMsgError(null )
        getSitios()
        setProvincia('')
        setCiudad('')
        setModal(false)
    }

    
  
    return (
      <div>
        <MenuUsuario/>
        <MenuOpcAdmin/>
        <div>
            <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Listado de Sitios</h3>
            <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} onClick={(e) => { crearModificarSitio('A', '') }} variant="secondary " > + Agregar Sitio</Button>
            
            <div style={subPageStyle}>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Provincia</th>
                            <th>Ciudad</th>
                            <th>Acciones</th>
                            <th></th>
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
                                                <button className="btn btn-primary " onClick={(e) => { crearModificarSitio('E', item) }}>Modificar</button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger md-3 float-right" onClick={(id) => {borrarSitio(item.id) }}>Borrar</button>
                                            </td>
    
                                        </tr>
                                    ))
                                ) : (
                                    <></>
                                )
                        }
                    </tbody>
                </Table>
                {
                    sitios.length === 0 ? <div className="alert alert-warning mt-19"> No hay elementos en la lista </div> : <div></div>
                }
            </div>
        </div>
        <Modal id="modalEliminar" show={showModal} onHide={handleClose}>
			<Modal.Header >
				<Modal.Title>Eliminación de Sitio</Modal.Title>
			</Modal.Header>
			<Modal.Body>¿Está seguro que desea eliminar el sitio seleccionado?</Modal.Body>
			<Modal.Footer>
                <Button variant="primary" onClick={confirmarEliminacion}>
					Confirmar
				</Button>
				<Button variant="secondary" onClick={handleClose}>
					Cancelar
				</Button>
			</Modal.Footer>
      	</Modal>
        {
            showModalEdit ?
            (
                <Modal id="modalEditar" show={showModalEdit} onHide={handleCloseEdit}>
                    <Modal.Header >
                        <Modal.Title>{esEditar ? "Editar Sitio" : "Agregar Sitio" }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                        <Alert className="mt-4" variant="danger" show={showAlert}>
					        {msgError}
				        </Alert>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={confirmarEdicion}>
                            Confirmar
                        </Button>
                        <Button variant="secondary" onClick={handleCloseEdit}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <></>
            )
                            
        }  
      </div>

    );
}
  
  export default AdminSitiosPage;