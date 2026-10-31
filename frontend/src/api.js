const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || '/api'
).replace(/\/+$/, '')

async function request(path, options) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  } catch {
    throw new Error(
      'Tidak dapat terhubung ke server. Pastikan backend Django berjalan di port 8000.',
    )
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const details = data && typeof data === 'object'
      ? Object.entries(data)
          .map(([field, messages]) => {
            const text = Array.isArray(messages) ? messages.join(', ') : messages
            return `${field}: ${text}`
          })
          .join(' ')
      : ''

    throw new Error(details || `Permintaan gagal (HTTP ${response.status}).`)
  }

  return data
}

export function getPatients() {
  return request('/patients/')
}

export function createPatient(patient) {
  return request('/patients/', {
    method: 'POST',
    body: JSON.stringify(patient),
  })
}

export function getAppointments() {
  return request('/appointments/')
}

export function createAppointment(appointment) {
  return request('/appointments/', {
    method: 'POST',
    body: JSON.stringify(appointment),
  })
}
