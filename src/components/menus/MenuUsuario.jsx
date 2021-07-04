import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import logo from '../../images/logo-is.png'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { auth, store } from '../../firebaseconf'
import { toast } from 'react-toastify';

function MenuUsuario() {

	const historial = useHistory()

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

						userNotificaciones.forEach(notifi => {
							if (!notifi.leido) {
								switch (notifi.tipo) {
									case 'info':
										toast.info(notifi.mensaje, {
											position: toast.POSITION.TOP_RIGHT
										  });
										break;
									case 'exito':
										toast.success(notifi.mensaje, {
											position: toast.POSITION.TOP_RIGHT
										  });
										break;
									case 'warning':
										toast.warn(notifi.mensaje, {
											position: toast.POSITION.TOP_RIGHT
										  });
										break;
									case 'cancelado':
										toast.error(notifi.mensaje, {
											position: toast.POSITION.TOP_RIGHT
										  });
										break;
								}
				
								const notiUpd = {
									idUser: notifi.idUser,
									leido: true,
									mensaje: notifi.mensaje,
									tipo: notifi.tipo,
									fecha: notifi.fecha
								}
								store.collection('notificaciones').doc(notifi.id).set(notiUpd)
				
							}
				
						});

					})
					.catch(error => {
						alert(error)
					});
			}
		})
		
		return () => {  }
	}, [])


	const CerrarSesion = () => {
		auth.signOut()
		historial.push('/')
	}


	const navStyle = {
		position: "absolute",
		top: 0,
		width: "100%",
		borderBottom: "3px solid gray"
	};

	return (
		<div className="containerNavUser" style={navStyle}>
			<nav
				className=" navbar navbar-scroll navbar-expand-lg bg-ligth"
				style={{ backgroundColor: "#7CA0AF" }}
			>
				<div className="container-fluid d-flex">
					<div className="navbar-header">
						<img src={logo} alt="logo-is" width="80" height="80" className="ms-4" />
					</div>
					<div>
						<DropdownButton id="dropdown-user" variant="secondary" title="Mi Sesión">
							<Dropdown.Item as={Link} to="/misDatosUsuario">Mis Datos</Dropdown.Item>
							<Dropdown.Item as={Link} to="/misNotificaciones">Mis Notificaciones</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item onClick={CerrarSesion}>Cerrar Sesión</Dropdown.Item>
						</DropdownButton>
					</div>
				</div>
			</nav>
		</div>
	);
}



export default MenuUsuario;