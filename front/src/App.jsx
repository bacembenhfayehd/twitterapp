import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import { Navigate, Route, Routes } from "react-router-dom"

import NotificationPage from "./notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"


import Sidebar from "./components/svgs/common/SideBar"
import RightPanel from "./components/svgs/common/RightPanel"
import {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/svgs/common/LoadingSpinner"



function App() {

  const {data:authUser ,  isLoading } = useQuery({

    queryKey:['authUser'],
    queryFn: async () => {
      try {

        const res = await fetch ('/api/auth/me')
        const data =  await res.json();
        if(data.error) return null;
        if(!res.ok){
          throw new Error(data.error || 'Something wrong');
        }
        console.log('user data is here ' , data)
        return data;
      } catch (error) {
        throw new Error(error)
        
      }
    },

    retry:false,
  });


  if(isLoading){
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg"/>

      </div>
    )
  }
  
  


  return (

    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar/> }
			
      <Routes>
      <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
       
      </Routes>
      {authUser && <RightPanel/> }
      <Toaster/>
      
		</div>
    
  )
}

export default App
