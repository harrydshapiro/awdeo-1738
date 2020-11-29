import LogRocket from 'logrocket'
import api from './api'

export function initAnalytics () {
  LogRocket.init('awdeo-1738/prod')
}

export async function identifyUser () {
  const { id, display_name } = await api.getUserInfo()
  LogRocket.identify(id, {
    name: display_name || 'unknown'
  })
}
