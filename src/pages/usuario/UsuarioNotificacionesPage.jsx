import React, { useState, useEffect } from 'react'
import { store, auth } from '../../firebaseconf'
import { Modal, Button, Alert, Table } from 'react-bootstrap'
// import { Link, useHistory} from 'react-router-dom'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'


function UsuarioNotificacionesPage() {

    const [notificaciones, setNotificaciones] = useState([])

    const subPageStyle = {
        top: 150,
        position: 'absolute',
        left: 80,
        width: "90%",
        height: "76%",
        // overflowY: 'scroll'

    };



    useEffect(() => {

        auth.onAuthStateChanged((user) => {
            if (user) {
                store.collection('notificaciones').get()
                    .then(response => {
                        const fetchedNotificaciones = [];
                        response.docs.forEach(document => {
                            const fetchedNotificacion = {
                                id: document.id,
                                ...document.data()
                            };
                            fetchedNotificaciones.push(fetchedNotificacion)
                        });

                        const userNotificaciones = fetchedNotificaciones.filter((notif) => notif.idUser === user.uid)

                        notificaciones.sort((a, b) => a.fecha > b.fecha)

                        setNotificaciones(userNotificaciones)

                    })
                    .catch(error => {
                        alert(error)
                    });
            }
        })

    }, [])


    return (
        <div>
            <MenuUsuario />
            <MenuOpcUsuario optionName="" />
            <div>
                <h3 style={{ top: 110, position: 'absolute', left: 80, width: "60%", }}>Mis Notificaciones</h3>
                <button className="btn btn-dark btn-block" type="submit">Actualizar</button>
                <div style={subPageStyle}>
                    <Table striped bordered variant="secondary">
                        <thead>
                            <tr>
                                <th>Mensaje</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                notificaciones.length !== 0 ?
                                    (
                                        notificaciones.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.mensaje}</td>
                                                <td>{item.tipo}</td>
                                                <td>{item.fecha}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <></>
                                    )
                            }
                        </tbody>
                    </Table>
                    {
                        notificaciones.length === 0 ? <div className="alert alert-warning mt-19"> No se encontraron notificaciones para mostrar en este momento </div> : <div></div>
                    }
                </div>
            </div>

        </div>
    );
}

export default UsuarioNotificacionesPage;