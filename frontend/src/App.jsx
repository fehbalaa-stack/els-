import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Dashboard from './Dashboard';
import Megtalaltam from './Megtalaltam'; // 1. IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 2. ÚJ ÚTVONAL: A :id azt jelenti, hogy ott bármi állhat */}
        <Route path="/megtalaltam/:id" element={<Megtalaltam />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;