import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const SURABAYA_CENTER = [-7.2575, 112.7521]

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })

  return position ? (
    <Marker position={[position.lat, position.lng]} />
  ) : null
}

export default function LocationPickerMap({
  location,
  onChange,
}) {
  const [position, setPosition] = useState(
    location.lat && location.lng
      ? {
          lat: location.lat,
          lng: location.lng,
        }
      : null
  )

  // Reverse geocoding OpenStreetMap
  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )

      const data = await response.json()

      return {
        address: data.display_name || '',
        kelurahan:
          data.address?.suburb ||
          data.address?.village ||
          data.address?.hamlet ||
          '',
        kecamatan:
          data.address?.city_district ||
          data.address?.district ||
          '',
      }
    } catch (error) {
      console.error('Reverse geocoding gagal:', error)

      return {
        address: '',
        kelurahan: '',
        kecamatan: '',
      }
    }
  }

  const updatePosition = async pos => {
    setPosition(pos)

    const result = await getAddress(
      pos.lat,
      pos.lng
    )

    onChange({
      ...location,
      lat: pos.lat,
      lng: pos.lng,
      address: result.address,
      kelurahan: result.kelurahan,
      kecamatan: result.kecamatan,
    })
  }

  return (
    <MapContainer
      center={SURABAYA_CENTER}
      zoom={13}
      style={{
        height: '320px',
        width: '100%',
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />

      <LocationMarker
        position={position}
        setPosition={updatePosition}
      />
    </MapContainer>
  )
}