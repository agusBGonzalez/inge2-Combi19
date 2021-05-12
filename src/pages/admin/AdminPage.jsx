import React from 'react'
import MenuUsuario from '../../components/menus/MenuUsuario'
import MenuOpcAdmin from '../../components/menus/MenuOpcAdmin'


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
        <MenuOpcAdmin/>
        <div style={subPageStyle}>
          <h1 className="text-center" >BIENVENIDO..</h1>
        </div>
      </div>

  );
}
  
  export default UsuarioPage;