/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react"

export const ChatInput = ({user,clickedUser,getUsersMessages,getClickedUsersMessages}) => {
    // eslint-disable-next-line no-unused-vars
    const [textArea, setTextArea] = useState("");
    const userId = user?.user_id;
    const partnerId = clickedUser?.user_id;

    const addMessage = async () => {
        //construct the message
        const message = {
        timestamp:new Date().toISOString(),
        from_userId:partnerId,
        to_userId:userId,
        message:textArea
        }

        try {
           const response = await axios.post("http://localhost:10000/messages", {message});
           getClickedUsersMessages();
           getUsersMessages();
           setTextArea(""); //reset the textArea after the message was sent
        } catch (error) {
          console.log(error);
        }
    }

    return (
       <div className="chat-input">
           <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
           <button className="primary-button" onClick={addMessage}>Send</button>
        </div>
    )
}