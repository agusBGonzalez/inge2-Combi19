import React from 'react'
import { useHistory } from "react-router-dom"
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideBar.css';

import { Truck, GeoFill, HouseFill} from 'react-bootstrap-icons';



function MenuOpcChofer(props) {

    const historial = useHistory()

    return (

        <SideNav
            onSelect={(selected) => {
                const to = '/' + selected;
                historial.push(to);
            }}
            style={{ backgroundColor: "#7CA0AF",top: "99px"}}
        >
            <SideNav.Toggle style={{color:"black"}}/>
            <SideNav.Nav defaultSelected={props.optionName ? props.optionName : ''} >
                <NavItem eventKey="usuarioChofer">
                    <NavIcon>
                        <HouseFill color="black"></HouseFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Inicio
                    </NavText>
                </NavItem>
                <NavItem eventKey="choferListarViaje">
                    <NavIcon>
                        <GeoFill color="black"></GeoFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Mis Viajes
                    </NavText>
                </NavItem>
                <NavItem eventKey="choferMiCombi">
                    <NavIcon>
                        <Truck color="black"></Truck>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Mi Combi
                    </NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>   
       
    );
  }
  
  export default MenuOpcChofer;