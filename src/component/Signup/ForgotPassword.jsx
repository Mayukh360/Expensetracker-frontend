import React, { useRef } from 'react'
import axios from 'axios'

export default function ForgotPassword() {
    const emailInputRef=useRef()
    const submitHandler=(event)=>{
        event.preventDefault()
        const email=emailInputRef.current.value
        axios
        .post("http://localhost:3000/forgotpassword",{ email })
      }
    
  return (
    <form onSubmit={submitHandler}>
        <label>Enter Email</label>
        <input type='text' ref={emailInputRef}/>
        <button type='submit'>Submit</button>
    </form>
  )
}
