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

const userId = cookies.UserId; //get the userId which is currently logged in from cookies

//get user from the backend

const getUser = async () => {
  try {
    return await axios.get(`http://localhost:10000/user/${userId}`);
  }catch(error){
    console.log(error);
  }
}

const getGenderedUsers = async(user) => {
  try {
      return await axios.get(`http://localhost:10000/gendered-users/${user?.gender_interest}`);
  } catch (error) {
    console.log(error);
  }
}

  //call useEffect everytime the user change

 useEffect(async () => {
  const userResponse = await getUser();
  const genderUsersResponse = await getGenderedUsers(userResponse.data);
  setUser(userResponse.data);
  setGenderedUsers(genderUsersResponse.data);
 },[]);



 //logic for updateMaches
 const updateMatches = async(matchUserId) => {
    try {
      await axios.put('http://localhost:10000/addmatch', {userId,matchUserId});
      getUser().then((response) => setUser(response.data)); //update the user again on match
      console.log("User which was updated ", user);
    } catch (error) {
      console.log(error);
    }
 }

  const swiped = (direction, swipedUserId) => {
    if(direction === 'right'){
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const linkedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId);

  const filteredGenderUsers = genderedUsers?.filter(
    genderedUser => !linkedUserIds.includes(genderedUser.user_id)
  )

  return (
    <>
    {user &&
    <div className="dashboard">
      <ChatContainer user={user} />
      <div className="swipe-container">
        <div className="card-container">
          {filteredGenderUsers?.map((genderedUsers) => (
            <TinderCard
              className="swipe"
              key={genderedUsers.user_id}
              onSwipe={(dir) => swiped(dir, genderedUsers.user_id)}
              onCardLeftScreen={() => outOfFrame(genderedUsers.first_name)}
            >
              <div
                style={{ backgroundImage: "url(" + genderedUsers.url + ")" }}
                className="card"
              >
                <h3>{genderedUsers.name}</h3>
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
