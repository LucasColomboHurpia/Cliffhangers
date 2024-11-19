import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import App from './App';
import { ProductsProvider } from './context/ProductContext';
import { GameProvider } from './context/GameContext';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <GameProvider>
      <ProductsProvider>
        <App />
      </ProductsProvider>
    </GameProvider>
  </React.StrictMode>,
);

reportWebVitals();
