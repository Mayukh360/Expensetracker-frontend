import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { authActions } from '../../store/AuthReducer';


export default function LeaderBoard() {
    const token=localStorage.getItem('token')
   const [leaderboard,setLeaderBoard ]=useState([])
   const dispatch = useDispatch();


    const fetchdata=async()=>{
        try {
            const response = await axios.get('http://localhost:3000/showleaderboard');
            console.log(response.data.leaderboard);
            setLeaderBoard(response.data.leaderboard || []); // Set an empty array as fallback if leaderboard data is not available
          } catch (error) {
            console.error(error);
            setLeaderBoard([]); // Set an empty array on error
          }
    }
    useEffect(()=>{
        fetchdata()
        
        if (token) {
          dispatch(authActions.islogin(token));
        }
    },[])
      
  return (
    <div className="bg-gray-900 text-white px-4 py-4">
    <h1 className="text-2xl font-bold mb-4">Expense Leaderboard</h1>
    <ul className="space-y-2">
      {leaderboard && leaderboard.map((item, index) => (
        <li key={index} className="text-lg bg-gray-700 p-4 rounded">
          <span className="font-semibold">{item.name}</span> - {item.totalexpense}
        </li>
      ))}
    </ul>
  </div>
  )
}
