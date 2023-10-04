import { useEffect, useState } from "react";
import "./App.css";
import { loadMessages, Message } from "./api";
import Button from "./component/Button";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null)

  const loadMessagesHandler = async () => {
    const response = await loadMessages();
    if (!response.success) {
      setError("Nincsenek üzenetek!")
    } else {
      setMessages(response.data);
    }
  };

  useEffect(() => {
    loadMessagesHandler()
    
    let messageInternal = setInterval(loadMessagesHandler, 1000)

    return () => {
      clearInterval(messageInternal)
    } 

  }, [])

  return (
    <div className="card w-96 shadow-xl flex flex-col items-center ">
      <div>
      <Button content="Gomb"/>
      <h1>{error}</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <div>
              <p>{message.user}</p>
              <p>{message.message}</p>
              <p>{message.createdAt}</p>  
            </div> 
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default App;
