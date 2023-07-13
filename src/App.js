import AuthForm from "./component/Signup/AuthForm";
import { Routes,Route } from "react-router-dom";
import ExpenseTracker from "./component/expensetracker/ExpenseTracker";
import Navbar from "./component/navbar/Navbar";

function App() {
  return (
    <div>
      <Navbar/>
  <Routes>
      {/* <Route path="/login" element={<AuthForm />} /> */}
      <Route path="/" element={<AuthForm />} />
      
      <Route path="/expensetracker" element={<ExpenseTracker/>} />
      </Routes>
    </div>
  );
}

export default App;
