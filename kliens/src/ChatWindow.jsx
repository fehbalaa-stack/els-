import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Csatlakozunk a szerverhez
const socket = io.connect("https://gyerek-tracker-backend.onrender.com");

function ChatWindow({ myProfile, closeChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // 1. Üzenet küldése
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        author: myProfile.name, // Ki küldi?
        message: currentMessage,
        time: new Date().toLocaleTimeString(),
      };

      // Elküldjük a szervernek
      await socket.emit("send_message", messageData);
      
      setCurrentMessage(""); // Töröljük a mezőt
    }
  };

  // 2. Üzenet fogadása (figyeljük a szervert)
  useEffect(() => {
    const handler = (data) => {
      // Hozzáadjuk az új üzenetet a listához
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handler);

    // Takarítás, ha bezárjuk az ablakot (fontos!)
    return () => {
      socket.off("receive_message", handler);
    };
  }, []);

  return (
    <div style={{ border: '1px solid #333', borderRadius: '10px', height: '500px', display: 'flex', flexDirection: 'column', background: 'white' }}>
      
      {/* Fejléc */}
      <div style={{ background: '#333', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', borderRadius: '10px 10px 0 0' }}>
        <span>💬 Élő Chat - {myProfile.name}ként</span>
        <button onClick={closeChat} style={{ background: 'red', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
      </div>

      {/* Üzenetek Listája */}
      <div style={{ flex: 1, overflowY: 'scroll', padding: '10px' }}>
        {messageList.map((msg, index) => (
          <div key={index} style={{ 
            marginBottom: '10px',
            textAlign: msg.author === myProfile.name ? 'right' : 'left' 
          }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '10px', 
              borderRadius: '10px', 
              background: msg.author === myProfile.name ? '#007bff' : '#eee',
              color: msg.author === myProfile.name ? 'white' : 'black'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>{msg.author}</p>
              <p style={{ margin: '5px 0 0 0' }}>{msg.message}</p>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Író felület */}
      <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          value={currentMessage}
          placeholder="Írj valamit..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
          style={{ flex: 1, padding: '10px', borderRadius: '5px' }}
        />
        <button onClick={sendMessage} style={{ marginLeft: '10px', padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Küldés &#9658;
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;