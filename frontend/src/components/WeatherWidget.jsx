import { useEffect, useState } from 'react'

const DEFAULT_LOCATION = {
  latitude: -6.2088,
  longitude: 106.8456,
  name: 'Jakarta',
}

const weatherDescriptions = {
  0: 'Cerah',
  1: 'Cerah berawan',
  2: 'Berawan sebagian',
  3: 'Berawan',
  45: 'Berkabut',
  48: 'Kabut tebal',
  51: 'Gerimis ringan',
  53: 'Gerimis',
  55: 'Gerimis lebat',
  56: 'Gerimis beku ringan',
  57: 'Gerimis beku lebat',
  61: 'Hujan ringan',
  63: 'Hujan',
  65: 'Hujan lebat',
  66: 'Hujan beku ringan',
  67: 'Hujan beku lebat',
  71: 'Salju ringan',
  73: 'Salju',
  75: 'Salju lebat',
  77: 'Butiran salju',
  80: 'Hujan lokal ringan',
  81: 'Hujan lokal',
  82: 'Hujan lokal lebat',
  85: 'Hujan salju ringan',
  86: 'Hujan salju lebat',
  95: 'Badai petir',
  96: 'Badai petir dengan hujan es ringan',
  99: 'Badai petir dengan hujan es lebat',
}

async function fetchWeather(location, signal) {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    timezone: 'auto',
  })
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(`Layanan cuaca gagal merespons (HTTP ${response.status}).`)
  }

  const data = await response.json()
  const current = data.current
  const requiredValues = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'weather_code',
    'wind_speed_10m',
  ]

  if (!current || !requiredValues.every((key) => typeof current[key] === 'number')) {
    throw new Error('Data cuaca belum tersedia untuk lokasi ini.')
  }

  return current
}

function WeatherWidget() {
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchWeather(location, controller.signal)
      .then(setWeather)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Cuaca tidak dapat dimuat. Coba lagi.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [location])

  function reloadWeather() {
    setLoading(true)
    setError('')
    fetchWeather(location)
      .then(setWeather)
      .catch((requestError) => {
        setError(requestError.message || 'Cuaca tidak dapat dimuat. Coba lagi.')
      })
      .finally(() => setLoading(false))
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Browser ini tidak mendukung akses lokasi.')
      return
    }

    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLoading(true)
        setError('')
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          name: 'Lokasi Anda',
        })
        setLocating(false)
      },
      (locationError) => {
        setError(
          locationError.code === locationError.PERMISSION_DENIED
            ? 'Izin lokasi ditolak. Cuaca untuk lokasi sebelumnya tetap ditampilkan.'
            : 'Lokasi tidak dapat ditemukan. Cuaca untuk lokasi sebelumnya tetap ditampilkan.',
        )
        setLocating(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  const description = weather
    ? weatherDescriptions[weather.weather_code] || 'Kondisi cuaca'
    : ''

  return (
    <section
      aria-label="Informasi cuaca"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-slate-500">Cuaca saat ini</h2>
          <p className="mt-1 text-sm font-semibold text-slate-800">{location.name}</p>
        </div>
        <span aria-hidden="true" className="text-2xl">
          🌤️
        </span>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500" role="status">Memuat cuaca...</p>
      ) : error && !weather ? (
        <div className="mt-4">
          <p className="text-sm text-red-700" role="alert">{error}</p>
          <button
            className="mt-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
            onClick={reloadWeather}
            type="button"
          >
            Coba lagi
          </button>
        </div>
      ) : weather ? (
        <>
          <div className="mt-3 flex items-end gap-2">
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              {Math.round(weather.temperature_2m)}°
            </p>
            <p className="pb-1 text-sm text-slate-600">{description}</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Terasa seperti {Math.round(weather.apparent_temperature)}° · Kelembapan{' '}
            {weather.relative_humidity_2m}% · Angin {weather.wind_speed_10m} km/j
          </p>
        </>
      ) : null}

      {error && weather && (
        <p className="mt-2 text-xs text-amber-700" role="status">{error}</p>
      )}

      <button
        className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-800 disabled:cursor-wait disabled:opacity-60"
        disabled={locating}
        onClick={useCurrentLocation}
        type="button"
      >
        {locating ? 'Mencari lokasi...' : 'Gunakan lokasi saya'}
      </button>
    </section>
  )
}

export default WeatherWidget
