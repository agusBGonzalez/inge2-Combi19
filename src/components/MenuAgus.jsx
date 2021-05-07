import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div>
             <nav className=" navbar navbar-scroll  navbar-expand-lg bg-dark">
                {"     "}<div class="navbar-header">
                    <Link to="/">
                        <img src="https://i.ibb.co/6svqZ5F/logo-is.png" width="50" height="50" />
                    </Link>

                </div>
                <ul className="navbar-nav mr-auto ">
                <li className="btn btn-link">
                        <Link to="/Administrar"> Administrar Pagina </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Menu