import React, { useState, useEffect } from 'react'
import MenuUsuarioChofer from '../../components/menus/MenuUsuarioChofer'
import MenuOpcChofer from '../../components/menus/MenuOpcChofer'
import { Modal, Button, Alert, Accordion, Card, Spinner, Table } from 'react-bootstrap'
import { store, auth } from '../../firebaseconf'
import { useHistory, useLocation } from 'react-router-dom'



function ChoferVenderPasaje() {

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "92%",
        height: "75%",
        overflowY: 'scroll'

    };


    //--------------------------------------------------HISTORIAL---------------------------BEGIN----------------------------------------
    //NO BORRAR --> NECESARIO PARA VOLVER ATRAS EN LAS PANTALLAS
    const historial = useHistory()
    //NO BORRAR --> NECESARIO PARA PASAR LOS ID ENTRE LAS VISTAS
    const location = useLocation();

    const datosViaje = location.state.idViaje

    const volverAtras = () => {
        //TE LLEVA A COMPRAR -- NO BORRAR
        if (esSospechoso){
            const nuevoModUser = {
                nombres: usuario.nombres,
                apellido: usuario.apellido,
                fechaNac: usuario.fechaNac,
                email: usuario.email,
                tipo: "usuario",
                esGold: usuario.esGold,
                tarjetaNum: usuario.tarjetaNum,
                tarjetaCod: usuario.tarjetaCod,
                tarjetaVen: usuario.tarjetaVen,
                idUser: usuario.idUser,
                password: usuario.password,
                esSospechoso: esSospechoso,
                sospechosoFecha: fechaSospechoso
            }

            const tempUser = usuarios.find((itemUser) => {
                return itemUser.email === email
            })

            store.collection('usuariosConfig').doc(tempUser.id).set(nuevoModUser)
        }

        historial.push('/listaPasajeros', { idViaje: datosViaje })
    }
    //-------------------------------------------------HISTORIA------------------------------END----------------------------------------


    //-----------------------------------------------------MODALES--------------------------BEGIN---------------------------------------

    //----- MODAL REGISTRAR / MODIFICAR SNACK
    // const [showModalEditSnack, setShowModalEditSnack] = useState(false)
    // const handleCloseEdit = () => setShowModalEditSnack(false)
    // const [esEditarSnack, setEsEditarSnack] = useState(false)


    //----- MODAL EXITO DE VENTA
    const [showModalExito, setShowModalExito] = useState(false)
    const handleCloseModalExito = () => setShowModalExito(false)



    // //MODAL ELIMINAR
    // const [showModal, setShowModal] = useState(false);
    // const [snackEliminar, setSnackEliminar] = useState('')
    // const handleClose = () => setShowModal(false);


    // //ALERT ERROR
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);
    const [msgError, setMsgError] = useState(null)

    //ALERT SUCESS
    const [showAlertSucc, setShowAlertSucc] = useState(false)
    const handleCloseAlertSucc = () => setShowAlertSucc(false)
    const [msgSucc, setMsgSucc] = useState(null)

    //ALERT DANGER
    const [showAlertDanger, setShowAlertDanger] = useState(false)
    const handleCloseAlertDanger = () => setShowAlertDanger(false)
    const [msgDanger, setMsgDanger] = useState(null)

    //MODAL COVID 
    const [showModalRegistrarDatosCovid, setShowModalRegistrarDatosCovid] = useState(false)
    const handleCloseRegistrarDatosCovid = () => showModalRegistrarDatosCovid(false)

    const [fechaSospechoso, setFechaSospechoso] = useState('')



    //-------------------------------------------------------MODALES--------------------------END---------------------------------------


    //-----------------------------------------------DATOS COMPONENTE--------------------------BEGIN------------------------------------
    //-----INFO DEL VIAJE 
    const [viajeCompra, setViajeCompra] = useState()
    const [viajes, setViajes] = useState([])

    //-----INFO DEL PASAJE
    const [origenViaje, setOrigenViaje] = useState()
    const [destinoViaje, setDestinoViaje] = useState()
    const [cantButacasViaje, setCantButacasViaje] = useState()
    const [horarioViaje, setHorarioViaje] = useState()
    const [precioPasajeViaje, setPrecioPasajeViaje] = useState()
    //------INFO DE LOS PASAJES QUE VA A COMPRAR
    const [cantPasajesComprarViaje, setCantPasajesComprarViaje] = useState('')



    //-----INFO DE PASAJERO
    const [email, setEmail] = useState('')
    const [nombres, setNombres] = useState('')
    const [apellido, setApellido] = useState('')
    const [mailCreado, setMailCreado] = useState(false)
    const [esUsuarioExistente, setEsUsuarioExistente] = useState(false)
    const [esUsuarioNuevoCreado, setEsUsuarioNuevoCreado] = useState(false)
    const [fueUsuarioNuevoCreado, setFueUsuarioNuevoCreado] = useState(false)
    const [creando, setCreando] = useState(false)




    const [totalPasajePagar, setTotalPasajePagar] = useState(0) // TOTAL DEL MONTO DE CANT PASAJES * PRECIO


    //-----INFO DEL USUARIO
    const [usuarios, setUsuarios] = useState([])
    const [usuario, setUsuario] = useState(null)
    // const [idUser, setIdUser] = useState('')



    //-----INFO CONTROLAR COVID
    const [temp, setTemp] = useState('')
    const [checkGustoOlfato, setCheckGustoOlfato] = useState(false)
    const [checkTemperatura, setCheckTemperatura] = useState(false)
    const [checkDificultadResp, setCheckDificultadResp] = useState(false)
    const [checkDolorGarganta, setCheckDolorGarganta] = useState(false)
    const [cantSintomas, setCantidadSintomas] = useState(0)
    const [esSospechoso, setEsSospechoso] = useState(true)
    const [tieneResultado, setTieneResultad] = useState(false)


    //----INFO ACTUALIZAR PASAJES DEL USUARIO SOSPECHOSO
    const [pasajeViajeVendido, setPasajeViajeVendido] = useState([])
    const [pasajesComprados, setPasajesComprados] = useState([])
    const [viaje, setViaje] = useState([])


    //-----------------------------------------------DATOS COMPONENTE--------------------------END------------------------------------------

    //----------------------------------------------------FUNCIONES--------------------------BEGIN------------------------------------------

    const getUsuarioConfig =  () => {
        store.collection('usuariosConfig').get()
        .then(response => {
            const fetchedUsers = [];
            response.docs.forEach(document => {
            const fetchedUser = {
                id: document.id,
                ...document.data()
            };
            fetchedUsers.push(fetchedUser)
            });
            setUsuarios(fetchedUsers)
        })
    }

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
                setViaje(fetchedViajes)
            })
    }

    const getPasajeComprado = () => {
        store.collection('pasajeComprados').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                    setPasajesComprados(fetchedViajes)

                });
            })
    }

    const getPasajeViajeVendido = () => {
        store.collection('pasajeViajeVendido').get()
            .then(response => {
                const fetchedViajes = [];
                response.docs.forEach(document => {
                    const fetchedViaje = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedViajes.push(fetchedViaje)
                });
                setPasajeViajeVendido(fetchedViajes)
            })
    }

    useEffect(() => {
        // console.log(datosViaje)
        const datosCompraViaje = async () => {
            // getUsuarioConfig()

            store.collection('usuariosConfig').get()
                .then(response => {
                    const fetchedUsers = [];
                    response.docs.forEach(document => {
                        const fetchedUser = {
                            id: document.id,
                            ...document.data()
                        };
                        fetchedUsers.push(fetchedUser)
                    });

                    setUsuarios(fetchedUsers)

                })
                .catch(error => {
                    setMsgError(error)
                    setShowAlert(true)
                });


            const v = await store.collection('viaje').get()
            const viajesArray = v.docs.map(item => ({ id: item.id, ...item.data() }))
            // console.log(viajesArray)
            const infoViajeCompra = viajesArray.find((itemViaje) => {
                return itemViaje.id === datosViaje.infoViaje.id
            })

            console.log(infoViajeCompra)
            //DESCOMENTAR PARA VER LOS DATOS DEL VIAJE FILTRADO
            // console.log(infoViajeCompra)
            setViajeCompra(infoViajeCompra)
            //Inicializo la info del viaje
            setOrigenViaje(infoViajeCompra.origen)
            setDestinoViaje(infoViajeCompra.destino)
            setCantButacasViaje(infoViajeCompra.butacaDisponible)
            setHorarioViaje(infoViajeCompra.datosRuta.horario)
            setPrecioPasajeViaje(infoViajeCompra.precio)
            getPasajeViajeVendido()
            getViajes()
        }

        datosCompraViaje()
    }, []);


    const emailValidation = () => {
        if (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email,)) {
            validarCorreo()
            console.log("validado")
        } else {
            setMsgDanger('El formato del email ingresado no es válido  para verificar.')
            setShowAlertDanger(true)
        }
    };

    const nomValidation = () => {
        if (!nombres.trim()) {
            setMsgDanger('El campo nombre es necesario.')
            setShowAlertDanger(true)
            return
        } else if (apellido.trim() && nombres.trim()) {
            crearCorreo()
        }
    };

    const apeValidation = () => {
        if (!apellido.trim()) {
            setMsgDanger('El campo apellido es necesario.')
            setShowAlertDanger(true)
            return
        } else if (apellido.trim() && nombres.trim()) {
            setCreando(true)
            crearCorreo()
        }
    };

    const crearCorreo = () => {
        const password = '123456'
        auth.createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {

                const nuevoUser = {
                    nombres: nombres,
                    apellido: apellido,
                    fechaNac: '',
                    email: email,
                    tipo: "usuario",
                    esGold: false,
                    tarjetaNum: '',
                    tarjetaCod: '',
                    tarjetaVen: '',
                    idUser: userCredential.user.uid,
                    password: password,
                    esSospechoso: false,
                    sospechosoFecha: ''
                }


                try {

                    await store.collection('usuariosConfig').add(nuevoUser)

                    const userr = await store.collection('usuariosConfig').get()
                    const userArray = userr.docs.map(item => ({ id: item.id, ...item.data() }))
                    const infoUser = userArray.find((itemUser) => {
                        return itemUser.email === email
                    })

                    const notificacionCovid = {
                        fecha: datosViaje.fecha,
                        idUser:userCredential.user.uid,
                        leido: false,
                        mensaje: "BIENVENIDO A NUESTRA PLATAFORMA - gracias por usar nuestro servicio.",
                        tipo: 'info'
                    }
        
                    await store.collection('notificaciones').add(notificacionCovid)

                    setUsuario(infoUser)
                    setMailCreado(true)
                    setFueUsuarioNuevoCreado(true)
                    setCreando(false)
                    getUsuarioConfig()

                } catch (e) {
                    setMsgDanger('Uups! Hubo un problema al registrar el usuario en el sistema')
                    setShowAlertDanger(true)
                    console.log(e)
                }

            })
            .catch(err => {
                console.log(err)
                if (err.code === 'auth/invalid-email') {
                    setMsgDanger('Formato de Email incorrecto')
                    setShowAlertDanger(true)
                }

                if (err.code === 'auth/weak-password') {
                    setMsgDanger('La password debe tener 6 caracteres o más')
                    setShowAlertDanger(true)
                }
                if (err.code === 'auth/email-already-in-use') {
                    setMsgDanger('El email que ingresó ya se encuentra registrado')
                    setShowAlertDanger(true)
                }

                console.log(err)
            })
    }

    const registrarDatosCovid = () => {

        setShowModalRegistrarDatosCovid(true)
    }

    const confirmarDatosCovid = async () => {
        let sospechoso = false
        let sintomasPasajero = []

        if (parseInt(temp) > 40) {
            setMsgError('El valor del campo Temperatura establece un máximo de 40 grados')
            setShowAlert(true)
            return
        }
        if (parseInt(temp) < 35) {
            setMsgError('El valor del campo Temperatura establece un mínimo de 35 grados.')
            setShowAlert(true)
            return
        }
        if (temp === "") {
            setMsgError('El campo temperatura esta vacio')
            setShowAlert(true)
            return
        }

        if (temp >= 38) {
            sintomasPasajero.push("temperatura mayor a 38 grados")
            // alert("El pasajero no podra viajar por tener fiebre, asi mismo se devolvera su dinero y no podra comprar pasajes por 14 dias")
            sospechoso = true
        } else {
            if (cantSintomas > 1) {
                // alert("El pasajero no podra viajar por tener mas de dos sintomas, asi mismo se devolvera su dinero y no podra comprar pasajes por 14 dias")
                if (checkTemperatura) {
                    sintomasPasajero.push("tuvo una temperatura mayor a 38 grados durante la ultima semana")
                }
                if (checkGustoOlfato) {
                    sintomasPasajero.push("posee perdida de gusto y/o olfato")

                }
                if (checkDificultadResp) {
                    sintomasPasajero.push("posee dificultades respiratorias")
                }
                if (checkDolorGarganta) {
                    sintomasPasajero.push("posee dolor de garganta")

                }
                sospechoso = true
            }
        }
        // console.log(sospechoso)
        if (sospechoso) {
            setEsSospechoso(true)
            console.log("jsahfaskjfhahsjkfha")
            // setTamaño(tamaño - 1)
            const idTemp = Math.random().toString(36).substr(2, 16)

            
            let mensaje = (temp >= 38 ) ?  (cantSintomas > 1) ? " COVID POSITIVO - Temperatura mayor a 38 grados y más de dos sintomas detectados" : "COVID POSITIVO - Temperatura mayor a 38 grados"  : "COVID POSITIVO - COVID POSITIVO - Temperatura menor a 38 grados, pero poseía más de dos sintomas detectados"

            const notificacionCovid = {
                fecha: datosViaje.fecha,
                idUser:usuario.idUser,
                leido: false,
                mensaje: mensaje,
                tipo: 'warning'
            }

            await store.collection('notificaciones').add(notificacionCovid)

            const pasajero = {
                cantidadButacas: 1,
                estadoPasaje: "Sospechoso Covid",
                id: idTemp,
                idChofer: datosViaje.infoViaje.datosCombi.idChofer,
                idCombi: datosViaje.infoViaje.idCombi,
                idPasajero: usuario.id,
                infoPasajero: usuario,
                snackComprados: [],
                tieneSnackComprados: false,
                totalPagado: precioPasajeViaje
            }

            const pasajeroSospechoso = {
                datos: pasajero,
                sintomas: sintomasPasajero
            }

            await store.collection('reporteSospechosos').add(pasajeroSospechoso)

            // COMO ES UN PASAJE QUE NO EXISTE, TENGO QUE SUMARLO A LAS COLECCIONES 
            let nuevoPasajeComprado = {
                cantidadButacas: 1,
                estadoPasaje: 'Sospechoso Covid',
                idPasajero: usuario.id,
                idViaje: datosViaje.infoViaje.id,
                infoPasajero: usuario,
                infoViaje: datosViaje.infoViaje,
                snackComprados: [],
                tieneSnackComprados: false,
                totalPagado: precioPasajeViaje
            }

            await store.collection('pasajeComprados').add(nuevoPasajeComprado)

            let nuevoPasajeVendido = {
                cantidadButacas: 1,
                estadoPasaje: 'Sospechoso Covid',
                idChofer: datosViaje.infoViaje.datosCombi.idChofer,
                idCombi: datosViaje.infoViaje.idCombi,
                idRuta: datosViaje.infoViaje.idRuta,
                idPasajero: usuario.id,
                idViaje: datosViaje.infoViaje.id,
                infoViaje: datosViaje.infoViaje,
                infoPasajero: usuario,
                snackComprados: [],
                tieneSnackComprados: false,
                totalPagado: precioPasajeViaje
            }

            await store.collection('pasajeViajeVendido').add(nuevoPasajeVendido)

            // USO LA FECHA DE ESTE VIAJE PARA CANCELARLE LOS PROXIMOS VIAJES POR COVID
            let fechaViaje = new Date(datosViaje.fecha)
            let diaFecha = fechaViaje.getDate() + 1
            let mesFecha = fechaViaje.getMonth()
            let diacovid = diaFecha + 14
            let mescovid = 0
            if (diacovid > 30) {
                mescovid = mesFecha + 1
                diacovid = 30 - diaFecha
            }
            let fechaFin = "2021-07-" + diacovid
            setFechaSospechoso(fechaFin)

            // marco como sospechoso en pasajesComprados
            pasajesComprados.map(itemViajeChofer => {
                console.log(itemViajeChofer)
                if (itemViajeChofer.infoViaje.fechaviaje <= fechaFin) {
                    console.log('entre')
                    if (itemViajeChofer.idPasajero === pasajero.idPasajero && itemViajeChofer.estadoPasaje === 'Pendiente') {
                        console.log('MDIFICAD COMPRADOS')
                        console.log(itemViajeChofer)
                        let actualizarPasajeComprado = {
                            cantidadButacas: itemViajeChofer.cantidadButacas,
                            estadoPasaje: 'Rechazado - CUARENTENA',
                            idPasajero: itemViajeChofer.idPasajero,
                            idViaje: itemViajeChofer.idViaje,
                            infoPasajero: itemViajeChofer.infoPasajero,
                            infoViaje: itemViajeChofer.infoViaje,
                            snackComprados: itemViajeChofer.snackComprados,
                            tieneSnackComprados: itemViajeChofer.tieneSnackComprados,
                            totalPagado: itemViajeChofer.totalPagado
                        }
                        store.collection('pasajeComprados').doc(itemViajeChofer.id).set(actualizarPasajeComprado)

                    }
                }
            })
            getPasajeComprado()
            console.log("dsaihfsaufnasuhfashsafuhfasui")
            pasajeViajeVendido.map(item => {
                console.log(item)
                if (item.infoViaje.fechaviaje <= fechaFin) {
                    if (item.id !== pasajero.id && item.idPasajero === pasajero.idPasajero) {
                        console.log('MDIFICAD VENDIDOS')
                        let viajeParaActualizar = viaje.find((itemViaje) => {
                            return itemViaje.id === item.idViaje
                        })
                        let modificarViaje = {
                            butacaDisponible: viajeParaActualizar.butacaDisponible,
                            combi: viajeParaActualizar.combi,
                            datosCombi: viajeParaActualizar.datosCombi,
                            datosRuta: viajeParaActualizar.datosRuta,
                            destino: viajeParaActualizar.destino,
                            estado: viajeParaActualizar.estado,
                            fechaviaje: viajeParaActualizar.fechaviaje,
                            id: viajeParaActualizar.id,
                            idCombi: viajeParaActualizar.idCombi,
                            idRuta: viajeParaActualizar.idRuta,
                            origen: viajeParaActualizar.origen,
                            precio: viajeParaActualizar.precio,
                            ruta_entera: viajeParaActualizar.ruta_entera
                        }
                        store.collection('viaje').doc(viajeParaActualizar.id).set(modificarViaje)
                        getViajes()
                        store.collection('pasajeViajeVendido').doc(item.id).delete()
                        getPasajeViajeVendido()

                    }
                }
            })
            setTieneResultad(true)
            setShowModalRegistrarDatosCovid(false)
            setMsgError(null)
            setShowAlert(false)
            setCheckGustoOlfato(false)
            setCheckTemperatura(false)
            setCheckDificultadResp(false)
            setCheckDolorGarganta(false)
            setCantidadSintomas(false)
            setCantidadSintomas(0)
            setTemp('')

        } else {
            try {

                // COMO ES UN PASAJE QUE NO EXISTE, Y NO TIENE SINTOMAS TENGO QUE SUMARLO A LAS COLECCIONES
                const notificacionCovid = {
                    fecha: datosViaje.fecha,
                    idUser:usuario.idUser,
                    leido: false,
                    mensaje: "PASAJE COMPRADO A CHOFER - gracias por viajar con nosotros.",
                    tipo: 'exito'
                }
    
                await store.collection('notificaciones').add(notificacionCovid)

                let nuevoPasajeComprado = {
                    cantidadButacas: 1,
                    estadoPasaje: 'En Curso',
                    idPasajero: usuario.id,
                    idViaje: datosViaje.infoViaje.id,
                    infoPasajero: usuario,
                    infoViaje: datosViaje.infoViaje,
                    snackComprados: [],
                    tieneSnackComprados: false,
                    totalPagado: precioPasajeViaje
                }

                await store.collection('pasajeComprados').add(nuevoPasajeComprado)

                let nuevoPasajeVendido = {
                    cantidadButacas: 1,
                    estadoPasaje: 'Arribó',
                    idChofer: datosViaje.infoViaje.datosCombi.idChofer,
                    idCombi: datosViaje.infoViaje.idCombi,
                    idRuta: datosViaje.infoViaje.idRuta,
                    idPasajero: usuario.id,
                    idViaje: datosViaje.infoViaje.id,
                    infoViaje: datosViaje.infoViaje,
                    infoPasajero: usuario,
                    snackComprados: [],
                    tieneSnackComprados: false,
                    totalPagado: precioPasajeViaje
                }

                await store.collection('pasajeViajeVendido').add(nuevoPasajeVendido)

                setEsSospechoso(false)
                setTieneResultad(true)
                //FALTA MOSTRAR MSJ DE SUCESS
                setShowModalRegistrarDatosCovid(false)
                setMsgError(null)
                setShowAlert(false)
                setCheckGustoOlfato(false)
                setCheckTemperatura(false)
                setCheckDificultadResp(false)
                setCheckDolorGarganta(false)
                setCantidadSintomas(false)
                setCantidadSintomas(0)
                setTemp('')

            } catch (err) {
                console.log(err)
                setMsgError(err)
                setShowAlert(true)
            }

        }
    }

    const estaTildadoTemperatura = (check) => {
        setCheckTemperatura(check)
        if (check) {
            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }


    }

    const estaTildadoGustoOlfato = (check) => {
        setCheckGustoOlfato(check)
        if (check) {
            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }

    }

    const estaTildadoDificultadRespitaroria = (check) => {
        setCheckDificultadResp(check)
        if (check) {

            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }
    }

    const estaTildadoDolorGarganta = (check) => {
        setCheckDolorGarganta(check)

        if (check) {
            setCantidadSintomas(cantSintomas + 1)
        }
        else {
            setCantidadSintomas(cantSintomas - 1)
        }
    }


    const validarCorreo = () => {
        
        // console.log(usuarios)
        const usuarioEncontrado = usuarios.find((itemUser) => {
            return itemUser.email === email
        })

        if (usuarioEncontrado === undefined) {
            setEsUsuarioNuevoCreado(true)
            setEsUsuarioExistente(false)
        } else {
            setMailCreado(true)
            setEsUsuarioNuevoCreado(false)
            setEsUsuarioExistente(true)
        }
        setUsuario(usuarioEncontrado)

    }


    //------------------------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------FUNCIONES--------------------------END------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------
    // PARTE VISUAL DEL COMPONENTE
    return (
        <div>
            <MenuUsuarioChofer />
            <MenuOpcChofer optionName="choferListarViaje" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 380, width: "60%" }}> Venta de Pasajes</h3>
                <Button style={{ top: 105, position: 'absolute', left: 80, width: "80px", height: "35px", fontSize: 14, justifyContent: 'center' }} onClick={(e) => { volverAtras() }} variant="secondary " > Volver</Button>
                <Alert id="success" className="" variant="success" show={showAlertSucc} onClick={handleCloseAlertSucc} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgSucc}
                </Alert>
                <Alert id="danger" className="" variant="danger" show={showAlertDanger} onClick={handleCloseAlertDanger} style={{ bottom: 0, zIndex: 5, position: 'absolute', left: 75, width: "60%" }} >
                    {msgDanger}
                </Alert>
                <div style={subPageStyle}>
                    <Accordion defaultActiveKey="0">
                        <Card className="card-accordion">
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0" >
                                <Card.Body style={{ backgroundColor: "#FFFFFF" }}>
                                    <form style={{ left: "40px", width: "100%" }}>
                                        <div className="form-group row">
                                            <div className="form-group col-md-4">
                                                <label id="origenInfo"><b>Origen:</b> {origenViaje}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="horarioInfo"><b>Horario:</b> {horarioViaje}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="butacasInfo"><b>Pasajes Disponibles:</b> {cantButacasViaje}</label>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="form-group col-md-4">
                                                <label id="destinoInfo"><b>Destino:</b> {destinoViaje}</label>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label id="precioInfo"><b>Precio unitario:</b> ${precioPasajeViaje}</label>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className="form-group row">
                                            <label id="mailCliente" className="col-sm-3 col-form-label"><b>Ingrese correo de cliente: </b></label>
                                            <div className="col-sm-3">
                                                <input
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); }}
                                                    onClick={(e) => { setShowAlertDanger(false); setEsUsuarioExistente(false); setEsUsuarioNuevoCreado(false) }}
                                                    className="form-control"
                                                    onBlur={emailValidation}
                                                    required
                                                    disabled={mailCreado}
                                                    type="email"
                                                />
                                            </div>
                                            {
                                                esUsuarioExistente ?
                                                    <label className="col-sm-3 col-form-label" style={{ color: 'green' }}><b> Usuario existente en el sistema</b></label>
                                                    :
                                                    <></>
                                            }
                                            {
                                                fueUsuarioNuevoCreado ?
                                                    <label className="col-sm-3 col-form-label" style={{ color: 'green' }}><b> Nuevo usuario creado en el sistema</b> </label>
                                                    :
                                                    <></>
                                            }
                                            {
                                                creando ?
                                                    <Spinner animation="border" role="status"></Spinner>
                                                    :
                                                    <></>
                                            }

                                            <br />
                                            <br />
                                            <div className="form-group row">
                                                {
                                                    esUsuarioNuevoCreado ?
                                                        <div className="col-sm-3">
                                                            <label hidden={mailCreado}>Nombres: </label>
                                                            <input
                                                                onChange={(e) => { setNombres(e.target.value) }}
                                                                onClick={handleCloseAlert}
                                                                onBlur={nomValidation}
                                                                className="form-control"
                                                                placeholder="Ingrese nombre cliente"
                                                                disabled={mailCreado}
                                                                hidden={mailCreado}
                                                                type="text"
                                                            />
                                                        </div>
                                                        :
                                                        <></>
                                                }

                                                {
                                                    esUsuarioNuevoCreado ?
                                                        <div className="col-sm-4">
                                                            <label hidden={mailCreado} >Apellido: </label>
                                                            <input
                                                                onChange={(e) => { setApellido(e.target.value) }}
                                                                onClick={handleCloseAlert}
                                                                onBlur={apeValidation}
                                                                className="form-control"
                                                                disabled={mailCreado}
                                                                hidden={mailCreado}
                                                                placeholder="Ingrese apellido cliente"
                                                                type="text" />
                                                        </div>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            {
                                                esUsuarioExistente || fueUsuarioNuevoCreado ?
                                                    <div className="col-sm-4">
                                                        <Button variant="primary" onClick={(e) => registrarDatosCovid()} >
                                                            Sintomas
                                                        </Button>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                        <br />
                                        <div className="form-group row">
                                            {(esUsuarioExistente || fueUsuarioNuevoCreado) ?
                                                <div className="col-sm-6">
                                                    <label ><b>Resultado de evaluación de síntomas :</b></label>
                                                </div>
                                                :
                                                <></>


                                            }

                                            {
                                                (esUsuarioExistente || fueUsuarioNuevoCreado) && esSospechoso && tieneResultado ?
                                                    <div className="col-sm-6">
                                                        <label style={{ color: 'red' }}><b>Sospechoso de COVID</b></label>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (esUsuarioExistente || fueUsuarioNuevoCreado) && !esSospechoso && tieneResultado ?
                                                    <div className="col-sm-4">
                                                        <label style={{ color: 'green' }}><b>NO sospechoso de COVID</b></label>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                        <br />
                                        <br />
                                        <div className="form-group row">
                                        {
                                                (esUsuarioExistente || fueUsuarioNuevoCreado) && esSospechoso && tieneResultado ?
                                                    <div className="col-sm-10">
                                                        <label ><b>NO se puede realizar la venta del pasaje, se registro el caso sospechoso! Presione "Volver" para continuar.</b></label>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (esUsuarioExistente || fueUsuarioNuevoCreado) && !esSospechoso && tieneResultado ?
                                                    <div className="col-sm-10">
                                                        <label ><b>Compra registrada! Cobre el pago, y el pasajero está habilitado para subir la combi! Presione "Finalizar Venta Pasaje" para continuar.</b></label>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                        </div>


                                        {
                                            !esSospechoso ?
                                                <div className="form-group row">
                                                    <label className="col-sm-10 col-form-label"><b>Total a pagar:</b> $ {precioPasajeViaje} </label>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {
                                            !esSospechoso ?
                                                <div className="form-group row">
                                                    <div className="col-sm-4">
                                                        <Button variant="success " onClick={(e) => volverAtras()} >
                                                            Finalizar Venta Pasaje
                                                        </Button>
                                                    </div>
                                                </div>
                                                :
                                                <></>
                                        }
                                        <hr></hr>
                                        <br />
                                    </form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
            {
                showModalRegistrarDatosCovid ? (
                    <Modal id="registrsrDatosCovid" show={showModalRegistrarDatosCovid} onHide={handleCloseRegistrarDatosCovid}>
                        <Modal.Header >
                            <Modal.Title>Registrar Sintomas</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form className='form-group'>
                                <input onChange={(e) => { setTemp(e.target.value) }}
                                    onClick={handleCloseAlert}
                                    className='form-control mt-5'
                                    type="text"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    maxLength='2'
                                    placeholder='temperatura'
                                    id="temperatura"
                                    value={temp}
                                />
                                <br></br>
                                <Table striped bordered hover variant="secondary"  >
                                    <thead>
                                        <tr>
                                            <th>Sintomas</th>
                                            <th>Si</th>
                                            {/* <th>No</th> */}
                                        </tr>
                                    </thead>
                                    <tbody >
                                        <tr>
                                            <th><label for="fiebreUltimaSemana">Tuvo fiebre la ultima semana</label></th>
                                            <th><input type="checkbox" defaultChecked={checkTemperatura} name="fiebreUltimaSemana" onClick={(e) => estaTildadoTemperatura(e.target.checked)} /> </th>
                                            {/* <th><input type="checkbox" name="fiebreUltimaSemana" value="no" /></th> */}
                                        </tr>
                                        <tr>
                                            <th><label for="gustoOlfato">Tiene perdida del olfato y/o gusto</label></th>
                                            <th><input type="checkbox" defaultChecked={checkGustoOlfato} onClick={(e) => estaTildadoGustoOlfato(e.target.checked)} /></th>
                                            {/* <th><input type="checkbox" name="gustoOlfato" value="no" /></th> */}
                                        </tr>
                                        <tr>
                                            <th>Posee dificultades respiratorias</th>
                                            <th><input type="checkbox" defaultChecked={checkDificultadResp} onClick={(e) => estaTildadoDificultadRespitaroria(e.target.checked)} /></th>
                                            {/* <th><input type="checkbox" name="gustoOlfato" value="no" /></th> */}
                                        </tr>
                                        <tr>
                                            <th><label for="dolorGarganta">Posee dolor de garganta</label></th>
                                            <th><input type="checkbox" defaultChecked={checkDolorGarganta} onClick={(e) => estaTildadoDolorGarganta(e.target.checked)} /></th>
                                            {/* <th><input type="checkbox" name="dolorGarganta" value="no" /></th> */}
                                        </tr>
                                    </tbody>
                                </Table>
                            </form>
                            <Alert className="mt-4" variant="danger" show={showAlert}>
                                {msgError}
                            </Alert>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="primary" onClick={() => { confirmarDatosCovid() }} >
                                Confirmar
                            </Button>
                            <Button variant="secondary" onClick={() => { setShowModalRegistrarDatosCovid(false); setMsgError(null); setShowAlert(false); setCheckGustoOlfato(false); setCheckTemperatura(false); setCheckDificultadResp(false); setCheckDolorGarganta(false); setCantidadSintomas(false); setCantidadSintomas(0); setTemp('') }}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                ) : (<></>)
            }

            <Modal id="modalExitoVenta" show={showModalExito} onHide={handleCloseModalExito}>
                <Modal.Header >
                    <Modal.Title>Pasaje comprado con Éxito</Modal.Title>
                </Modal.Header>
                <Modal.Body>Su pasaje a sido reservado con éxito! Muchas gracias por viajar con nosotros!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={(e) => { volverAtras() }}>
                        Volver al menú
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChoferVenderPasaje;