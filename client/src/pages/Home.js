import { Nav } from "../components/Nav";
import { useState } from "react";
import { AuthModal } from "../components/AuthModal";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignUp] = useState(true);

  const authToken = false;
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(true);
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
