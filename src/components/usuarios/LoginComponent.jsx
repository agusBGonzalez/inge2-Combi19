import React, {useState} from "react"
import { Link } from "react-router-dom";

function LoginComponent() {

   const [email, setEmail] = useState ('')
   const [password, setPassword] = useState ('')
  
  const LoginUsuario = (e) =>{
        e.preventDefault();
        console.log("login submit")
  }  

  return (
    <div className = "row mt-5">
        <div className = "col"></div>
        <div className = "col">
            <form className = "form-group" onSubmit = {LoginUsuario}>   
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
					<button className="btn btn-dark btn-block" type="button" type = "submit">Acceder</button>
					<Link className="btn btn-danger btn-block " to="/">Cancelar</Link>
				</div>

            </form>
        </div>
        <div className = "col"></div>
    </div>
  );
}

export default LoginComponent;
