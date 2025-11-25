import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Ezt importáltuk pluszban

function Register() {
  const navigate = useNavigate(); // Ez a navigációhoz kell
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://10.199.99.94:5000/api/auth/register', formData);
      
      // 1. MENTJÜK A TOKENT
      localStorage.setItem('token', res.data.token);
      
      // 2. ÁTIRÁNYÍTJUK A DASHBOARDRA
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err.response.data);
      alert('Hiba: ' + (err.response.data.msg || 'Valami nem jó'));
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Regisztráció</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input type="email" placeholder="Email cím" name="email" value={email} onChange={onChange} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Jelszó" name="password" value={password} onChange={onChange} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', cursor: 'pointer' }}>Regisztrálás</button>
      </form>
    </div>
  );
}

export default Register;