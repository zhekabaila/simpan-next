'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useState, useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import { formatUTCDate } from '@/lib/utils'

export interface LocationMarker {
  id: string
  nama: string
  status: 'sudah_menerima' | 'belum_menerima'
  latitude: number
  longitude: number
  diterima_pada?: string
}

interface Coordinates {
  lat: number
  lng: number
}

interface LocationViewerProps {
  markers?: LocationMarker[]
  lat?: number
  long?: number
  singleMarker?: boolean
}

// Fix Leaflet icon issue
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom icons for status
const IconSuccess = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const IconPending = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export function LocationViewer({ markers = [], lat = -6.2, long = 106.8, singleMarker = false }: LocationViewerProps) {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: lat || -6.2,
    lng: long || 106.8
  })

  // Memoize the calculation of center to avoid infinite loops
  const centerCoordinates = useMemo(() => {
    if (markers && markers.length > 0) {
      const lats = markers.map((m) => m.latitude)
      const lngs = markers.map((m) => m.longitude)
      const avgLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const avgLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
      return { lat: avgLat, lng: avgLng }
    }

    const parsedLat = parseFloat(String(lat))
    const parsedLng = parseFloat(String(long))
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      return { lat: parsedLat, lng: parsedLng }
    }

    return { lat: -6.2, lng: 106.8 }
  }, [markers?.length, markers?.map((m) => `${m.latitude},${m.longitude}`).join(';'), lat, long])

  // Update coordinates only when centerCoordinates actually changes
  useEffect(() => {
    setCoordinates(centerCoordinates)
  }, [centerCoordinates.lat, centerCoordinates.lng])

  // Determine zoom level based on marker spread
  const calculateZoom = useMemo(() => {
    if (!markers || markers.length <= 1) return 15
    const lats = markers.map((m) => m.latitude)
    const lngs = markers.map((m) => m.longitude)
    const latDiff = Math.max(...lats) - Math.min(...lats)
    const lngDiff = Math.max(...lngs) - Math.min(...lngs)
    const maxDiff = Math.max(latDiff, lngDiff)

    if (maxDiff < 0.01) return 15
    if (maxDiff < 0.05) return 14
    if (maxDiff < 0.1) return 13
    if (maxDiff < 0.2) return 12
    return 11
  }, [markers?.length])

  const getStatusIcon = (status: 'sudah_menerima' | 'belum_menerima') => {
    return status === 'sudah_menerima' ? IconSuccess : IconPending
  }

  const getStatusLabel = (status: 'sudah_menerima' | 'belum_menerima') => {
    return status === 'sudah_menerima' ? 'Sudah Menerima' : 'Belum Menerima'
  }

  const getStatusColor = (status: 'sudah_menerima' | 'belum_menerima') => {
    return status === 'sudah_menerima' ? '#22c55e' : '#f97316'
  }

  if (singleMarker && !markers?.length) {
    return (
      <div className="space-y-3">
        {/* Coordinates Display */}
        <div className="text-sm text-slate-600">
          <p className="font-semibold mb-2">Lokasi Rumah</p>
          <p className="text-sm">
            Latitude: <span className="font-medium">{coordinates.lat.toFixed(6)}</span>
          </p>
          <p className="text-sm">
            Longitude: <span className="font-medium">{coordinates.lng.toFixed(6)}</span>
          </p>
        </div>

        {/* Map */}
        <div className="w-full aspect-video rounded-md overflow-hidden border border-slate-200 relative">
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            style={{ width: '100%', height: '100%' }}
            dragging={true}
            zoomControl={true}
            scrollWheelZoom={true}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[coordinates.lat, coordinates.lng]} icon={defaultIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-medium">Lokasi Rumah</p>
                  <p className="text-slate-600">Lat: {coordinates.lat.toFixed(6)}</p>
                  <p className="text-slate-600">Lng: {coordinates.lng.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 z-0">
      {/* Map */}
      <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-200 relative shadow-sm z-0">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={calculateZoom}
          style={{ width: '100%', height: '100%' }}
          dragging={true}
          zoomControl={true}
          scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Render markers */}
          {markers &&
            markers.map((marker) => (
              <Marker key={marker.id} position={[marker.latitude, marker.longitude]} icon={getStatusIcon(marker.status)}>
                <Popup>
                  <div className="text-sm min-w-48">
                    <p className="font-semibold text-slate-800">{marker.nama}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Status:</span>
                        <span
                          className={`font-semibold ${
                            marker.status === 'sudah_menerima' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                          {getStatusLabel(marker.status)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Lat:</span>
                        <span className="font-mono text-slate-700">{marker.latitude.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Lng:</span>
                        <span className="font-mono text-slate-700">{marker.longitude.toFixed(6)}</span>
                      </div>
                      {marker.diterima_pada && (
                        <div className="flex justify-between text-xs border-t border-slate-100 pt-1 mt-1">
                          <span className="text-slate-600">Diterima:</span>
                          <span className="text-slate-700">{formatUTCDate(marker.diterima_pada, 'datetime')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Info text */}
      <p className="text-xs text-slate-500 text-center">💡 Gunakan scroll untuk zoom, drag untuk geser peta</p>
    </div>
  )
}
