import React from 'react'
import MenuUsuarioChofer from '../../components/menus/MenuUsuarioChofer'
import MenuOpcChofer from '../../components/menus/MenuOpcChofer'
import Opiniones from '../../components/Comentarios/Opiniones'
import "../../components/Comentarios/Card.css"
import image1 from '../../images/combifondo2.jpg'


function ChoferPage() {

  const subPageStyle = {
    top: 150,
    left: 80,
    width: "90%"
  }; 
  
  return (
      <div>
        <img src={image1} alt="" style={{alignItems:'center', width:'100%',height:'46rem'}} />
        <MenuUsuarioChofer/>
        <MenuOpcChofer optionName="usuarioChofer"/>
        <div style={subPageStyle}>
          <Opiniones/> 
        </div>
      </div>

  );
}
  
  export default ChoferPage;