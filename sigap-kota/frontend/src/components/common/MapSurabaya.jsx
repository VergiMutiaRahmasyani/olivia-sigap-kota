import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ===============================
// FIX ICON LEAFLET
// ===============================
delete L.Icon.Default.prototype._getIconUrl

// ===============================
// CUSTOM MARKER COLORS
// ===============================
function createMarker(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

const greenMarker = createMarker('green')
const yellowMarker = createMarker('yellow')
const redMarker = createMarker('red')
const blueMarker = createMarker('blue')

// ===============================
// PILIH ICON BERDASARKAN SEVERITY
// ===============================
function getMarkerIcon(report) {
  switch (report.severity) {
    case 'parah':
      return redMarker

    case 'sedang':
      return yellowMarker

    case 'ringan':
      return greenMarker

    default:
      return blueMarker
  }
}

const SURABAYA_CENTER = [-7.2575, 112.7521]

// ===============================
// COMPONENT
// ===============================
export default function MapSurabaya({ reports = [] }) {
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
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {reports
        .filter(
          report =>
            report.latitude &&
            report.longitude
        )
        .map(report => (
          <Marker
            key={report.id}
            icon={getMarkerIcon(report)}
            position={[
              parseFloat(report.latitude),
              parseFloat(report.longitude),
            ]}
          >
            <Popup>
              <div className="min-w-[220px]">
                <h3 className="font-bold text-base">
                  {report.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {report.location_address}
                </p>

                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <strong>Status:</strong>{' '}
                    {report.status}
                  </p>

                  <p>
                    <strong>Kategori:</strong>{' '}
                    {report.category?.name ?? '-'}
                  </p>

                  <p>
                    <strong>Tingkat Kerusakan:</strong>{' '}
                    {report.severity === 'parah' && '🔴 Parah'}
                    {report.severity === 'sedang' && '🟡 Sedang'}
                    {report.severity === 'ringan' && '🟢 Ringan'}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}