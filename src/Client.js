import "./App.css"
import { useEffect, useState } from 'react';
import { Peer } from "peerjs";
import { VideoChat } from './VideoChat';
import { createMediaStreamFake } from './util';
import { peerConfig } from './peer-config';

function Client() {
  
  const [peer, setPeer] = useState(null);
  const [target] = useState("server");
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerStatus, setPeerStatus] = useState(false);

  const login = () => {
    setPeer(new Peer(peerConfig));
  }

  const watchStream = async () => {
    if (peer) {
      const call = peer.call(target, createMediaStreamFake());
      call.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream);
      });
    }
  }

  useEffect(() => {
    if (peer) {
      setPeerStatus(true);
      peer.on('error', (err) => {
        console.log("peer error", err);
      });
      peer.on('disconnected', (data, data2) => {
        console.log("peer disconnected", data, data2);
        setPeerStatus(false);
      });
      peer.socket.on("disconnected", (code, reason) => {
        console.log("websocket disconnected", code, reason);
      })
    } else {
      setPeerStatus(false);
    }
  }, [peer]);

  return (
    <div className="App" style={{padding: '10px'}}>
      <div className="login-form">
        <button onClick={() => login()}>Login</button>
        <b>Connected: {`${peerStatus}`}</b>
      </div>
      <div className="connect-form">
        <button onClick={() => watchStream()}>watch stream</button>
      </div>
      <div className="video-screen">
        <VideoChat remoteStream={remoteStream} />
      </div>
    </div>
  );
}

export default Client;
