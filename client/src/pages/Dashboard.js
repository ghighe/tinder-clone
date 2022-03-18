/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import { ChatContainer } from "../components/ChatContainer";
import axios from "axios";

export const Dashboard = () => {


  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [lastDirection, setLastDirection] = useState(null);

const userId = cookies.UserId;
//get user from the backend


// const getUser = async() => {

//   try {
//     const response = await axios.get(`http://localhost:10000/user/${userId}`);
//     setUser(response.data);
//     console.log("user", user);
//   } catch (error) {
//     console.log(error)
//   }
// }

//   const getGenderedUsers = async() => {

//     try {
//       const response =  await axios.get(`http://localhost:10000/gendered-users/${user?.gender_interest}`);
//     console.log("getGenderedUsers ",response);
//       setGenderedUsers(response.data);
//     } catch (error) {
//       console.log(error);
//     }
// }

  //call useEffect everytime the user change

 useEffect(async () => {
   console.log("useEffect run");
  const getUser = async () => {
    try {
      return await axios.get(`http://localhost:10000/user/${userId}`)
    }catch(error){
      console.log(error);
    }
  };
    const firstResponse = await getUser();
    setUser(firstResponse.data);

    const getGenderedUsers = async() => {
      try {
        return await axios.get(`http://localhost:10000/gendered-users/${firstResponse.data?.gender_interest}`)
      } catch (error) {
        console.log(error);
      }
  }
  const secondResponse = await getGenderedUsers();
  setGenderedUsers(secondResponse.data);

 },[]);


  const characters = [];

  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };


  return (
    <>
    {user &&
    <div className="dashboard">
      <ChatContainer user={user} />
      <div className="swipe-container">
        <div className="card-container">
          {genderedUsers?.map((character) => (
            <TinderCard
              className="swipe"
              key={character._id}
              onSwipe={(dir) => swiped(dir, character.first_name)}
              onCardLeftScreen={() => outOfFrame(character.first_name)}
            >
              <div
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="card"
              >
                <h3>{character.name}</h3>
              </div>
            </TinderCard>
          ))}
            <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : ""}
            </div>
        </div>
      </div>
    </div>}
    </>
  );
};
