import { request } from '../../api'

export function getAppointments() {
  return request('/appointments/')
}

export function createAppointment(appointment) {
  return request('/appointments/', {
    method: 'POST',
    body: JSON.stringify(appointment),
  })
}
