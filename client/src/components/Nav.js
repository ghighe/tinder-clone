import whiteLogo from '../images/white-logo.png';
import redLogo from '../images/red-logo.png';

export const Nav = ({logoChooser,
                      setShowModal,
                      showModal,
                      setIsSignUp}) => {

  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  }

  const authToken = false;

    return (
     <nav>
       <div className="logo-container">
        <img className="logo" src={logoChooser ? redLogo : whiteLogo} alt="noTinderPic"/>
      </div>
      {!authToken && !logoChooser && <button
      className='nav-button' onClick={handleClick} disabled={showModal}>Log in</button>}
     </nav>
    )
}