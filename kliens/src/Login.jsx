import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Link importálása

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  // A Renderes Backend Linked:
  const API_URL = "https://gyerek-tracker-backend.onrender.com"; 

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      // Mentjük a tokent
      localStorage.setItem('token', res.data.token);
      
      // Üdvözlés
      alert(`Sikeres belépés! Üdv újra, ${res.data.user.fullName}!`);
      
      // Ha admin, szólunk neki (opcionális)
      if(res.data.user.role === 'admin') {
          console.log("Admin lépett be");
      }

      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert('Hiba: ' + (err.response.data.msg || 'Hibás adatok'));
      } else {
        alert('Hálózati hiba! Nem érem el a szervert.');
      }
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif', background: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ margin: 0 }}>🔐</h1>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Bejelentkezés</h2>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input type="email" placeholder="Email cím" name="email" value={email} onChange={onChange} required style={inputStyle} />
          <input type="password" placeholder="Jelszó" name="password" value={password} onChange={onChange} required style={inputStyle} />
          
          <button type="submit" style={buttonStyle}>
            BELÉPÉS
          </button>
        </form>

        <p style={{marginTop: '20px', fontSize: '14px'}}>
          Nincs még fiókod? <Link to="/" style={{color: '#2196F3'}}>Regisztrálj itt!</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' };
const buttonStyle = { padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };

export default Login;