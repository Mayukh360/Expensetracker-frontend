import AuthForm from "./component/Signup/AuthForm";
import { Routes,Route } from "react-router-dom";
import ExpenseTracker from "./component/expensetracker/ExpenseTracker";
import Navbar from "./component/navbar/Navbar";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn=useSelector(state=>state.auth.isAuthenticated)
  return (
    <div>
      <Navbar/>
  <Routes>
      {/* <Route path="/login" element={<AuthForm />} /> */}
      <Route path="/" element={<AuthForm />} />
      
      {/* <Route path="/expensetracker" element={<ExpenseTracker/>} /> */}
      {isLoggedIn ? ( <Route path="/expensetracker" element={<ExpenseTracker/>} />) :(<Route path="/expensetracker" element={<AuthForm/>} />)}
      </Routes>
    </div>
  );
}

export default App;
