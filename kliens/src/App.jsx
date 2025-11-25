import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login'; // <--- ÚJ IMPORT
import Dashboard from './Dashboard';
import Megtalaltam from './Megtalaltam';
import AdminPanel from './AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A Főoldal most a Regisztráció marad (vagy átírhatod Loginra) */}
        <Route path="/" element={<Register />} />
        
        {/* ÚJ ÚTVONAL: Belépés */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/megtalaltam/:id" element={<Megtalaltam />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;