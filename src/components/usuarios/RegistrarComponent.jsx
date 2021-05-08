import React, {useState} from "react"
import { Link } from "react-router-dom";

function RegistrarComponent() {

  const [email, setEmail] = useState ('')
  const [nombres, setNombres] = useState ('')
  const [apellido, setApellido] = useState ('')
  const [fecha, setFecha] = useState ('')
  const [password, setPassword] = useState ('')

  const RegistrarUsuario = (e) =>{
	e.preventDefault();
	console.log("registrar submit")
  }
  

  return (
	<div className = "row mt-5">
		<div className = "col"></div>
		<div className = "col">
			<form className = "form-group" onSubmit = {RegistrarUsuario}>
				<input
					onChange = {(e)=> {setNombres(e.target.value)}}
					className = "form-control mt-4"
					placeholder = "Nombres"
					type = "text"/>
				<input
					onChange = {(e)=> {setApellido(e.target.value)}}
					className = "form-control mt-4"
					placeholder = "Apellido"
					type = "text"/>
				<input
					onChange = {(e)=> {setFecha(e.target.value)}}
					className = "form-control mt-4"
					placeholder = "Fecha de Nacimiento"
					type = "date"/>    
				<input
					onChange = {(e)=> {setEmail(e.target.value)}}
					className = "form-control mt-4"
					placeholder = "Email"
					type = "email"/>
				<input
					onChange = {(e)=> {setPassword(e.target.value)}}
					className = "form-control mt-4"
					placeholder = "Contraseña"
					type = "password"/>
				<div className="d-grid gap-2 col-6 mx-auto mt-4">
					<button className="btn btn-dark btn-block" type="button" type = "submit">Registrar Usuario</button>
					<Link className="btn btn-danger btn-block " to="/">Cancelar</Link>
				</div>
				
			</form>
		</div>
		<div className = "col"></div>
	</div>
  );
}

export default RegistrarComponent;
