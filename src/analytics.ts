import LogRocket from 'logrocket'
import api from './api'

function initLogRocket () {
  LogRocket.init('awdeo-1738/prod')
}

declare global {
  interface Window { dataLayer: any; }
}

window.dataLayer = window.dataLayer || {}

function initGA () {
  const gaScriptTag = document.createElement('script')
  gaScriptTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-KGERYQRF9N'
  gaScriptTag.async = true
  window.dataLayer = window.dataLayer || []
  function gtag () { window.dataLayer.push(arguments) }
  // @ts-ignore
  gtag('js', new Date())
  // @ts-ignore
  gtag('config', 'G-KGERYQRF9N')
}

export function initAnalytics () {
  initLogRocket()
  initGA()
}

export async function identifyUser () {
  const { id, display_name } = await api.getUserInfo()
  LogRocket.identify(id, {
    name: display_name || 'unknown'
  })
}
