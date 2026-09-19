import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContent = createContext()
export const AppContextProvider=(props)=>{
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL 
    
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(null)

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl+'/api/user/data')
            if (data.success) {
                setIsLoggedin(true)
                setUserData(data.userData)
            } else {
                setIsLoggedin(false)
                setUserData(null)
                
  
                toast.error( 'Authentication failed')
            }
        } catch (error) {
            setIsLoggedin(false)
            setUserData(null)
            if (error.response?.status !== 401) {
        toast.error(
          error.response?.data?.message ||
          "Failed to load user data");
        }
    }
    }
    useEffect(() => {
        getAuthState()
    }, [])

    const getUserData = async () => {
        try {
            

      const { data } = await axios.get(backendUrl+'/api/user/data');
      
            if (data.success) {
                setUserData(data.userData)
                
            } else {
                setUserData(null)
                
                toast.error(data.message || 'User data not found')
            }
        } catch (error) {
            setUserData(null)
            toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch user data')
        }
    }
    const value={
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
        
    }
return(
    <AppContent.Provider value={value}>
    {props.children}
    </AppContent.Provider>
)
    }
