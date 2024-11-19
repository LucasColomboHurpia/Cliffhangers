import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GameScreen from './components/GameScreen/GameScreen';
import ProdutScreen from './components/ProductScreen/ProdutScreen';



//////////////////

const originalConsoleError = console.error;

console.error = (message, ...args) => {
  if (
    typeof message === 'string' 
  ) {
    return; // Suppress the error
  }
  originalConsoleError(message, ...args); // Pass other errors through
};


/////////////////


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<GameScreen />} />
        <Route path='/products' element={<ProdutScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
