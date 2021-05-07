import React from 'react'
import{Link} from 'react-router-dom'

const Menu = () => {
    return (
        <div>
            <nav className= 'navbar navbar-expand-lg navbar-dark bg-info'>
                <ul className='navbar-nav mr-auto'>
                    <li className='nav-item'>
                        <Link to='/'>Inicio</Link>
                    </li>
                    <li >
                        <Link className='nav-item ml-1' to='/registroc'>Registrar</Link>
                    </li>
                    <li >
                        <Link className='nav-item ml-1' to='/listar'>Listados</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Menu
