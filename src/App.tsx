import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useRef } from 'react';

import GameScreen from './components/GameScreen/GameScreen';
import ProdutScreen from './components/ProductScreen/ProdutScreen';




const App = () => {
  return (
    <Router basename="/Cliffhangers">
      <Routes>
        <Route path="/" element={<GameScreen />} />
        <Route path="/products" element={<ProdutScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
