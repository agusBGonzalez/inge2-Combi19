import React,{useState, useEffect} from 'react'
import { store,auth } from '../../firebaseconf'
import {Modal, Button, Alert} from 'react-bootstrap'
import { Link, useHistory} from 'react-router-dom'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'


function UsuarioGoldDatosPage() {

    

    const historial = useHistory()
	const [email, setEmail] = useState ('')
	const [nombres, setNombres] = useState ('')
	const [apellido, setApellido] = useState ('')
	const [fecha, setFecha] = useState ('')
	const [password, setPassword] = useState ('')

    const [numTarjeta, setNumTarjeta] = useState ('')
    const [codTarjeta, setCodTarjeta] = useState ('')
    const [fechaTarjeta, setFechaTarjeta] = useState ('')
    const [showGoldInfo, setShowGoldInfo] = useState(false);

    const [usuarios, setUsuarios] = useState([])
    const [usuario, setUsuario] =  useState(null)
    const [idUser, setIdUser] = useState('')

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "56%",
        height: "76%",
        // overflowY: 'scroll'

    };
  

	const [msgError, setMsgError] = useState (null)

	//MODAL
	const [showModal, setShowModal] = useState(false);
	const handleClose = () => setShowModal(false);

	//ALERT
	const [showAlert, setShowAlert] = useState(false);
	const handleCloseAlert = () => {setShowAlert(false); setMsgError(null);}


    useEffect( () =>{
        //getUsuarioConfig()

        auth.onAuthStateChanged( (user) => {
           if(user){
                setIdUser(user.uid)
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

                        const usuarioEncontrado = fetchedUsers.find((itemUser) => {
                            return itemUser.idUser === user.uid
                        })
                        setUsuario(usuarioEncontrado)

                        if (usuarioEncontrado !== undefined){
                            setNumTarjeta(usuarioEncontrado.tarjetaNum)
                            setCodTarjeta(usuarioEncontrado.tarjetaCod)
                            setFechaTarjeta(usuarioEncontrado.tarjetaVen)
                            setShowGoldInfo(usuarioEncontrado.esGold)
                        }
                        
                    })
                    .catch(error => {
                        setMsgError(error)
                        setShowAlert(true)
                    });   
           } 
        })
        
    },[])


    return (
        <div>
            <MenuUsuario/>
            <MenuOpcUsuario optionName="misDatosGold" />
            <div>
                <h3 style={{top: 110, position: 'absolute', left: 80,width: "60%",}}> Datos Gold</h3>
                <button className="btn btn-dark btn-block" type = "submit">Actualizar</button>
                { showGoldInfo ?
                <Button style={{top: 105, position: 'absolute', right:170, width: "200px", height: "40px"}} variant="warning" onClick={(e) => { console.log('A') }} > Actualizar Datos Gold </Button>
                :
                <Button variant="warning" style={{top: 105, position: 'absolute', right:170, width: "200px", height: "40px"}} disabled> Adherirme a suscripción</Button>
                }
                <div style={subPageStyle}>
                    { showGoldInfo ?
                        <div className = "col" > 
                            <form className = "form-group" >
                                <label>Número de Tarjeta:* </label>
                                <input
                                    value={numTarjeta}
                                    onChange = {(e)=> {setNumTarjeta(e.target.value)}}
                                    onClick = {handleCloseAlert}
                                    className = "form-control"
                                    maxLength = '16'
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                            }
                                        }}
                                    placeholder = "Ingrese su número de tarjeta"
                                    type = "text"
                                />
                                <label className="mt-4">Código:* </label>
                                <input
                                    value={codTarjeta}
                                    onChange = {(e)=> {setCodTarjeta(e.target.value)}}
                                    onClick = {handleCloseAlert}
                                    className = "form-control"
                                    placeholder = "Ingrese código"
                                    maxLength = '4'
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                            }
                                        }}
                                    type = "text"/>
                                <label className="mt-4">Fecha de Vencimiento:* </label>
                                <input  value={fechaTarjeta}
                                        type="month" 
                                        id="start" 
                                        name="start"
                                        min="2018-03" 
                                        style = {{width:"100%"}}
                                        onChange = {(e)=> {setFechaTarjeta(e.target.value)}}
                                        onClick = {handleCloseAlert}
                                />	
                            </form>
                        </div>
                        : 
                        <div>
                            <br/>
                            <br/>
                            <label>Muchas gracias por interesarse en nuestra opcion de "Usuario GOLD", 
                                   tiene un 10% de descuento en la compra de pasajes pagando una suscripcion mensual,
                                   sólo necesita cargar los datos de una tarjeta de crédito de la cual se debitará
                                   nuestro abono. 
                            </label>
                        </div> }
                     
                    <Alert className="mt-4" variant="danger" show={showAlert} onClick = {handleCloseAlert}>
                        {msgError}
                    </Alert>	
                </div>
                
            </div>
        </div>
    );
  }
  
  export default UsuarioGoldDatosPage;