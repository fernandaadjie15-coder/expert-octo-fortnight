const roomLabels = {
  VIP: 'VIP',
  'Class 1': 'Kelas 1',
  'Class 2': 'Kelas 2',
  'Class 3': 'Kelas 3',
}

function PatientTable({ patients, loading, onRefresh }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daftar pasien</h2>
          <p className="mt-1 text-sm text-slate-500">Data pasien rawat inap terdaftar</p>
        </div>
        <button
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          disabled={loading}
          onClick={onRefresh}
          type="button"
        >
          {loading ? 'Memuat...' : 'Muat ulang'}
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-sm text-slate-500" role="status">
          Memuat data pasien...
        </div>
      ) : patients.length === 0 ? (
        <div className="p-10 text-center">
          <p className="font-semibold text-slate-700">Belum ada pasien terdaftar</p>
          <p className="mt-1 text-sm text-slate-500">Data pasien baru akan tampil di sini.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold sm:px-6">Pasien</th>
                <th className="px-4 py-3 font-semibold">Usia / gender</th>
                <th className="px-4 py-3 font-semibold">Kamar</th>
                <th className="px-5 py-3 font-semibold sm:px-6">Gejala / diagnosis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr className="align-top hover:bg-slate-50/70" key={patient.id}>
                  <td className="px-5 py-4 font-semibold text-slate-900 sm:px-6">
                    {patient.full_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {patient.age} th. ·{' '}
                    {patient.gender === 'Male'
                      ? 'Laki-laki'
                      : patient.gender === 'Female'
                        ? 'Perempuan'
                        : 'Lainnya'}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                      {roomLabels[patient.room_type] || patient.room_type}
                    </span>
                  </td>
                  <td className="max-w-xs px-5 py-4 text-slate-600 sm:px-6">
                    {patient.symptoms_diagnosis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default PatientTable
