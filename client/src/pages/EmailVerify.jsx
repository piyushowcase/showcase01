import React from 'react'
import { useNavigate } from 'react-router-dom'
import {useRef} from 'react'
import logo from '../assets/mern-auth-assets/assets/logo.svg'
  import { AppContent } from '../context/AppContext'
  import { useContext } from 'react'
  import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const EmailVerify = () => {

  const{backendUrl,isLoggedin,userData,getUserData}= useContext(AppContent)
const navigate=useNavigate()
  const inputRefs = React.useRef([]);
  const handleInput=(e,index)=>{
    if(e.target.value.length> 0 && index<inputRefs.current.length-1){
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown=(e,index)=>{
    if(e.key==='Backspace' && index>0 && e.target.value.length===0){
      inputRefs.current[index-1].focus();
    }
  };
  const handlePaste=(e)=>{
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pasteValues = pasteData.split('').slice(0, 6);
    pasteValues.forEach((value, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = value;
      }})}
      const onSubmitHandler=async(e)=>{
           e.preventDefault();
        try{
         const otpArray = inputRefs.current.map(e => e.value).join('');
         if (otpArray.length !== 6) {
          toast.error('Please enter a 6-digit OTP.');
          return;
         }else{
         console.log('OTP entered:', otpArray); 
         const{data}=await axios.post(backendUrl+'/api/auth/verify-email',{otp:otpArray})
      
       if(data.success){
        toast.success(data.message)
        await getUserData()
        navigate('/', { replace: true })

       }
      else{
        toast.error(data.message);
      } 
    }}
    catch (error) {
        toast.error(error.response?.data?.message || error.message);
          console.error('Error during email verification:', error);
        }
      }
      useEffect(()=>{
        isLoggedin && userData?.isAccountVerified && navigate('/', { replace: true })
      },[isLoggedin,userData])
  return (
    <div className=' flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-purple-400 p-6 sm:px-0'>
        <img onClick={()=>navigate('/')}src={logo} alt='Logo' className='absolute left-5 top-5 w-28 cursor-pointer sm:top-20 sm:w-32' />
  <form onSubmit={onSubmitHandler} className="w-full max-w-md rounded-lg bg-slate-900 p-6 text-center text-sm shadow-lg sm:p-10"> 
    <h1 className='text-2xl font-semibold text-white mb-4'>Email Verify OTP</h1>
    <p className='mb-6 text-indigo-400 text-center'>Please enter the verification code sent to your email.</p>
    <div onPaste={handlePaste} className='mb-8 grid grid-cols-6 gap-2'>
      {Array(6).fill(0).map((_,index)=>(
        <input
          type='text'
          maxLength='1'
          key={index}
          required
         
          className='aspect-square w-full rounded-md bg-[#333A5C] text-center text-xl text-white'
        ref={(el) => (inputRefs.current[index] = el)}
        onInput={(e) => {handleInput(e, index)}}
        onKeyDown={(e) => {handleKeyDown(e, index)}}
       
        />
      ))}</div>
      <button
        type='submit'
        className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900  text-white font-semibold rounded-full transition duration-300'
      >
        Verify Email
      </button>

   </form>
    </div>
  )
}

export default EmailVerify
