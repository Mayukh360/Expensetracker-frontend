import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { authActions } from '../../store/AuthReducer';

export default function Alldownload() {
    const dispatch = useDispatch();
    const token=localStorage.getItem('token')
    const [url, setUrl]=useState([]);
    const fetchData= async()=>{
     const response= await  axios.get('http://localhost:3000/alldownload',{
        headers: {
          Authorization: localStorage.getItem("token"), // Include the JWT token from local storage
        },
      })
        console.log(response.data.fileUrls);
        setUrl(response.data.fileUrls)
    }
 useEffect(()=>{
        fetchData();
        if (token) {
            dispatch(authActions.islogin(token));
          }
    },[])
  return (
    <div className="max-w-xl  mx-auto my-8 px-4">
    <h1 className="text-2xl font-bold mb-4">All Downloads</h1>
    <ul>
      {url &&
        url.map((item) => (
          <li
            key={item.id}
            className="bg-gray-700 p-4 rounded shadow my-2 flex items-center justify-between"
          >
            <span className='text-white'>Expenses No: {item.id}</span>
            <a
              href={item.fileUrl}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Download
            </a>
          </li>
        ))}
    </ul>
  </div>
  )
}
