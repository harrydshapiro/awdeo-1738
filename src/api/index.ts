import SpotifyRequester from '@/api/spotifyRequester'

type AlbumPagingObject = SpotifyApi.PagingObject<{added_at: string, album: SpotifyApi.AlbumObjectFull}>

export default {
  async getAllUserAlbums () {
    const allAlbums: SpotifyApi.AlbumObjectFull[] = []

    const { items: initialItems, total, limit } = await SpotifyRequester.sendRequest<AlbumPagingObject>('GET', '/me/albums')
    const initialAlbums = initialItems.map(item => item.album)

    allAlbums.push(...initialAlbums)

    const additionalRequests: Promise<AlbumPagingObject>[] = []

    for (let i = initialAlbums.length; i < total; i += limit) {
      additionalRequests.push(SpotifyRequester.sendRequest<AlbumPagingObject>('GET', `/me/albums?offset=${i}`))
    }

    const additionalPagingObjects = await Promise.allSettled(additionalRequests) as PromiseFulfilledResult<AlbumPagingObject>[]

    additionalPagingObjects.forEach(pagingObject => {
      const albums = pagingObject.value.items.map(item => item.album)
      allAlbums.push(...albums)
    })

    return allAlbums
  },

  async transferPlayback (deviceId: string) {
    return await SpotifyRequester.sendRequest('PUT', '/me/player', {
      device_ids: [deviceId]
    })
  },

  async playPlayback (deviceId: string, contextURI?: string) {
    const path = `/me/player/play?device_id=${deviceId}`
    return await SpotifyRequester.sendRequest('PUT', path, {
      context_uri: contextURI
    })
  },

  async pausePlayback (deviceId: string) {
    const path = `/me/player/pause?device_id=${deviceId}`
    return await SpotifyRequester.sendRequest('PUT', path)
  }
}
