import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import Megtalaltam from './Megtalaltam';
import AdminPanel from './AdminPage';
import Header from './Header'; // <-- ÚJ IMPORT

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* <-- EZ MINDIG LÁTSZÓDIK */}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/megtalaltam/:id" element={<Megtalaltam />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;