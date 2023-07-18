import AuthForm from "./component/Signup/AuthForm";
import { Routes,Route } from "react-router-dom";
import ExpenseTracker from "./component/expensetracker/ExpenseTracker";
import Navbar from "./component/navbar/Navbar";
import { useSelector } from "react-redux";
import LeaderBoard from "./component/expensetracker/LeaderBoard";
import ForgotPassword from "./component/Signup/ForgotPassword";
import Alldownload from "./component/expensetracker/Alldownload";

function App() {
  const isLoggedIn=useSelector(state=>state.auth.isAuthenticated)
  return (
    <div>
      <Navbar/>
  <Routes>
      {/* <Route path="/login" element={<AuthForm />} /> */}
      <Route path="/" element={<AuthForm />} />
      <Route path="/leaderboard" element={<LeaderBoard/>} />
      {/* <Route path="/expensetracker" element={<ExpenseTracker/>} /> */}
      {isLoggedIn ? ( <Route path="/expensetracker" element={<ExpenseTracker/>} />) :(<Route path="/expensetracker" element={<AuthForm/>} />)}
      <Route path="/forgotpassword" element={<ForgotPassword/>} />
      <Route path="/alldownload" element={<Alldownload/>} />
      </Routes>
    </div>
  );
}

export default App;
