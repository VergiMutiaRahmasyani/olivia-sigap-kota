import { MapContainer, TileLayer } from 'react-leaflet'

const SURABAYA_CENTER = [-7.2575, 112.7521]

export default function PetaSurabaya() {
  return (
    <MapContainer
      center={SURABAYA_CENTER}
      zoom={13}              
      minZoom={11}           
      maxZoom={18}
      maxBounds={[           
        [-7.4, 112.55],      
        [-7.1, 112.95],      
      ]}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
    </MapContainer>
  )
}