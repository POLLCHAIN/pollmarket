import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import './index.css';
import App from './App';
import { AuthProvider } from './context/authContext';
import reportWebVitals from './reportWebVitals';

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

ReactDOM.render(
  <React.StrictMode>    
    <Web3ReactProvider getLibrary={getLibrary}>
      <AuthProvider>        
          <App />        
      </AuthProvider>
    </Web3ReactProvider>    
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
