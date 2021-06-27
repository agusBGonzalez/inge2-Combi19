import React, { useState, useEffect } from 'react'
import MenuUsuarioChofer from '../../components/menus/MenuUsuarioChofer'
import MenuOpcChofer from '../../components/menus/MenuOpcChofer'
import { Table, Modal, Button, Alert } from 'react-bootstrap'
import { store, auth } from '../../firebaseconf'



function ChoferPageVerDetalleCombi() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "77%",
        overflowY: 'scroll'

    };


    //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);

    const [showAlert2, setShowAlert2] = useState(false);

    const [msgError, setMsgError] = useState(null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    const [msgSucc, setMsgSucc] = useState(null)

    //ALERT DANGER
    const [showAlertDanger, setShowAlertDanger] = useState(false)
    const handleCloseAlertDanger = () => setShowAlertDanger(false)

    const [msgDanger, setMsgDanger] = useState(null)

    //MODAL REGISTRAR / MODIFICAR
    const [showModalFiltar, setShowModalFiltar] = useState(false)
    const handleCloseFlitrar = () => showModalFiltar(false)

    const [estado, setEstado] = useState('')

    // select
    var hoy = new Date().toLocaleDateString()

    // colecciones de firebase
    const [viajes, setViajes] = useState([])
    const [combis, setCombis] = useState([])

    const [combi, setCombi] = useState('')
    const [patente, setPatente] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [anio, setAnio] = useState('')
    const [cantButa, setCantButa] = useState('')
    const [tipo, setTipo] = useState('')

    const [idUsuarioLogueado, setIdUsuarioLogueado] = useState('')
    const [userConfig, setUserConfig] = useState([])

    const [usuario, setUsuario] = useState('')
    const [esAdmin, setEsAdmin] = useState(false)
    const [esUsuarioLog, setEsUsuarioLog] = useState(false)



    const getViajes = () => {
        store.collection('viaje').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
                setViajes(fetchedViajes)
            })
    }
    const getCombis = () => {
        store.collection('combi').get()
            .then(response => {
                const fetchedCombis = [];
                response.docs.forEach(document => {
                    const fetchedCombi = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedCombis.push(fetchedCombi)
                });
                setCombis(fetchedCombis)
        })
    }



    useEffect(() => {
        const datos = async () => {
            const { docs } = await store.collection('usuariosConfig').get()
            const userArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setUserConfig(userArray)

            auth.onAuthStateChanged((user) => {
                if (user) {
                    setUsuario(user.email)
                    setIdUsuarioLogueado(user.uid)
                }
            })
        }

        
        getViajes()
        getCombis()
        datos()

        // no tocar hasta la demo
        store.collection('viaje').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)

                    store.collection('combi').get()
                        .then(response => {
                            const fetchedCombis = [];
                            response.docs.forEach(document => {
                                const fetchedCombi = {
                                    id: document.id,
                                    ...document.data()
                                };
                                fetchedCombis.push(fetchedCombi)

                                fetchedViajes.map(v=>{
                                    fetchedCombis.map(c=>{
                                        auth.onAuthStateChanged((user) => {
                                            if (user) {
                                                console.log(user.uid)
                                                if (v.idCombi === c.id){
                                                    console.log("pregunta222")
                                                    if(c.idChofer === user.uid){
                                                        setCombi(c)
                                                        setPatente(c.patente)
                                                        setMarca(c.marca)
                                                        setModelo(c.modelo)
                                                        setAnio(c.año)
                                                        setCantButa(c.butaca)
                                                        setTipo(c.tipocombi)
                                                        console.log("pregunta")
                                                    }
                                                }
                                            }
                                        })
                                        
                                    })
                                })

                            });
                        
                    })
                });
                
        })
        // no tocar

        
       

        store.collection('viajeChofer').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
            })
            .catch(error => {
                setMsgError(error)
                setShowAlert(true)
            });

    }, []);


    const confirmarFiltro = () => {
        getViajes()
        getCombis()
        console.log(idUsuarioLogueado)
        // recorro los viajes
        // console.log("antes del primer map")
        viajes.map(v=>{

            combis.map(c=>{
                if (v.idCombi === c.id){
                    console.log(c.idChofer)
                    if(c.idChofer === idUsuarioLogueado){
                        setCombi(c)
                    }
                }
            })
            
            
        })
        try {
            //FALTA MOSTRAR MSJ DE SUCESS
            setShowModalFiltar(false)
        } catch (err) {
            console.log(err)
            setMsgError(err)
            setShowAlert(true)
        }
    }

    return (
        <div>
            <MenuUsuarioChofer />
            <MenuOpcChofer optionName="choferMiCombi" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}> Detalles de Mi Combi</h3>
                <div style={subPageStyle}>
                    <form className='form-group'>
                        <p>Patente:</p>
                        <input
                            className='form-control mt-2'
                            type="text"
                            id="origen"
                            value={patente}
                            disabled
                        />
                        <p>Marca:</p>
                        <input
                            className='form-control mt-2'
                            type="text"
                            id="destino"
                            value={marca}
                            disabled
                        />

                        <p>Modelo:</p>
                        <input
                            className='form-control mt-2'
                            type="text"
                            id="fecha"
                            value={modelo}
                            disabled
                        />

                        <p>Año:</p>
                        <input
                            className='form-control mt-2'
                            type="number"
                            id="destino"
                            value={anio}
                            disabled
                        />

                        <p>Cantidad de butacas de la combi:</p>
                        <input
                            className='form-control mt-2'
                            type="text"
                            id="fecha"
                            value={cantButa}
                            disabled
                        />

                        <p>Tipo de Combi:</p>
                        <input
                            className='form-control mt-2'
                            type="text"
                            id="destino"
                            value={tipo}
                            disabled
                        />

                    </form>
                </div>
            </div>
        </div>


    );
}

export default ChoferPageVerDetalleCombi;