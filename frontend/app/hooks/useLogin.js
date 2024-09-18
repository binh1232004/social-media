'use client';
import { useState } from "react";
export default function useLogin(){
   const [email, setEmail ]  = useState(null);
   const [password, setPassword] = useState(null);
   const [isClickInput, setIsClickInput] = useState(false);

   const handleEmailChange = (e) => {
    setIsClickInput(true);
    setEmail(e.target.value);
   }
   const handlePasswordChange = (e) => {
    setIsClickInput(true);
    setPassword(e.target.value);
   }
   /**
    * 
    * @returns {Boolean} if email or password null, empty string return false;
    */
   const validateCredentials = () =>{
        if (!email || !password)
            return false;
        return true;
   }
   return {
        email,
        password, 
        handleEmailChange,
        handlePasswordChange,
        validateCredentials,
        isClickInput,
   }
}