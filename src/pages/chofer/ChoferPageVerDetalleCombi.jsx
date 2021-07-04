import React, { useState, useEffect } from 'react'
import MenuUsuarioChofer from '../../components/menus/MenuUsuarioChofer'
import MenuOpcChofer from '../../components/menus/MenuOpcChofer'
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


    // //ALERT ERROR
    // const [showAlert, setShowAlert] = useState(false);

    // const [showAlert2, setShowAlert2] = useState(false);

    // const [msgError, setMsgError] = useState(null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)

    // const [msgSucc, setMsgSucc] = useState(null)

    //ALERT DANGER
    const [showAlertDanger, setShowAlertDanger] = useState(false)
    const handleCloseAlertDanger = () => setShowAlertDanger(false)

    // const [msgDanger, setMsgDanger] = useState(null)

    //MODAL REGISTRAR / MODIFICAR
    const [showModalFiltar, setShowModalFiltar] = useState(false)
    // const handleCloseFlitrar = () => showModalFiltar(false)

    // const [estado, setEstado] = useState('')

    // select
    // var hoy = new Date().toLocaleDateString()

    // colecciones de firebase
    const [choferes, setChoferes] = useState([])
    const [combis, setCombis] = useState([])

    const [combi, setCombi] = useState('')
    const [patente, setPatente] = useState('')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [anio, setAnio] = useState('')
    const [cantButa, setCantButa] = useState('')
    const [tipo, setTipo] = useState('')
    const [tieneCombiAsignada, setTieneCombiAsignada] = useState(false)


    const [idUsuarioLogueado, setIdUsuarioLogueado] = useState('')
    const [userConfig, setUserConfig] = useState([])

    const [usuario, setUsuario] = useState('')



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

    const getChoferes = () => {
        store.collection('choferes').get()
            .then(response => {
                const fetchedChoferes = [];
                response.docs.forEach(document => {
                    const fetchedChofer = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedChoferes.push(fetchedChofer)
                });
                setChoferes(fetchedChoferes)
            })
    }



    useEffect(() => {
        const datos = async () => {
            const { docs } = await store.collection('usuariosConfig').get()
            const userArray = docs.map(item => ({ id: item.id, ...item.data() }))
            setUserConfig(userArray)

            auth.onAuthStateChanged( async (user) => {
                if (user) {
                    setUsuario(user.email)
                    setIdUsuarioLogueado(user.uid)

                    // no tocar hasta la demo
                    const chof = await store.collection('choferes').get()
                    const choferesFirebase = chof.docs.map(item => ({ id: item.id, ...item.data() }))

                    const choferLogueado = choferesFirebase.find((chofer) => {
                        return user.uid === chofer.idUser
                    })


                    const comb = await store.collection('combi').get()
                    const combisFirebase = comb.docs.map(item => ({ id: item.id, ...item.data() }))

                    //console.log(combisFirebase)

                    combisFirebase.map(c => {
                        if (c.idChofer === choferLogueado.id) {
                            setTieneCombiAsignada(true)
                            setCombi(c)
                            setPatente(c.patente)
                            setMarca(c.marca)
                            setModelo(c.modelo)
                            setAnio(c.año)
                            setCantButa(c.butaca)
                            setTipo(c.tipocombi)
                        }
                    })

                       // no tocar
                }
            })


        }

        getChoferes()
        getCombis()
        datos()



    }, []);


    return (
        <div>
            <MenuUsuarioChofer />
            <MenuOpcChofer optionName="choferMiCombi" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}> Detalles de Mi Combi</h3>
                <div style={subPageStyle}>
                    {
                        tieneCombiAsignada ?

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
                            :
                            <div>
                                <br />
                                <br />
                                <h5>Uups algo salió mal!</h5>
                                <label> Aún no contamos con la información de su combi!
                                    Aquí podrá ver los detalles de la misma, una vez que se le asigne una nueva. En caso de error comunicarse con el Administrador, muchas gracias!
                                </label>
                            </div>
                    }
                </div>
            </div>
        </div>


    );
}

export default ChoferPageVerDetalleCombi;