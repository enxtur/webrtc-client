import "./App.css"
import { useEffect, useState } from 'react';
import { Peer } from "peerjs";
import { VideoChat } from './VideoChat';
import { peerConfig } from './peer-config';

const constraints = {
  audio: true,            // We want an audio track
  video: {
    aspectRatio: {
      ideal: 1.333333     // 3:2 aspect is preferred
    }
  }
};

function Server() {
  
  const [peer, setPeer] = useState(null);
  const [peerStatus, setPeerStatus] = useState(false);
  const [stream, setStream] = useState(null);
  const [count, setCount] = useState(0);

  const login = () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        setStream(stream)
        setPeer(new Peer("server", peerConfig));
      })
      .catch(console.log);
    
  }

  useEffect(() => {
    if (peer && stream) {
      setPeerStatus(true);
      peer.on('call', async (call) => {
        console.log("on call", call);
        call.answer(stream); // Answer the call with an A/V stream.
      });
      peer.on('error', (err) => {
        console.log("peer error", err);
      });
      peer.on('disconnected', (data, data2) => {
        setPeerStatus(false);
      });
      peer.socket.on("disconnected", (code, reason) => {
        console.log("websocket disconnected", code, reason);
      });
      peer.socket.on("message", (message) => {
        console.log("websocket disconnected", message);
        if (message.type === "clients") {
          setCount(message.payload.count);
        }
      });
    } else {
      setPeerStatus(false);
    }
  }, [peer, stream]);

  // useEffect(() => {
  //   login();
  // }, [stream]);

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia(constraints)
  //     .then(setStream)
  //     .catch(console.log);
  // }, []);

  return (
    <div className="App" style={{padding: '10px'}}>
      <div className="login-form">
        <button onClick={() => login()}>start</button>
        <b>Connected: {`${peerStatus}`} </b>
        <b>Views: {`${count}`}</b>
      </div>
      <div className="video-screen">
        {stream && <VideoChat remoteStream={stream} />}
      </div>
    </div>
  );
}

export default Server;
