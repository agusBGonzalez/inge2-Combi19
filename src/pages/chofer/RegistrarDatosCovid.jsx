import React, { useState, useEffect } from "react";
const CheckButton = () => {
  const [onehabilita, setOnehabilita] = useState(false);
  return (
    <div>
      <div>
        <input id="check1" name="check1" type="checkbox" onChange={() => setOnehabilita(!onehabilita)} />
      </div>

      <div>
        <button type="submit" className="continue emite" disabled={onehabilita}>Continuar</button>
        <button type="submit" className="continue emite" disabled={onehabilita}>Continuar</button>
        <button type="submit" className="continue emite" disabled={onehabilita}>Continuar</button>
        <button type="submit" className="continue emite" disabled={onehabilita}>Continuar</button>

      </div>
    </div>
  );
};

export default CheckButton;