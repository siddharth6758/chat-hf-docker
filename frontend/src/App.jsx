import { useState, useEffect, useRef } from 'react';
import './App.css';

const examplePrompts = [
  "Hello, how are you?",
  "What's your favorite color?",
  "Tell me a joke!",
];

function App() {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const historyRef = useRef(null);

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history, isLoading]);

    const handleSend = async (prompt) => {
        if (!prompt || isLoading) return;

        const userMessage = { role: 'user', content: prompt };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt }),
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const data = await res.json();
            const botMessage = { role: 'bot', content: data.response };
            setHistory(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { role: 'bot', content: 'Sorry, I ran into an error. Please try again.' };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const showWelcomeScreen = history.length === 0;

    return (
        <div className="app-container">
            <div className="chat-window">
                <div className="chat-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Chatbot</span>
                </div>

                <div className="chat-history" ref={historyRef}>
                    {showWelcomeScreen ? (
                        <div className="welcome-screen">
                            <div className="example-prompts">
                                {examplePrompts.map((prompt, i) => (
                                    <button key={i} className="prompt-button" onClick={() => handleSend(prompt)}>
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        history.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <p>{msg.content}</p>
                            </div>
                        ))
                    )}
                    {isLoading && !showWelcomeScreen && (
                        <div className="message bot">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="chat-input-area">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend(message)}
                    />
                    <button className="send-button" onClick={() => handleSend(message)} disabled={isLoading || !message.trim()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
