import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  
  // Bővítettük az állapotot az új mezőkkel
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: ''
  });

  const { fullName, phoneNumber, address, email, password } = formData;

  // A TE RENDERES CÍMED (ezt már tudod):
  const API_URL = "https://gyerek-tracker-backend.onrender.com"; 

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Elküldjük az összes adatot
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      localStorage.setItem('token', res.data.token);
      alert(`Sikeres regisztráció! Üdv, ${formData.fullName}!`);
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert('Hiba: ' + (err.response.data.msg || 'Valami nem jó'));
      } else {
        alert('Hálózati hiba! Nem érem el a szervert.');
      }
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif', background: '#f4f6f8', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>📝 Szülői Regisztráció</h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>Add meg az adataidat a fiók létrehozásához.</p>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
          
          {/* SZEMÉLYES ADATOK */}
          <input type="text" placeholder="Teljes Neved (Szülő)" name="fullName" value={fullName} onChange={onChange} required style={inputStyle} />
          <input type="tel" placeholder="Telefonszámod" name="phoneNumber" value={phoneNumber} onChange={onChange} required style={inputStyle} />
          <input type="text" placeholder="Lakcímed (Opcionális)" name="address" value={address} onChange={onChange} style={inputStyle} />
          
          <hr style={{border: '0', borderTop: '1px solid #eee', margin: '10px 0'}} />

          {/* FIÓK ADATOK */}
          <input type="email" placeholder="Email cím" name="email" value={email} onChange={onChange} required style={inputStyle} />
          <input type="password" placeholder="Jelszó" name="password" value={password} onChange={onChange} required style={inputStyle} />
          
          <button type="submit" style={buttonStyle}>
            REGISZTRÁLÁS
            <p style={{marginTop: '20px', fontSize: '14px'}}>
          Már van fiókod? <Link to="/login" style={{color: '#2196F3'}}>Lépj be itt!</Link>
        </p>
          </button>
        </form>
      </div>
    </div>
  );
}

// Kis stílus a szebb kinézetért
const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '16px'
};

const buttonStyle = {
  padding: '15px',
  background: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background 0.3s'
};

export default Register;