import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Dashboard from './Dashboard';
import Megtalaltam from './Megtalaltam';
import AdminPanel from './AdminPage'; // <--- FONTOS: Itt AdminPage legyen a vége!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/megtalaltam/:id" element={<Megtalaltam />} />
        
        {/* EZ A SOR KELL NEKÜNK NAGYON: */}
        <Route path="/admin" element={<AdminPanel />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
