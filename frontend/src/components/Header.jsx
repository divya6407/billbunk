import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
    const [error,seterror]=useState("");
    const [loading,setloading]=useState(false);
    const {logout}=useAuth();
    const navigate = useNavigate();
    const handlelogout=()=>{
        seterror("");
        setloading(true);
        try{
            logout();
            navigate('/login');
        }
        catch (err) {
            seterror(err.response?.data?.message || 'Registration failed');
        }
        finally {
            setloading(false);
        }

    }
  return (
    <div>
          <div className='flex justify-between m-4 sticky top-0 z-50  w-full'>
              <div className='flex'>
                  <img src='/logo.png' className='w-20'></img>
                  <div>
                      <h1 className='text-[#2a949b] text-xl font-extrabold '>Bill Bunk</h1>
                      <div>Split money Without chaos...</div>
                  </div>
              </div>
              <div className='flex justify-end gap-4 mr-[20px]'>
                  <Link to="/notifications"><img className="w-9" src="/notification.jpg"></img></Link>
                  <button onClick={handlelogout} className='bg-[#f96a6b] rounded w-20 text-white'>Logout</button>
              </div>
          </div>
    </div>
  )
}

export default Header