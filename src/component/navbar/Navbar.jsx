import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../../store/AuthReducer";
import axios from "axios";

export default function Navbar() {
  const dispatch = useDispatch();
  const isPremium = useSelector((state) => state.auth.isPremium);
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const token=localStorage.getItem('token')
//   dispatch(authActions.isToggle());

  const navigate = useNavigate();
  // const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    dispatch(authActions.islogout());

    // authCtx.logout();
    navigate("/");
  };

  const toggleHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/razorpay/transaction",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      const { keyId, orderId } = response.data;
  
      const options = {
        key: keyId,
        amount: 1000, // Example amount
        currency: "INR", // Example currency
        name: "Sharpener",
        description: "Purchase Premium",
        order_id: orderId,
        handler: async function (response) {
          // Handler function for success or failure
  
          if (response.razorpay_payment_id) {
            // Payment successful
  
            // Make a request to update the transaction
            const updateResponse = await axios.put(
              `http://localhost:3000/razorpay/transaction/${orderId}`,
              {
                paymentId: response.razorpay_payment_id,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            );
  
            // Handle the response and perform necessary actions
  
            // Redirect or display a success message to the user
          } else {
            // Payment failed
            // Handle the failure case
          }
        },
        prefill: {
          name: "Test",
          email: "test@example.com",
          contact: "+919876543210",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#F37254",
        },
      };
  
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
  
    } catch (error) {
      // Handle error
    }
  };
  

  
  return (
    <Fragment>
      <nav className="flex items-center justify-between  bg-gradient-to-b from-blue-300 to-purple-900 p-4 border border-gray-300">
        <Link to="/expensetracker" className="text-white text-xl font-semibold">
          Expense Tracker
        </Link>
        <div>
          {!isLoggedIn && (
            <Link
              to="/"
              className="text-white font-medium mr-4 hover:underline"
            >
              <button className="text-white font-medium hover:underline px-4 py-2 rounded-md bg-gray-800">
                Login
              </button>
            </Link>
          )}
          {isPremium && (
            <button
              onClick={toggleHandler}
              className="text-white font-medium bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-r hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 px-4 py-2 rounded-md mr-4"
            >
              <span className="inline-block text-gray-900">Avail Premium</span>
            </button>
          )}

          {isLoggedIn && (
            <button
              onClick={logoutHandler}
              className="text-white font-medium hover:underline px-4 py-2 rounded-md bg-red-800"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
     
    </Fragment>
  );
}
