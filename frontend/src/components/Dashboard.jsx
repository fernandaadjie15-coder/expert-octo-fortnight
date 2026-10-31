import { useCallback, useEffect, useState } from 'react'
import { getPatients } from '../api'
import PatientTable from './PatientTable'
import RegistrationForm from './RegistrationForm'
import WeatherWidget from './WeatherWidget'

function Dashboard() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const loadPatients = useCallback(async () => {
    setLoading(true)
    setLoadError('')

    try {
      const data = await getPatients()
      setPatients(data)
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    getPatients()
      .then((data) => {
        if (active) {
          setPatients(data)
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  function handlePatientCreated(patient) {
    setPatients((currentPatients) => [patient, ...currentPatients])
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-xl text-white">
            +
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-teal-800">SISTEM INFORMASI RUMAH SAKIT</p>
            <p className="text-xs text-slate-500">Pendaftaran pasien rawat inap</p>
          </div>
          <div className="ml-auto hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Layanan pendaftaran
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold text-teal-700">DASHBOARD</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pasien Rawat Inap
          </h1>
          <p className="mt-2 text-slate-600">
            Kelola pendaftaran dan informasi pasien dalam satu tempat.
          </p>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total pasien terdaftar</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{patients.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Kapasitas data demo</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">Sementara</p>
          </div>
          <WeatherWidget />
        </section>

        {loadError && (
          <div
            className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
          >
            <span>{loadError}</span>
            <button
              className="w-fit rounded-lg border border-red-300 px-3 py-1.5 font-semibold hover:bg-red-100"
              onClick={loadPatients}
              type="button"
            >
              Coba lagi
            </button>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.7fr)]">
          <RegistrationForm onCreated={handlePatientCreated} />
          <PatientTable
            loading={loading}
            onRefresh={loadPatients}
            patients={patients}
          />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Data hanya disimpan sementara di memori backend dan akan terhapus saat server dimulai ulang.
        </p>
      </main>
    </div>
  )
}

export default Dashboard
