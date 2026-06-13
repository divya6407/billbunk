import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form,setform]=useState({name:'',email:'',password:''});
    const [error,seterror]=useState("");
    const [loading,setloading]=useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();
    const handleChange=(e)=>{
        setform({...form,[e.target.name]:e.target.value});
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        seterror("");
        setloading(true);
        try{
            await register(form);
            navigate('/dashboard');
        }
        catch(err){
            seterror(err.response?.data?.message || 'Registration failed');
        }
        finally{
            setloading(false);
        }

    }
  return (
      <div className='bg-[#e6eaf0]'>
          {error && <p className="bg-[#f96a6b] text-white m-4 p-2">{error}</p>}

          <div className='flex flex-col justify-center items-center h-screen font-serif text-[#384b62]'>
              <div className='shadow-xl p-5 rounded-md bg-white'>
                  <div className='flex '>
                      <img src='./logo.png' className='w-20'></img>
                      <div>
                          <h1 className='text-[#2a949b] text-xl font-extrabold '>Bill Bunk</h1>
                          <div>Split money Without chaos...</div>
                      </div>
                  </div>

                  <form onSubmit={handleSubmit} className='flex justify-center flex-col '>
                      <input className="m-4 p-2 rounded-md border-2 border-[#c9cbd0] bg-[#f5f6f9] text-[#7f8797]" placeholder="Enter your Name" type='name' name='name' value={form.name} onChange={handleChange} required></input>
                      <input className="m-4 p-2 rounded-md border-2 border-[#c9cbd0] bg-[#f5f6f9] text-[#7f8797]" placeholder="Enter your Email" type='email' name='email' value={form.email} onChange={handleChange} required></input>
                      <input className="m-4 p-2 rounded-md border-2 border-[#c9cbd0] bg-[#f5f6f9] text-[#7f8797]" placeholder="Enter your Password" type='password' name='password' value={form.password} onChange={handleChange} required></input>

                      <button className="bg-[#2a949b] rounded-md p-2 text-white mb-4 shadow" type='submit' disabled={loading}>{loading ? 'Registering in...' : 'Register'}</button>
                  </form>
                  <div className='text-center'>Already have an account <Link to="/login">Login Here</Link></div>
              </div>
          </div>
      </div>
  )
}

export default Register