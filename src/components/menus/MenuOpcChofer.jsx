import React from 'react'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideBar.css';

import { ListCheck, Truck, PeopleFill, GeoFill } from 'react-bootstrap-icons';



function MenuOpcChofer() {

    return (

        <SideNav
            onSelect={(selected) => {
                // Add your code here
            }}
            style={{ backgroundColor: "#7CA0AF",top: "99px"}}
        >
            <SideNav.Toggle style={{color:"black"}}/>
            <SideNav.Nav defaultSelected="">
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
                        <PeopleFill color="black"></PeopleFill>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Pasajeros
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
                    <NavIcon>
                        <ListCheck color="black"></ListCheck>
                    </NavIcon>
                    <NavText style={{color:"black"}}>
                        Snacks Comprados
                    </NavText>
                </NavItem>
                <NavItem eventKey="home">
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