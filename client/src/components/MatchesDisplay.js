/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";


export const MatchesDisplay = ({matches, setClickedUser}) => {
    const [isLoading, setLoading] = useState(true);
    const [matchedProfiles, setMatchedProfiles] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId;


    const matchUserIds = matches.map(({user_id}) => user_id).filter(userId => userId !== null)

    const getMatches = async () => {
        try {
           const response =  await axios.get("http://localhost:10000/users", {
                params: {
                    userIds: JSON.stringify(matchUserIds)
                }
            })
            setMatchedProfiles(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
       getMatches();
    },[])

    if(isLoading) {
        return <div className="matches-display">Getting data...</div>;
     }

    return (
        <div className = "matches-display">
           {matchedProfiles?.map((match,_index) => (
               <div key={match.user_id} className="match-card" onClick={() => setClickedUser(match)}>
                 <div className="img-container">
                     <img src={match.url} alt={match.first_name + " profile"} />
                     </div>
                     <h3>{match.first_name}</h3>
               </div>
           ))}
        </div>
    )
}