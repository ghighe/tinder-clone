/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";


export const MatchesDisplay = ({matches}) => {
    const [matchedProfiles, setMatchedProfiles] = useState([]);


    const matchUserIds = matches.map(({user_id}) => user_id).filter(userId => userId !== null)

    const getMatches = async () => {
        try {
           const response =  await axios.get("http://localhost:10000/users", {
                params: {
                    userIds: JSON.stringify(matchUserIds)
                }
            })
            setMatchedProfiles(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMatches();
    },[])


    console.log(matchedProfiles);

    return (
        <div className = "matches-display" >

        </div>
    )
}