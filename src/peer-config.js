export const peerConfig = {
  host: "dev-xs.zto.mn",
  secure: true,
  // host: "127.0.0.1",
  // port: 3000,
  path: '/webrtc',
  config: {
    iceServers: [
      { url: 'stun:43.231.115.212:3478' },
    ],
  },
  token: "mytoken",
}