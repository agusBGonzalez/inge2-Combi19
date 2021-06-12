import React from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import Opiniones from '../../components/Comentarios/Opiniones'
import "../../components/Comentarios/Card.css"
import image1 from '../../images/combifondo.jpg'

function UsuarioPage() {

  const subPageStyle = {
    top: 150,
    position: 'absolute',
    left: 80,
    width: "90%"
};
  
  return (
      <div>
         <img src={image1} alt="" style={{alignItems:'center', width:'100%'}} />
        <MenuUsuario/>
        <MenuOpcAdmin optionName="usuarioAdmin"/>
        <div style={subPageStyle}>
           <Opiniones/> 
        </div>
        
      </div>

  );

}
  
  export default UsuarioPage;