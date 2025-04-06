import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message to the UI immediately
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Adjust the URL below to match your deployed backend endpoint
      const response = await fetch('https://test-agents-app.azurewebsites.net/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      
      // Assuming the backend returns messages in a list, adjust as needed:
      // Here we assume that the agent's reply is the second message
      const agentMessage = data.messages[data.messages.length - 1].content || 'No reply';
      setMessages(prev => [...prev, { role: 'agent', text: agentMessage }]);
    } catch (error) {
      console.error("Error calling backend:", error);
      setMessages(prev => [...prev, { role: 'agent', text: 'Error occurred.' }]);
    }
    setInput('');
  };

  return (
    <div className="App" style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Chat with Agent</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '300px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <p>
              <strong>{msg.role === 'user' ? "You" : "Agent"}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          style={{ width: '80%', padding: '8px' }}
        />
        <button onClick={handleSend} style={{ padding: '8px' }}>Send</button>
      </div>
    </div>
  );
}

export default App;
