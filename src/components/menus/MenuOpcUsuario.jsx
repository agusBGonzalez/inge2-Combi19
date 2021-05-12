import React from 'react'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideBar.css';

import { ReceiptCutoff, CreditCardFill, GeoFill, HouseFill} from 'react-bootstrap-icons';


function MenuOpcUsuario(props) {

    return (

        <SideNav
            onSelect={(selected) => {
                // Add your code here
            }}
            style={{ backgroundColor: "#7CA0AF",top: "99px"}}
        >
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="">
                <NavItem eventKey="usuarioCliente">
                    <NavIcon>
                        <HouseFill color="black"></HouseFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Inicio
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <GeoFill color="black"></GeoFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Viajes
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <ReceiptCutoff color="black"></ReceiptCutoff>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Mis Pasajes
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <CreditCardFill color="black"></CreditCardFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Usuario Gold
                    </NavText>
                </NavItem>
            </SideNav.Nav>
        </SideNav>   
       
    );
  }
  
  export default MenuOpcUsuario;