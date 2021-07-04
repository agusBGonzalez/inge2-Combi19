import React from 'react';
import ReactDOM from 'react-dom';

import AppFinal from './AppFinal.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'animate.css/animate.css'

ReactDOM.render(
  <div>
    <ToastContainer />
    <AppFinal />
  </div>
  ,
  document.getElementById('root')
);
