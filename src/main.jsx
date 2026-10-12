import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Calculator from './components/Calculator.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="page">
      <Calculator />
    </div>
  </StrictMode>
);
