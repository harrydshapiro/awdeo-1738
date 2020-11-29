/* eslint-disable */

export default function webPlayerSetup (accessToken: string, playerCallback: any) {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'My Test Spotify Player',
      getOAuthToken: (callback: any) => {
        callback(accessToken)
      }
    })

    playerCallback(player)
  }

  const scriptTag = document.createElement('script')
  scriptTag.src = 'https://sdk.scdn.co/spotify-player.js'
  document.head.appendChild(scriptTag)
};
