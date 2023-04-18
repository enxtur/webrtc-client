export const peerConfig = {
  host: "025b-66-181-186-221.ngrok-free.app",
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