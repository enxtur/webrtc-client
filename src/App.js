import "./App.css"
import { useEffect, useState } from 'react';
import { Peer } from "peerjs";
import { VideoChat } from './VideoChat';

const videoConstraints = {
  audio: true,            // We want an audio track
  video: {
    aspectRatio: {
      ideal: 1.333333     // 3:2 aspect is preferred
    }
  }
};

const audioConstraints = {
  audio: true,            // We want an audio track
};


function App() {
  
  const [peer, setPeer] = useState(null);
  const [username, setUsername] = useState("642b924b64ec50e73fba6be1");
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidWlkIjoiNjQyYjkyNGI2NGVjNTBlNzNmYmE2YmUxIiwiaWF0IjoxNTE2MjM5MDIyfQ.rgSHVXwK0WhMAK_P23u10fiWiZDVCSlO0whxtaEdjZA");
  // const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState("");
  const [target, setTarget] = useState("");
  // const [connection, setConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerStatus, setPeerStatus] = useState(false);

  const login = () => {
    setPeer(new Peer(username, {
      host: 'dev-xs.zto.mn',
      secure: true,
      path: '/webrtc',
      config: {
        iceServers: [
          { url: 'stun:43.231.115.212:3478' },
          // { url: 'stun:stun.l.google.com:19302' },
          // { url: 'stun:stun1.l.google.com:19302' },
          // { url: 'stun:stun2.l.google.com:19302' },
          // { url: 'stun:stun3.l.google.com:19302' },
          // { url: 'stun:stun4.l.google.com:19302' },
        ],
      },
      token,
    }));
  }

  // const connect = () => {
  //   if (peer) {
  //     setConnection(peer.connect(target));
  //   }
  // }

  // const sendMessage = () => {
  //   if (connection) {
  //     connection.send(message);
  //     setMessages([...messages, {name: username, text: message}]);
  //     setMessage("");
  //   }
  // }

  const startVideoCall = async () => {
    if (peer) {
      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      const call = peer.call(target, stream, { metadata: {type: 'video'} });
      call.on('stream', (remoteStream) => {
        console.log("on caller stream", typeof remoteStream);
        // setVideoSrc(remoteStream);
        // setVideoSrc(window.URL.createObjectURL(remoteStream));
        setRemoteStream(remoteStream);
      });
    }
  }
  const startAudioCall = async () => {
    if (peer) {
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      const call = peer.call(target, stream, { metadata: {type: 'audio'} });
      call.on('stream', (remoteStream) => {
        console.log("on caller stream", typeof remoteStream);
        // setVideoSrc(remoteStream);
        // setVideoSrc(window.URL.createObjectURL(remoteStream));
        setRemoteStream(remoteStream);
      });
    }
  }

  useEffect(() => {
    if (peer) {
      setPeerStatus(true);
      console.log("peer", peer);
      // peer.on('connection', (conn) => {
      //   setConnection(conn);
      // });
      peer.on('call', async (call) => {
        // determine if video or audio call but call.metadata is undefined
        console.log("on call", call);
        const mediaConstraints = call.metadata.type === 'video' ? videoConstraints : audioConstraints;
        const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream) => {
          console.log("on callee stream", typeof remoteStream);
          // setVideoSrc(window.URL.createObjectURL(remoteStream));
          setRemoteStream(remoteStream);
        });
      });
      peer.on('error', (err) => {
        console.log("peer error", err);
      });
      peer.on('disconnected', (data, data2) => {
        console.log("peer disconnected", data, data2);
        setPeerStatus(false);
      });
      console.log("peer.socket", peer.socket);
      peer.socket.on("disconnected", (code, reason) => {
        console.log("websocket disconnected", code, reason);
      })
    } else {
      setPeerStatus(false);
    }
  }, [peer]);

  // useEffect(() => {
  //   if (connection) {
  //     console.log("connection", connection);
  //     connection.on('open', () => {
  //       connection.send('Hello!');
  //     });
  //     connection.on('data', (data) => {
  //       console.log("data", data);
  //       setMessages([...messages, {name: connection.peer, text: data}]);
  //     });
  //   }
  // }, [connection]);

  return (
    <div className="App" style={{padding: '10px'}}>
      <div className="login-form">
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value) } placeholder="username" />
        <input type="text" value={token} onChange={(e) => setToken(e.target.value) } placeholder="token" />
        <button onClick={() => login()}>Login</button>
        <b>Connected: {`${peerStatus}`}</b>
      </div>
      <div className="connect-form">
        <input type="text" value={target} onChange={(e) => setTarget(e.target.value) } placeholder="target" />
        {/* <button onClick={() => connect()}>Connect chat</button> */}
        <button onClick={() => startVideoCall()}>Video call</button>
        <button onClick={() => startAudioCall()}>Audi call</button>
      </div>
      {/* <div className="chat">
        <h3>Chat</h3>
        <div className="chat-text">
          {messages.map((message, index) => (
            <p key={index}>{message.name}: {message.text}</p>
          ))}
        </div>
        <input value={message} onChange={(e)=> setMessage(e.target.value) }/>
        <button onClick={() => sendMessage()}>Send</button>
      </div> */}
      <div className="video-screen">
        <VideoChat remoteStream={remoteStream} />
      </div>
    </div>
  );
}

export default App;
