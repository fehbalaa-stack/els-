import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- IKON JAVÍTÁS (Hogy látszódjon a gombostű) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------------------------------

function MiniMap({ lat, lng, childName }) {
  // Ha nincs adat, nem rajzolunk semmit
  if (!lat || !lng) return null;

  return (
    <div style={{ height: "200px", width: "100%", marginTop: "10px", borderRadius: "10px", overflow: "hidden", border: "2px solid #ccc" }}>
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        
        {/* Ez tölti be a térkép képeket (OpenStreetMap - Ingyenes) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* A Gombostű */}
        <Marker position={[lat, lng]}>
          <Popup>
            itt van {childName}! <br /> Pontos helyzet.
          </Popup>
        </Marker>

      </MapContainer>
    </div>
  );
}

export default MiniMap;