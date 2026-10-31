import { useState } from 'react'
import { createPatient } from '../api'

const initialForm = {
  full_name: '',
  age: '',
  gender: '',
  room_type: '',
  symptoms_diagnosis: '',
}

const inputClassName =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'

function RegistrationForm({ onCreated }) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const patient = await createPatient({
        ...form,
        age: Number(form.age),
      })
      onCreated(patient)
      setForm(initialForm)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Pendaftaran baru</h2>
        <p className="mt-1 text-sm text-slate-500">Lengkapi informasi pasien berikut.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Nama lengkap
          <input
            autoComplete="name"
            className={inputClassName}
            maxLength={150}
            name="full_name"
            onChange={handleChange}
            placeholder="Nama sesuai identitas"
            required
            value={form.full_name}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-slate-700">
            Usia
            <input
              className={inputClassName}
              max="150"
              min="0"
              name="age"
              onChange={handleChange}
              placeholder="Contoh: 35"
              required
              type="number"
              value={form.age}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Jenis kelamin
            <select
              className={inputClassName}
              name="gender"
              onChange={handleChange}
              required
              value={form.gender}
            >
              <option disabled value="">Pilih</option>
              <option value="Male">Laki-laki</option>
              <option value="Female">Perempuan</option>
              <option value="Other">Lainnya</option>
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Tipe kamar
          <select
            className={inputClassName}
            name="room_type"
            onChange={handleChange}
            required
            value={form.room_type}
          >
            <option disabled value="">Pilih kelas kamar</option>
            <option value="VIP">VIP</option>
            <option value="Class 1">Kelas 1</option>
            <option value="Class 2">Kelas 2</option>
            <option value="Class 3">Kelas 3</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Gejala / diagnosis
          <textarea
            className={`${inputClassName} min-h-24 resize-y`}
            maxLength={1000}
            name="symptoms_diagnosis"
            onChange={handleChange}
            placeholder="Jelaskan keluhan atau diagnosis pasien"
            required
            value={form.symptoms_diagnosis}
          />
        </label>

        <button
          className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Mendaftarkan...' : 'Daftarkan pasien'}
        </button>
      </form>
    </section>
  )
}

export default RegistrationForm
