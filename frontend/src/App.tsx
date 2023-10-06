import { SetStateAction, useEffect, useState } from "react";
import "./App.css";
import { loadMessages, Message } from "./api";
import { postMessage } from "./api/post";
import Button from "./component/Button";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState<string>("")
  const [userMessage, setUserMessage] = useState<string>("")
  const [is503, setIs503] = useState(false)

  const loadMessagesHandler = async () => {
    setLoading(true)
    const response = await loadMessages();
    setLoading(false)
    if (!response.success) {
      setError("Nincsenek üzenetek!")
    } else {
      setMessages(response.data);
    }
  };

  useEffect(() => {
    loadMessagesHandler()
    
    let messageInternal = setInterval(loadMessagesHandler, 10000)

    return () => {
      clearInterval(messageInternal)
    } 

  }, [])

  let submit = async () => {
    const response = await postMessage(username, userMessage)
    if (response.status === 503)
      setIs503(true)
      setTimeout(() => setIs503(false) ,1000)
  }

  return (
    <div className="card w-96 shadow-xl flex flex-col items-center ">
      <div>
      <Button content="Gomb"/>
      {loading && <p>...Loading</p>}
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
      <div>
        <div>
          <input type="text" placeholder="Username" value = {username} onChange={(e) => setUsername(e.target.value)}/>
          <input type="text" placeholder="Message" value = {userMessage} onChange={(e) => setUserMessage(e.target.value)}/>
        </div>
        <div>
          <button onClick={submit}>Send Message</button>
        </div>
          {is503 && 
          <p>Sorry! Try Again!</p>}
      </div>
    </div>
  );
}

export default App;
