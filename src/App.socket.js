import "./App.css"
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState(null);

  const sendUsername = () => {
    socket.emit("message", {
      type: "username",
      name: username,
    });
  }

  const sendMessage = () => {
    const data = {
      type: "message",
      target,
      text: message,
    }
    socket.emit("message", data);
    setMessage("");
    if (target !== null) {
      setMessages([...messages, {...data, name: "You"}]);
    }
  }

  useEffect(() => {
    setSocket(io('ws://localhost:3000', {
      transports: ['websocket'],
    }));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log("connected to server");
      });
      socket.on("id", (id) => {
        console.log("id data: ", id);
      });
      socket.on("userlist", (users) => {
        setUsers(users);
      })
      socket.on("message", (data) => {
        console.log("message", data);
        switch(data.type) {
          case "message":
            setMessages((messages) => [...messages, data]);
            break;
          default:
            break;
        }
      });
    }
  }, [socket]);

  return (
    <div className="App" style={{padding: '10px'}}>
      <div className="user-list">
        <h3>Users</h3>
        <select size={10} onChange={(e) => setTarget(e.target.value)}>
          {users.map((username) => (
            <option key={username} value={username}>{username}</option>
          ))}
        </select>
      </div>
      <div className="login-form">
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value) } placeholder="username" />
        <button onClick={() => sendUsername()}>Submit</button>
        <h3>Chat</h3>
        <div className="chat-text">
          {messages.map((message, index) => (
            <p key={index}>{message.name}: {message.text}</p>
          ))}
        </div> 
        <input value={message} onChange={(e)=> setMessage(e.target.value) }/>
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}

export default App;
