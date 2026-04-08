'use client'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, Loader2, MapPin, Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'

interface LatLng {
  lat: number
  lng: number
}

interface LocationPickerProps {
  value?: { lat?: number; long?: number; address?: string }
  onChange: (value: { lat: number; long: number; address: string }) => void
  disabled?: boolean
  required?: boolean
  placeholder?: string
  addressPlaceholder?: string
  className?: string
}

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface Suggestion {
  place_id: number
  description: string
  lat: string
  lon: string
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

function MapClickHandler({
  onLocationSelect,
  disabled
}: {
  onLocationSelect: (lat: number, lng: number) => void
  disabled: boolean
}) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    }
  })
  return null
}

export function LocationPicker({
  value,
  onChange,
  disabled = false,
  required = false,
  addressPlaceholder = 'Cari alamat...',
  className
}: LocationPickerProps) {
  const [coordinates, setCoordinates] = useState<LatLng>({
    lat: value?.lat || -6.2,
    lng: value?.long || 106.8
  })
  const [addressInput, setAddressInput] = useState(value?.address || '')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const geolocationAttemptedRef = useRef(false)

  // Update coordinates when value prop changes
  useEffect(() => {
    if (value?.lat && value?.long) {
      const lat = parseFloat(String(value.lat))
      const lng = parseFloat(String(value.long))
      if (!isNaN(lat) && !isNaN(lng)) {
        setCoordinates({ lat, lng })
        setMapKey((prev) => prev + 1)
      }
    }
    if (value?.address) {
      setAddressInput(value.address)
    }
  }, [value?.lat, value?.long, value?.address])

  const updateLocation = useCallback(
    async (lat: number, lng: number, address?: string) => {
      setCoordinates({ lat, lng })

      if (address) {
        setAddressInput(address)
        onChange({
          lat,
          long: lng,
          address
        })
      } else {
        // Reverse geocode using Nominatim
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          const data = await response.json()
          const fullAddress = data.address?.road
            ? `${data.address.road}${data.address.house_number ? ' ' + data.address.house_number : ''}, ${data.address.suburb || data.address.city || ''}, ${data.address.province || ''}`
            : data.display_name || 'Unknown Location'

          setAddressInput(fullAddress)
          onChange({
            lat,
            long: lng,
            address: fullAddress
          })
        } catch (error) {
          console.error('Reverse geocoding failed:', error)
          onChange({
            lat,
            long: lng,
            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          })
        }
      }
    },
    [onChange]
  )

  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        await updateLocation(latitude, longitude)
        setMapKey((prev) => prev + 1)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setIsGettingLocation(false)
        if (error.code === 1) {
          alert('Izin geolocation ditolak. Silakan izinkan akses lokasi di pengaturan browser.')
        } else if (error.code === 2) {
          alert('Lokasi tidak dapat dipastikan.')
        } else if (error.code === 3) {
          alert('Request geolocation timeout.')
        } else {
          alert('Terjadi kesalahan saat mendapatkan lokasi.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [updateLocation])

  // Request geolocation on component mount (only if no value provided)
  useEffect(() => {
    if (geolocationAttemptedRef.current || value?.lat || value?.long) return

    geolocationAttemptedRef.current = true

    if (!navigator.geolocation) {
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        await updateLocation(latitude, longitude)
        setMapKey((prev) => prev + 1)
        setIsGettingLocation(false)
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [updateLocation])

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.length < 2) {
      setSuggestions([])
      setIsDropdownOpen(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}, Indonesia&limit=8`
      )
      const data: NominatimResult[] = await response.json()

      console.log('data', data)

      if (data && data.length > 0) {
        setSuggestions(
          data.map((item) => ({
            place_id: item.place_id,
            description: item.display_name,
            lat: item.lat,
            lon: item.lon
          }))
        )
        setIsDropdownOpen(true)
      } else {
        setSuggestions([])
        setIsDropdownOpen(false)
      }
    } catch (error) {
      console.error('Search failed:', error)
      setSuggestions([])
      setIsDropdownOpen(false)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleAddressChange = (value: string) => {
    setAddressInput(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 400)
  }

  const handleAddressSelect = async (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat)
    const lng = parseFloat(suggestion.lon)
    setAddressInput(suggestion.description)
    setSuggestions([])
    setIsDropdownOpen(false)
    await updateLocation(lat, lng, suggestion.description)
    setMapKey((prev) => prev + 1)
  }

  const handleManualSearch = async () => {
    if (!addressInput || addressInput.length < 2) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}, Indonesia&limit=1`
      )
      const data: NominatimResult[] = await response.json()

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        await updateLocation(lat, lng, data[0].display_name)
        setMapKey((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
      setIsDropdownOpen(false)
    }
  }

  // Update dropdown position when it opens
  useEffect(() => {
    if (isDropdownOpen && searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [isDropdownOpen, suggestions])

  return (
    <div className="space-y-3">
      <input type="hidden" value={value?.lat || ''} />
      <input type="hidden" value={value?.long || ''} />

      {/* Address Search Section */}
      <div className="relative" ref={searchContainerRef}>
        <Label className="text-xs text-muted-foreground mb-1 block">Alamat</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            disabled={disabled}
            required={required}
            placeholder={addressPlaceholder}
            value={addressInput}
            onChange={(e) => handleAddressChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleManualSearch()
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsDropdownOpen(true)
            }}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled || isGettingLocation}
            title="Gunakan lokasi saat ini"
            onClick={requestCurrentLocation}>
            {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled || isSearching}
            onClick={handleManualSearch}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Suggestions Dropdown - Using Fixed Positioning */}
        {isDropdownOpen && suggestions.length > 0 && dropdownPosition && (
          <div className="absolute top-16 left-0 z-[9999] bg-white border rounded-md shadow-lg max-h-60 max-w-[600px] overflow-x-auto overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleAddressSelect(suggestion)
                }}
                className="w-full p-3 hover:bg-blue-50 text-left border-b last:border-b-0 flex items-start gap-2 transition-colors">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 truncate">{suggestion.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {addressInput && !isSearching && suggestions.length === 0 && isDropdownOpen && dropdownPosition && (
          <div
            className="fixed z-[9999] bg-white border rounded-md shadow-lg p-3"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}>
            <p className="text-sm text-slate-500">Tidak ada hasil yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Coordinates Display */}
      <div className="text-xs text-slate-500">
        Lat: {coordinates.lat.toFixed(6)} | Lng: {coordinates.lng.toFixed(6)}
      </div>

      {/* Map */}
      <div className={cn('w-full aspect-square rounded-md overflow-hidden border relative', className)}>
        <MapContainer
          key={mapKey}
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
          dragging={!disabled}
          zoomControl={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onLocationSelect={updateLocation} disabled={disabled} />
          <Marker
            position={[coordinates.lat, coordinates.lng]}
            icon={defaultIcon}
            draggable={!disabled}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng()
                updateLocation(lat, lng)
              }
            }}>
            <Popup>
              <div className="text-sm">
                <p className="font-medium">Lokasi Terpilih</p>
                <p className="text-slate-600">{addressInput || 'Tidak ada alamat'}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Info Text */}
      <p className="text-xs text-slate-500">
        💡 Klik pada peta atau geser marker untuk mengubah lokasi. Gunakan search untuk mencari alamat spesifik.
      </p>
    </div>
  )
}
