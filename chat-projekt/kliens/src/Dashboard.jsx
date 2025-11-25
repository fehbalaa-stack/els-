import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import MiniMap from './MiniMap';

function Dashboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({ childName: '', dateOfBirth: '', emergencyPhone: '', medicalInfo: '' });

  useEffect(() => {
    const fetchProfiles = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/'); return; }
      try {
        const res = await axios.get('https://gyerek-tracker-backend.onrender.com/api/profiles', { headers: { 'x-auth-token': token } });
        setProfiles(res.data);
      } catch (err) { if(err.response && err.response.status === 401) logout(); }
    };
    fetchProfiles();
  }, [navigate]);

  const logout = () => { localStorage.removeItem('token'); navigate('/'); };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('https://gyerek-tracker-backend.onrender.com/api/profiles', formData, { headers: { 'x-auth-token': token } });
      setProfiles([...profiles, res.data]);
      setFormData({ childName: '', dateOfBirth: '', emergencyPhone: '', medicalInfo: '' });
    } catch (err) { alert('Hiba!'); }
  };

  // NYOMTATÁS FUNKCIÓ
  const printQR = (profile) => {
    const link = `https://gyerek-tracker-backend.onrender.com/megtalaltam/${profile._id}`;
    // Egy új ablakot nyitunk, amibe írunk egy kis HTML-t
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
      <html>
        <head><title>Nyomtatás - ${profile.childName}</title></head>
        <body style="text-align: center; font-family: Arial;">
          <h1>🆘 Ha elvesztem:</h1>
          <h2>${profile.childName}</h2>
          <br>
          <p>Olvasd be a lenti kódot!</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${link}" />
          <br><br>
          <p>Vagy hívd: <b>${profile.emergencyPhone}</b></p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 1000); // Kicsit várunk, hogy betöltsön a kép
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>🛡️ Szülői Felügyelet</h1>
        <button onClick={logout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Kilépés</button>
      </div>

      {/* Űrlap (rövidítve a kód miatt) */}
      <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>👶 Új Gyerek</h3>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="Név" value={formData.childName} onChange={(e) => setFormData({...formData, childName: e.target.value})} required style={{padding:'10px'}}/>
          <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} required style={{padding:'10px'}}/>
          <input type="tel" placeholder="Tel" value={formData.emergencyPhone} onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})} required style={{padding:'10px'}}/>
          <button type="submit" style={{ background: '#2196F3', color: 'white', border: 'none', padding: '10px' }}>MENTÉS</button>
        </form>
      </div>

      <h3>📋 Gyerekeid:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {profiles.map(profile => {
          // FONTOS: A végére NEM kell perjel, de a /megtalaltam/ rész KELL!
const qrLink = "https://stupendous-crumble-108400.netlify.app/megtalaltam/" + profile._id;
          return (
            <div key={profile._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', textAlign: 'center', background: 'white' }}>
              <h2 style={{color: '#2196F3', marginTop: 0}}>{profile.childName}</h2>
              <div style={{ background: 'white', padding: '10px', display: 'inline-block', border: '1px solid #eee' }}>
                <QRCode value={qrLink} size={100} />
              </div>
              
              <div style={{display:'flex', gap: '10px', justifyContent: 'center', marginTop: '15px'}}>
                 {/* NYOMTATÁS GOMB */}
                <button onClick={() => printQR(profile)} style={{background: '#607d8b', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '5px'}}>
                  🖨️ Nyomtatás
                </button>
                
                <a href={qrLink} target="_blank" style={{background: '#eee', color: '#333', padding: '8px', textDecoration: 'none', borderRadius: '5px'}}>
                  Teszt
                </a>
              </div>
                   
              {/* TÉRKÉP MEGJELENÍTÉS (Ha van GPS adat) */}
 <div style={{marginTop: '15px', background: '#e8f5e9', padding: '10px', borderRadius: '5px', border: '1px solid #c8e6c9'}}>
              <p style={{margin: '0 0 5px 0', color: 'green', fontWeight: 'bold'}}>📍 Utoljára látva itt:</p>
              
              {/* IDE TESSZÜK BE A TÉRKÉPET */}
              <MiniMap 
                lat={profile.location.lat} 
                lng={profile.location.lng} 
                childName={profile.childName} 
              />

              <p style={{fontSize: '10px', color: '#666', margin: '5px 0 0 0'}}>
                Frissítve: {new Date(profile.location.updatedAt).toLocaleTimeString()}
                 </p>
                </div>
              ) : (
                <p style={{fontSize: '12px', color: '#999', marginTop: '15px'}}>Még nincs GPS adat.</p>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;