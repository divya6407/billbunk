
import React, { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios.js';
function Create (){
  const [grpname,setgrpname]=useState("");
  const [name,setname]=useState("");
  const [selectedmem,setselectedmem]=useState([]);
  const [users,setusers]=useState([]);
  const [message, setmessage] = useState({ error: false, msg: "" });
  const [code,setcode]=useState("");
  const [id, setid] = useState("");

  const [loading,setloading]=useState(false);
  const navigate= useNavigate();

  useEffect(()=>{fetchusers()},[name]);
  const fetchusers=async()=>{
    setloading(true);
    try{
      const params = new URLSearchParams();
      if(name) params.set('name',name);
      const data = await API.get(`/auth/getusers?${params.toString()}`);
      console.log(data.data.data);
      setusers(data.data.data);
    }
    catch (err) {
      console.log('failed to load Users:', err);
    }
    finally {
      setloading(false);
    }
  }
  const handleselect = (user) => {
    if (selectedmem.some((i) => i._id === user._id)) {
      setselectedmem(selectedmem.filter((i) => i._id !== user._id));
    } else {
      setselectedmem([...selectedmem, user]);
    }
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setmessage({ error: false, msg: "" });
    setloading(true);
    try{
      const data = await API.post('/groups',{name:grpname,members:selectedmem});
      setmessage({ error: false, msg: "Created successfully" });
      setcode(data.data.data.code);
      setid(data.data.data._id);
      setgrpname("");
      setname("");
      setselectedmem([]);
      setusers([]);
      console.log(data.data.data._id);
    }
    catch (err) {
      setmessage({ error: true, msg: err.response?.data?.message || 'Failed to Join the Group' });
    }
    finally {
      setloading(false);
    }
  }

  return(
    <div >
      {
          message.msg && (
            <p className={`p-2 text-white ${message.error ? "bg-[#f96a6b]" : "bg-[#44bd93]"
              }`}>
              {message.msg}
            </p>
          )
      }
      <form onSubmit={handleSubmit} className='flex flex-col m-4 bg-white rounded -xl p-4 text-[#072a46] font-md'>
        <p className="text-[#072a46] font-bold mb-2">Group Name</p>
        <input className="mb-2 border p-2 rounded-md" value={grpname} placeholder='Group Name' onChange={(e)=>{setgrpname(e.target.value)}}></input>
        <p className="text-[#072a46] font-bold mb-2">Add Members</p>
        <input className="mb-2 border p-2 rounded-md" value={name} placeholder='Members Name' onChange={(e) => { setname(e.target.value) }}></input>
        {users.length > 0 ? <div className='border-2 p-2 rounded-md overflow-scroll'>
          {users.map((u) => (
            <div key={u._id} className='flex justify-between items-center space-x-2 rounded-md border-[1px] mb-[1px] p-1 '>
              <p className='ml-2 pb-1'>{u.name}</p>
              <input className="w-4 h-4 accent-[#2a949b] cursor-pointer"type='checkbox' value={u.name} onChange={() => handleselect(u)}></input>
              
            </div>

          ))}
        </div>
:""}
        {
          users.length>0 && <p className='bg-[#dfedef] mt-2 p-2 rounded-md text-[#2a949b] font-semibold'> 
          <p> Added Members: </p>  
          {selectedmem.map(u => u.name).join(", ")}
        </p>
        }
        
        <button type='submit' className='py-2 rounded-md bg-[#2a949b] text-white mt-4 font-bold'>Create</button>
        
      </form>
      {
        code&& (
          <div className='mt-3 flex items-center justify-between bg-green-100 text-green-700 p-2 rounded'>
            <p>Code : {code}</p>
            <button className="ml-2 px-2 py-1 bg-[#2a949b] text-white rounded" onClick={()=>{if(!code) return; navigator.clipboard.writeText(code);
              setmessage({error:false,msg:"Code copied!"});
            }}> Copy</button>
          </div>
        )
      }
      {code && id && id !== 'undefined' && (
        <div><Link to={`/groups/${id}`}>View group:</Link> </div>
      )
    }
    </div>
    )
}


function Join(){
  const [code,setcode]=useState("");
  const [loading,setloading]=useState(false);
  const [message,setmessage]=useState({error:false,msg:""});
  const [id ,setid]=useState("");
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setmessage({error:false,msg:""});
    setloading(true);
    try{
      const data = await API.post("/groups/join",{code:code});
      console.log(data);
      setid(data.data.data._id)
      setmessage({error:false,msg:"Joined successfully"});
      setcode("")

    }
    catch (err) {
      setmessage({error:true,msg:err.response?.data?.message||'Failed to Join the Group'});
    }
    finally {
      setloading(false);
    }
  }
  return (
    <div >
      {
        message.msg && (
          <p className={`p-2 text-white ${message.error ? "bg-[#f96a6b]" : "bg-[#44bd93]"
            }`}>
            {message.msg}
          </p>
        )
      }
      <form onSubmit={handleSubmit} className='bg-white rounded-md mt-2 flex flex-col'>
        <p className="text-[#072a46] font-bold m-2">Group Code:</p>
        <input className="m-2 border p-2 rounded-md" value={code} onChange={(e)=>setcode(e.target.value)} placeholder="Group Code"></input>
        <button type='submit' className='py-2 rounded-md bg-[#2a949b] text-white m-4 font-bold'>Join</button>
      </form>
      {code && id && id !== 'undefined' && (
        <div><Link to={`/groups/${id}`}>View group:</Link> </div>
      )
      }
    </div>
  )
}

const CreateGroup = () => {
  const [create,setcreate]=useState(true);
  return (
    <div className="flex flex-col min-h-screen bg-[#eef0f4]">
      {/* Ensure Header is sticky so it stays at the top */}
      <div className="sticky top-0 z-50 bg-white shadow">
        <Header />
      </div>

      <div className="flex flex-1 justify-center items-center p-4">
        <div className="sticky top-20 border p-4 shadow-2xl min-w-[400px]  bg-white rounded-lg max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <div className="grid grid-cols-2 font-bold shadow">
            <button
              className={create ? 'py-2 rounded-md bg-[#2a949b] text-white' : 'py-2 rounded-md bg-white text-[#6e7d8e]'}
              onClick={() => setcreate(true)}
            >
              Create Group
            </button>
            <button
              className={!create ? 'py-2 rounded-md bg-[#2a949b] text-white' : 'py-2 rounded-md bg-white text-[#6e7d8e]'}
              onClick={() => setcreate(false)}
            >
              Join Group
            </button>
          </div>
          <div className="mt-4 w-full h-0.5 bg-[#e0e4ea] mb-2"></div>
          <div>
            {create ? <Create /> : <Join />}
          </div>
        </div>
      </div>
    </div>
  );

}

export default CreateGroup