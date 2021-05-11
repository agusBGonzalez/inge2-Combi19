import React from 'react'
// import {ListGroup,Tab,Row,Col,Sonnet} from 'react-bootstrap'

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideBar.css';

import { CalendarWeek, Truck, PersonLinesFill, GeoAltFill, Cart4, Map} from 'react-bootstrap-icons';


function MenuOpcAdmin() {

    return (

        <SideNav
            onSelect={(selected) => {
                // Add your code here
            }}
            style={{ backgroundColor: "#7CA0AF",top: "99px" }}
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="" >
                <NavItem eventKey="home">
                    <NavIcon>
                        <GeoAltFill color="black"></GeoAltFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Sitios
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <Map color="black"></Map>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Rutas
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <CalendarWeek color="black"></CalendarWeek>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Viajes
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <Truck color="black"></Truck>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Combis
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <PersonLinesFill color="black"></PersonLinesFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Choferes
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <Cart4 color="black"></Cart4>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Productos
                    </NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>
       
    );
  }
  
  export default MenuOpcAdmin;