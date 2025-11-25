import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  // A Renderes Backend Linked (Ellenőrizd, hogy ez-e a tiéd!)
  const API_URL = "https://gyerek-tracker-backend.onrender.com";

  // Adatok betöltése
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      alert("Nem vagy admin, vagy lejárt a munkamenet!");
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Funkciók
  const toggleBan = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/api/admin/ban/${id}`, {}, { headers: { 'x-auth-token': token } });
    fetchUsers();
  };

  const togglePremium = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/api/admin/premium/${id}`, {}, { headers: { 'x-auth-token': token } });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if(!window.confirm("Biztosan törlöd? Minden gyereke is törlődik!")) return;
    
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/api/admin/delete/${id}`, { headers: { 'x-auth-token': token } });
    fetchUsers();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>👮‍♂️ Admin Vezérlőpult</h1>
      <button onClick={() => navigate('/dashboard')} style={{marginBottom: '20px', padding: '10px', cursor: 'pointer'}}>⬅ Vissza a Dashboardra</button>
      
      <div style={{overflowX: 'auto'}}>
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white', textAlign: 'left' }}>
              <th style={{padding: '10px'}}>Név</th>
              <th style={{padding: '10px'}}>Email</th>
              <th style={{padding: '10px'}}>Tel</th>
              <th style={{padding: '10px'}}>Státusz</th>
              <th style={{padding: '10px'}}>Prémium</th>
              <th style={{padding: '10px'}}>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd', background: user.isBanned ? '#ffebee' : 'white' }}>
                <td style={{padding: '10px'}}>{user.fullName} <br/><span style={{fontSize:'10px', color:'#666'}}>{user.role}</span></td>
                <td style={{padding: '10px'}}>{user.email}</td>
                <td style={{padding: '10px'}}>{user.phoneNumber}</td>
                
                <td style={{padding: '10px'}}>
                  {user.isBanned ? <span style={{color:'red', fontWeight:'bold'}}>BANNOLVA 🚫</span> : <span style={{color:'green'}}>Aktív ✅</span>}
                </td>
                
                <td style={{padding: '10px'}}>
                  {user.isPremium ? '⭐ PRO' : 'Ingyenes'}
                </td>

                <td style={{padding: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                  <button onClick={() => toggleBan(user._id)} style={{background: 'orange', color: 'white', border: 'none', padding: '5px', cursor: 'pointer'}}>
                    {user.isBanned ? 'Feloldás' : 'Ban'}
                  </button>
                  <button onClick={() => togglePremium(user._id)} style={{background: 'purple', color: 'white', border: 'none', padding: '5px', cursor: 'pointer'}}>
                    Prémium +/-
                  </button>
                  <button onClick={() => deleteUser(user._id)} style={{background: 'red', color: 'white', border: 'none', padding: '5px', cursor: 'pointer'}}>
                    Törlés
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;