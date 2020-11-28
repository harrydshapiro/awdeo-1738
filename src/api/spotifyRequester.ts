import axios, { AxiosRequestConfig } from 'axios'

export interface ISpotifyApiOptions {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

export default class SpotifyApi {
  clientId!: string
  clientSecret!: string
  redirectUrl!: string
  accessToken: string | null = null
  rerefreshToken: string | null = null
  code: string | null = null

  constructor({ clientId, clientSecret, redirectUrl }: ISpotifyApiOptions) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUrl = redirectUrl
  }

  async sendRequest (method: AxiosRequestConfig['method'], url: string, data?: any) {
    const options: any = {
      method
    }
    options.headers.Authorization = `Bearer ${this.accessToken}`
    if (typeof data === 'object') options.headers["Content-Type"] = "application/json"
    try {
      return { data } = await axios(options)
    } catch {
      await this.updateAccessToken()
    }
    try {
      return { data } = await axios(options)
    } catch (err) {
      console.error('Error sending spotify request. Options:\n', options, '\nError:', err)
      // TODO: Determine the UI for handling this error... maybe just say sorry?
    }
  }

  async updateAccessToken () {
    const authHeader = `Basic ${Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64")}`
    const requestData = `refresh_token=${this.rerefreshToken}&grant_type=refresh_token`

    const { data: { accessToken }} = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: requestData
    })
  }
}