import React from 'react'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import MenuUsuario from '../../components/menus/MenuUsuario'
import Opiniones from '../../components/Comentarios/Opiniones'
import "../../components/Comentarios/Card.css"
import image1 from '../../images/combifondo.jpg'

function UsuarioPage() {
  const subPageStyle = {
    top: 150,
    left: 80,
    width: "90%"
};
  return (
      <div >
        
        <MenuUsuario/>
        <MenuOpcUsuario/>
        <div style={subPageStyle}>
          {/* <img src={image1} alt="" style={{alignItems:'center', width:'800px',height:'600px'}} /> */}
          <Opiniones/> 
        </div>
      </div>

  );
}
  
  export default UsuarioPage;