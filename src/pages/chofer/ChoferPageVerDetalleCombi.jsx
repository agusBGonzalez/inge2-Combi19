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
        }

        auth.onAuthStateChanged((user) => {
            if (user) {
                setUsuario(user.email)
                setIdUsuarioLogueado(user.uid)
            }
        })




        datos()
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
                <Button style={{top: 105, position: 'absolute', right:70, width: "150px", height: "40px"}} onClick={confirmarFiltro} variant="secondary " > Cargar Datos</Button>

                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>
                <Alert id="danger" className="" variant="danger" show={showAlertDanger} onClick={handleCloseAlertDanger} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgDanger}
                </Alert>
                <div style={subPageStyle}>
                    <form className='form-group'>
                        <p>Patente:</p>
                        <input
                            className='form-control mt-2'
                            type="text"
                            placeholder={combi.patente}
                            id="origen"
                            value={combi.patente}
                            disabled
                        />
                        <p>Marca:</p>
                        <input
                            className='form-control mt-2'
                            type="text"
                            placeholder={combi.marca}
                            id="destino"
                            value={combi.marca}
                            disabled
                        />

                        <p>Modelo:</p>
                        <input
                            className='form-control mt-2'
                            type="data"
                            placeholder={combi.modelo}
                            id="fecha"
                            value={combi.modelo}
                            disabled
                        />

                        <p>Año:</p>
                        <input
                            className='form-control mt-2'
                            type="number"
                            placeholder={combi.año}
                            id="destino"
                            value={combi.año}
                            disabled
                        />

                        <p>Cantidad de butacas de la combi:</p>
                        <input
                            className='form-control mt-2'
                            type="data"
                            placeholder={combi.butaca}
                            id="fecha"
                            value={combi.butaca}
                            disabled
                        />

                        <p>Tipo de Combi:</p>
                        <input
                            className='form-control mt-2'
                            type="number"
                            placeholder={combi.tipocombi}
                            id="destino"
                            value={combi.tipocombi}
                            disabled
                        />

                    </form>
                </div>
            </div>
        </div>


    );
}

export default ChoferPageVerDetalleCombi;