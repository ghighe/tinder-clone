/* eslint-disable no-unused-vars */
import { Nav } from "../components/Nav";
import { useState } from "react";
import { AuthModal } from "../components/AuthModal";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const authToken = cookies.authToken;

  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(true);
    if(authToken){
      removeCookie('UserId', cookies.UserId);
      removeCookie('AuthToken', cookies.authToken);
      window.location.reload();
    }
  };

  return (
    <div className="overlay">
      <Nav
        logoChooser={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <h1 className="primary-title">Swipe Right®</h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Signout" : "Create Account"}
        </button>

        {showModal && (
          <AuthModal
            setShowModal={setShowModal}
            isSignUp={isSignup}
          />
        )}
      </div>
    </div>
  );
};
