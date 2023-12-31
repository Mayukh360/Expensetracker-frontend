import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import classes from "./AuthForm.module.css";

import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/AuthReducer";

export default function AuthForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const nameInputRef=useRef()
  const emailInputRef = useRef();
 
  const confirmPasswordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler = (event) => {
    event.preventDefault();

   
    // const changedemail = enteredEmail.replace("@", "").replace(".", "");

   
    const name=nameInputRef.current.value;
    const email = emailInputRef.current.value;
    const password = confirmPasswordInputRef.current.value;
    localStorage.setItem("email", email);
    // console.log(enteredName,enteredEmail, enteredPassword, confirmPassword);

    setIsLoading(true);
    if (!isLogin) {
      axios
        .post("http://localhost:3000/signup", { name, email, password })
        .then((response) => {
          console.log(response.data);
          const { token } = response.data;
          const {userId}=response.data
          // console.log(token);
          // console.log(userId)
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);

          dispatch(authActions.islogin(token))
          navigate("/expensetracker");
       
          
        })
        .catch((error) => {
          console.error(error);
       
        });
    } else {
      axios
        .post("http://localhost:3000/login", { email, password })
        .then((response) => {
          console.log(response.data)
          const { token } = response.data;

          const {userId} = response.data; // Replace `response.data.userId` with the actual response data containing the user ID
          const {isPremium}=response.data; 

          dispatch(authActions.ispremium(isPremium));
          console.log("isPremium",isPremium)

          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
          localStorage.setItem('isPremium',isPremium);

          dispatch(authActions.islogin(token))
          
          navigate("/expensetracker");
          // Store the token in local storage or cookies
          // Perform any necessary actions after successful login
        })
        .catch((error) => {
          alert(error.response.data.error)
          console.error(error.response.data.error);
          // Handle login error
        });
    }

     
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(authActions.islogin(token));
    }
  }, []);

  const forgotHandler=(event)=>{
    event.preventDefault();
    navigate('/forgotpassword')
 
  }
  return (
    <div>
      {!isLoggedIn && (
        <section className={classes.auth}>
          <h1>{isLogin ? "Login" : "Sign Up"}</h1>
          <form onSubmit={submitHandler}>
          <div className={classes.control}>
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" ref={nameInputRef} required />
            </div>
            <div className={classes.control}>
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" ref={emailInputRef} required />
            </div>
            
            <div className={classes.control}>
              <label htmlFor="confirmpassword">Password</label>
              <input
                type="password"
                id="confirmpassword"
                ref={confirmPasswordInputRef}
                required
              />
            </div>

            <div className={classes.actions}>
              {!isLoading && (
                <button>{isLogin ? "Login" : "Create Account"}</button>
              )}
              {isLoading && <p>Sending Request... </p>}
              <button
                type="button"
                className={classes.toggle}
                onClick={switchAuthModeHandler}
              >
                {isLogin ? "Create new account" : "Login with existing account"}
              </button>
            </div>
            <div className={classes.actions}>
              <button onClick={forgotHandler} className={classes.forgot}>Forgot Password</button>
            </div>
          </form>
        </section>
      )}
      {isLoggedIn && (
        <h2 className={classes.loggedInmessage}>
          You Are already logged in, Visit Product section to see our Products
        </h2>
      )}
    </div>
  );
}
