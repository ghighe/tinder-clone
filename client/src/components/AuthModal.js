/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { useCookies  } from 'react-cookie';


export const AuthModal = ({setShowModal,isSignUp}) => {
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);
    const [cookies,setCookie,removeCookie] = useCookies(['user']);

    let navigate = useNavigate();
    //handle the button click
    const handleClick = () => {
        setShowModal(false);
    }
    //handle the form on submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(isSignUp && (password !== confirmPassword)){
                setError("Passwords need to match!");
                return
            }

            const response = await axios.post(`http://localhost:10000/${isSignUp ? 'signup': 'login'}`, {email,password});
            const success = response.status === 200;

            // setCookie('Email', response.data.email);
            setCookie('UserId', response.data.userId);
            setCookie('AuthToken', response.data.token);

            if(success && isSignUp) navigate('/onboarding'); //when we signup
            if(success && !isSignUp) navigate('/dashboard'); //when we login

            window.location.reload();

        }catch(error){
            console.log(error);
            if(isSignUp){
                setError("User already exist, please login");
            }else {
                setError("Wrong credentials");
            }

        }
    }
    return (
        <div className="auth-modal">
            <div className="close-icon"onClick={handleClick}>X</div>
            <h2>{isSignUp? 'CREATE ACCOUNT': 'LOG IN'}</h2>
            <p className="termsPolicy">By clicking Log in, you agree to our <b><u>Terms.</u></b></p>Learn how we process your data in our <b><u>Privacy Policy</u></b>
            and <b><u>Cookie Policy</u></b>
            <form onSubmit={handleSubmit}>
                <input type="email"
                        name="email"
                         id="email"
                         placeholder="test@yahoo.com"
                         required={true}
                         onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                {isSignUp && (<input type="password"
                        name="password-check"
                        id="password-check"
                        placeholder="confirm-password"
                        required={true}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />)}

                <input type="submit" className="submit-button" value="Submit" />
                <p>{error}</p>
                <hr />
                <h2>GET THE APP</h2>
            </form>
        </div>
    )
}