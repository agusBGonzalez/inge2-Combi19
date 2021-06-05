import React from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'
import Opiniones from '../../components/Comentarios/Opiniones'

function UsuarioPage() {

  const subPageStyle = {
    top: 150,
    position: 'absolute',
    left: 80,
    width: "90%"
};
  
  return (
      <div>
        <MenuUsuario/>
        <MenuOpcAdmin optionName="usuarioAdmin"/>
        <div style={subPageStyle}>
          <Opiniones/>
        </div>
      </div>

  );

}
  
  export default UsuarioPage;