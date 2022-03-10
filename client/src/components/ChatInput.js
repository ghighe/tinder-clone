import { useState } from "react"

export const ChatInput = () => {
    // eslint-disable-next-line no-unused-vars
    const [textArea, setTextArea] = useState(null)
    return (
       <div className="chat-input">
           <textarea value={"textArea"} onChange={(e) => setTextArea(e.target.value)}/>
           <button className="primary-button">Send</button>
        </div>
    )
}