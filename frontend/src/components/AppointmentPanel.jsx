import { useEffect, useState } from 'react'
import { createAppointment, getAppointments } from '../api'

const departments = ['Umum', 'Anak', 'Kandungan', 'Jantung']
const inputClassName =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'

function getLocalDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function formatAppointmentDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    dateStyle: 'medium',
  })
}

function AppointmentPanel({ patients }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    patient_id: '',
    department: '',
    doctor_name: '',
    appointment_date: getLocalDate(),
    appointment_time: '',
    reason: '',
  })

  async function loadAppointments() {
    setLoading(true)
    setError('')

    try {
      setAppointments(await getAppointments())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    getAppointments()
      .then((data) => {
        if (active) {
          setAppointments(data)
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message)
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

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const appointment = await createAppointment(form)
      setAppointments((currentAppointments) => [
        appointment,
        ...currentAppointments,
      ])
      setForm((currentForm) => ({
        ...currentForm,
        patient_id: '',
        doctor_name: '',
        appointment_time: '',
        reason: '',
      }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="mb-1 text-sm font-semibold text-teal-700">LAYANAN POLI</p>
        <h2 className="text-xl font-bold text-slate-900">Janji temu pasien</h2>
        <p className="mt-1 text-sm text-slate-500">
          Atur jadwal kunjungan pasien ke poli rumah sakit.
        </p>
      </div>

      {error && (
        <div
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {patients.length === 0 ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Daftarkan pasien terlebih dahulu sebelum membuat janji temu.
        </p>
      ) : (
        <form
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={handleSubmit}
        >
          <label className="block text-sm font-medium text-slate-700">
            Pasien
            <select
              className={inputClassName}
              name="patient_id"
              onChange={handleChange}
              required
              value={form.patient_id}
            >
              <option disabled value="">Pilih pasien</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Poli
            <select
              className={inputClassName}
              name="department"
              onChange={handleChange}
              required
              value={form.department}
            >
              <option disabled value="">Pilih poli</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  Poli {department}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Nama dokter
            <input
              className={inputClassName}
              maxLength={150}
              name="doctor_name"
              onChange={handleChange}
              placeholder="Contoh: dr. Andi"
              required
              value={form.doctor_name}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Tanggal
            <input
              className={inputClassName}
              min={getLocalDate()}
              name="appointment_date"
              onChange={handleChange}
              required
              type="date"
              value={form.appointment_date}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Waktu
            <input
              className={inputClassName}
              name="appointment_time"
              onChange={handleChange}
              required
              type="time"
              value={form.appointment_time}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Keluhan (opsional)
            <input
              className={inputClassName}
              maxLength={500}
              name="reason"
              onChange={handleChange}
              placeholder="Ringkasan keluhan"
              value={form.reason}
            />
          </label>

          <div className="sm:col-span-2 lg:col-span-3">
            <button
              className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Menyimpan jadwal...' : 'Buat janji temu'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-7 border-t border-slate-100 pt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">Jadwal kunjungan</h3>
            <p className="mt-1 text-sm text-slate-500">
              {appointments.length} janji temu terjadwal
            </p>
          </div>
          <button
            className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            disabled={loading}
            onClick={loadAppointments}
            type="button"
          >
            {loading ? 'Memuat...' : 'Muat ulang'}
          </button>
        </div>

        {loading ? (
          <p className="py-5 text-center text-sm text-slate-500" role="status">
            Memuat jadwal...
          </p>
        ) : appointments.length === 0 ? (
          <p className="rounded-lg bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
            Belum ada janji temu.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <li
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                key={appointment.id}
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {appointment.patient_name}
                    <span className="ml-2 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                      Poli {appointment.department}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {appointment.doctor_name}
                    {appointment.reason ? ` · ${appointment.reason}` : ''}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-slate-700">
                  {formatAppointmentDate(appointment.appointment_date)} ·{' '}
                  {appointment.appointment_time}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default AppointmentPanel
