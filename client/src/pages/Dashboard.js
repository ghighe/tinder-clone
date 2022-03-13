/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import { ChatContainer } from "../components/ChatContainer";
import axios from "axios";

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

const userId = cookies.UserId;
//get user from the backend
const getUser = async() => {
  try {
    const response = await axios.get(`http://localhost:10000/user/${userId}`);
    setUser(response.data);
  } catch (error) {
    console.log(error)
  }
}

const getGenderedUsers = async() => {
    try {
      const response = await axios.get(`http://localhost:10000/gendered-user/${user?.gender_interest}`);
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
}

  //call useEffect everytime the user change
  useEffect(() => {
      getUser();
      getGenderedUsers();
  },[user,genderedUsers])





  const characters = [
    {
      name: "Richard Hendricks",
      url: "https://i.imgur.com/Q9WPlWA.jpeg"
    },
    {
      name: "Erlich Bachman",
      url: "https://i.imgur.com/Q9WPlWA.jpeg"
    },
    {
      name: "Monica Hall",
      url: "https://i.imgur.com/Q9WPlWA.jpeg"
    },
    {
      name: "Jared Dunn",
      url: "https://i.imgur.com/Q9WPlWA.jpeg"
    },
    {
      name: "Dinesh Chugtai",
      url: "https://i.imgur.com/Q9WPlWA.jpeg"
    }
  ];
  const [lastDirection, setLastDirection] = useState();

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
          {characters.map((character) => (
            <TinderCard
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name)}
              onCardLeftScreen={() => outOfFrame(character.name)}
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
