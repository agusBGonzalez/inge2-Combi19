import React from 'react'
import MenuOpcUsuario from '../../components/menus/MenuOpcUsuario'
import MenuUsuario from '../../components/menus/MenuUsuario'
import Opiniones from '../../components/Comentarios/Opiniones'
import "../../components/Comentarios/Card.css"
import image1 from '../../images/combifondo2.jpg'

function UsuarioPage() {
  const subPageStyle = {
    top: 150,
    left: 80,
    width: "90%"
};
  return (
      <div >
        <img src={image1} alt="" style={{alignItems:'center', width:'100%',height:'46rem'}} />
        <MenuUsuario/>
        <MenuOpcUsuario optionName="usuarioCliente" />
        <div style={subPageStyle}>
          <Opiniones/> 
        </div>
      </div>

  );
}
  
  export default UsuarioPage;