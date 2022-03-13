/* eslint-disable no-unused-vars */
import { Home } from "./pages/Home";
import { useCookies } from "react-cookie"
import { Dashboard } from "./pages/Dashboard";
import { Onboarding } from "./pages/Onboarding";
import { BrowserRouter,Route, Routes } from "react-router-dom";

const App = () => {
  const [cookies,setCookie, removeCookie] = useCookies(['user']);

  const AuthToken = cookies.AuthToken; //get the Token from browser cookies


  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>}/>
          {/* only the users which are logged on and have a token are able to see below pages */}
          {AuthToken && <Route path="/dashboard" element={<Dashboard/>}/>}
         {AuthToken && <Route path="/onboarding" element={<Onboarding/>}/>}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
