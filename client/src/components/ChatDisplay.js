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
    const [clickedUserMessages, setClickedUsersMessages] = useState(null);

    const getUsersMessages = async() => {
        try {
        const response = await axios.get('http://localhost:10000/messages', {
            params:{userId:userId, partnerUserId:partnerUserId}
        })
        setUsersMessages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getClickedUsersMessages = async() => {
        try {
        const response = await axios.get('http://localhost:10000/messages', {
            params:{userId:partnerUserId, partnerUserId:userId}
        })
        setClickedUsersMessages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsersMessages();
        getClickedUsersMessages();
        setLoading(false);
    },[])

    if(isLoading) {
        return (<div>UsersMessages fetching from DB...</div>);
    }

    const messages = [];

    //format the messages for the users messages so we can have the avatar and the name in the newly created arr
    usersMessages?.forEach(message => {
       const formattedMessage = {};
       formattedMessage['name'] = clickedUser?.first_name;
       formattedMessage['img'] = clickedUser?.url;
       formattedMessage['message'] = message.message;
       formattedMessage['timestamp'] = message.timestamp;
       messages.push(formattedMessage);
    });

    //format the messages for the clickedUsersMessages so we can have the avatar and the name in the newly created arr
    clickedUserMessages?.forEach(message => {
        const formattedMessage = {};
        formattedMessage['name'] = user?.first_name;
        formattedMessage['img'] = user?.url;
        formattedMessage['message'] = message.message;
        formattedMessage['timestamp'] = message.timestamp;
        messages.push(formattedMessage);
     });

     const sortingDateMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp));

      return (
          <>
          <Chat sortingDateMessages={sortingDateMessages}/>
          <ChatInput user={user}
                    clickedUser={clickedUser}
                    getUsersMessages={getUsersMessages}
                    getClickedUsersMessages={getClickedUsersMessages}/>
          </>
      )
}