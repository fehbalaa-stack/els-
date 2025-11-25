import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Megtalaltam() {
  const { id } = useParams();
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gpsStatus, setGpsStatus] = useState(""); // Visszajelzés a gombnyomásról

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const res = await axios.get(`http://10.199.99.94:5000/api/profiles/public/${id}`);
        setChildData(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchChildData();
  }, [id]);

  // GPS KÜLDÉS FUNKCIÓ
  const sendLocation = () => {
    setGpsStatus("Helyzet lekérése...");
    
    if (!navigator.geolocation) {
      setGpsStatus("A böngésző nem támogatja a helymeghatározást.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        
        // Elküldjük a szervernek
        await axios.post(`http://10.199.99.94:5000/api/profiles/public/location/${id}`, {
          lat: latitude,
          lng: longitude
        });
        
        setGpsStatus("✅ Helyzet elküldve a szülőnek!");
      } catch (err) {
        setGpsStatus("❌ Hiba a küldésnél.");
      }
    }, () => {
      setGpsStatus("❌ Nem sikerült lekérni a helyzetet (engedélyezni kell).");
    });
  };

  if (loading) return <div style={{padding:'20px', textAlign:'center'}}>Betöltés...</div>;
  if (!childData) return <div style={{padding:'20px', textAlign:'center'}}>Hibás kód.</div>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', background: '#fff0f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#d32f2f', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>🆘 Elvesztem!</h1>
        <p>Segíts hazaérnem.</p>
      </div>

      <div style={{ padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '36px', margin: '5px 0' }}>{childData.childName}</h2>
        </div>

        {/* HÍVÁS GOMB */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '2px solid #d32f2f', marginBottom: '20px' }}>
          <a href={`tel:${childData.emergencyPhone}`} style={{ display: 'block', width: '100%', padding: '15px', background: '#4CAF50', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px' }}>
            HÍVÁS MOST 📞
          </a>
        </div>

        {/* GPS GOMB */}
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '15px', border: '2px solid #2196F3', textAlign: 'center' }}>
          <p style={{margin: '0 0 10px 0'}}>Segítség a szülőnek:</p>
          <button onClick={sendLocation} style={{ width: '100%', padding: '15px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            📍 HELYZETEM ELKÜLDÉSE
          </button>
          {gpsStatus && <p style={{marginTop: '10px', fontWeight: 'bold'}}>{gpsStatus}</p>}
        </div>

      </div>
    </div>
  );
}

export default Megtalaltam;