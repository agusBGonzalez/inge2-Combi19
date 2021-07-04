import React from 'react'
import { useHistory } from "react-router-dom"

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideBar.css';

import { CalendarWeek, Truck, PersonLinesFill, GeoAltFill, Cart4, Map, HouseFill, CalendarCheckFill} from 'react-bootstrap-icons';


function MenuOpcAdmin(props) {


    const historial = useHistory()

    return (

        <SideNav
            onSelect={(selected) => {
                const to = '/' + selected;
                historial.push(to);
            }}
            style={{ backgroundColor: "#7CA0AF", top: "99px" }}
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected={props.optionName} >
                <NavItem eventKey="usuarioAdmin">
                    <NavIcon>
                        <HouseFill color="black"></HouseFill>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Inicio
                    </NavText>
                </NavItem>
                <NavItem eventKey="listaProductos">
                    <NavIcon>
                        <Cart4 color="black"></Cart4>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Productos
                    </NavText>
                </NavItem>
                <NavItem eventKey="listaSitios">
                    <NavIcon>
                        <GeoAltFill color="black"></GeoAltFill>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Sitios
                    </NavText>
                </NavItem>
                <NavItem eventKey="listaChoferes">
                    <NavIcon>
                        <PersonLinesFill color="black"></PersonLinesFill>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Choferes
                    </NavText>
                </NavItem>
                <NavItem eventKey="listaCombis">
                    <NavIcon>
                        <Truck color="black"></Truck>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Combis
                    </NavText>
                </NavItem>

                <NavItem eventKey="listaRutas">
                    <NavIcon>
                        <Map color="black"></Map>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Rutas
                    </NavText>
                </NavItem>
                <NavItem eventKey="listaViajes">
                    <NavIcon>
                        <CalendarWeek color="black"></CalendarWeek>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Viajes
                    </NavText>
                </NavItem>
                <NavItem eventKey="listaViajesFinalizados">
                    <NavIcon>
                        <CalendarCheckFill color="black"></CalendarCheckFill>
                    </NavIcon>
                    <NavText style={{ color: "black" }}>
                        Viajes Finalizados
                    </NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>

    );
}

export default MenuOpcAdmin;