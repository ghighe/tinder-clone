/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Chat } from "./Chat";
import { ChatInput } from "./ChatInput";
import {useState, useEffect} from 'react';
import axios from "axios";

export const ChatDisplay = ({user,clickedUser}) => {

    const userId = user?.user_id;
    const partnerUserId = clickedUser?.user_id;

    const [isLoading, setLoading] = useState(true);
    const [usersMessages, setUsersMessages] = useState(null);

    const getUsersMessages = async() => {
        try {
        const response = await axios.get('http://localhost:10000/messages', {
            params:{userId:userId, partnerUserId:partnerUserId}
        })
            setUsersMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
      getUsersMessages();
    },[])

    if(isLoading) {
        return (<div>UsersMessages fetching from DB...</div>);
    }

    console.log("Users message is ", usersMessages);


      return (
          <>
          <Chat />
          <ChatInput />
          </>
      )
}