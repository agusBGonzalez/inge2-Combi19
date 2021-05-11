import React,{useState,useEffect} from 'react'

import MenuInicio from '../components/menus/MenuInicio'
import InicioCarousel from '../components/animations/InicioCarousel'
import LoadSpinner from '../components/animations/LoadSpinner'

function InicioPage() {
    const [loading, setLoading] = useState (true)


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return timer;
      }, []);


    const spinnerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    };

    return (
        <div>
            <MenuInicio/>
            <div style={{display: loading ? "block" : "none"}}>
                <div style={spinnerStyle}>
                    <LoadSpinner/>
                </div>
            </div> 
            <div style={{display: loading ? "none" : "block"}}>
                <InicioCarousel />
            </div>
            
            
        </div>
    );
  }
  
  export default InicioPage;