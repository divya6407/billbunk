import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaEye, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

import API from '../api/axios.js';
import Header from '../components/Header.jsx'
import Loading from '../components/Loading.jsx';
import { Link } from 'react-router-dom';

const ViewGroup = () => {
  const { grpid } = useParams();
  const groupId = grpid && grpid !== 'undefined' ? grpid : null;
  const [grp, setgrp] = useState(null);
  const [exp, setexp] = useState(null);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);
  const [edit, setedit] = useState(false);



  useEffect(() => {
    if (!groupId) {
      if (grpid) seterror('Invalid group ID.');
      return;
    }
    fetchGroup();
  }, [groupId, grpid]);

  const fetchGroup = async () => {
    try {
      setloading(true);
      const res = await API.get(`/groups/${groupId}`);
      const data = await API.get(`/expenses/group/${groupId}`);

      setgrp(res.data.data);
      setexp(data.data.data);

    } catch (err) {
      seterror("Failed to fetch group");
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const handledelete = async (id) => {
    try {
      const data = await API.delete(`/expenses/${id}`);
      alert("deleted successfully");
      fetchGroup();
    } catch (err) {
      console.log(err);
    }
  }

  

  return (
    <div className=' p-4 w-full text-[#072a46] '>
      <Header />
      {loading ? <Loading /> : ""}
      {
        error && (
          <p className={`p-2 text-white ${error ? "bg-[#f96a6b]" : "bg-[#44bd93]"}`}>
            {error}
          </p>
        )
      }
      {
        grp && <p className="text-[#072a46] font-bold text-2xl text-center m-2">{grp.name}</p>
      }
      <div className="mt-4 w-full h-0.5 bg-[#e0e4ea] m-2"></div>
      <div className='flex justify-between'>
        <div className='min-w-[200px] bg-[#e5eaef] p-4 rounded-md'>
          <p className='text-[#072a46] font-semibold border-b-[#b7bbbf] border-b-[1px] mb-[2px] p-2'>Members</p>
          {grp && grp.members && (
            grp.members.map((i, idx) => (
              <p key={i?._id || idx} className='border-b-[#b7bbbf] border-b-[1px] mb-[7px] p-2'>{i?.name || 'Unknown'}</p>
            ))
          )}
        </div>
        <div className='shadow-md w-full ml-[15px] p-4 bg-[#f6f7f9]'>
          <p className='text-[#072a46] font-semibold border-b-[#b7bbbf] border-b-[1px] mb-[2px] p-2'>Expenses</p>
          {exp && (
            exp.map((i) => (
              <div key={i._id} className='flex flex-col '>
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row gap-[15px]'>
                    {i.status === 'Settled' && <p className='p-2 text-center text-[#2a949b] '><FaCheckCircle /></p>}
                    <p>{i.title}</p>
                    <p>₹{i.amount}</p>
                  </div>
                  <div className='flex gap-[5px]'>
                    <Link to={`/expenses/${i._id}`}>
                      <button className="p-2 rounded text-[#2a949b] hover:bg-teal-200" >
                        <FaEdit />
                      </button>
                    </Link>
                    <button className="p-2 rounded text-[#2a949b] hover:bg-teal-200" onClick={() => handledelete(i._id)}>
                      <FaTrash />
                    </button>
                    <button className="p-2 rounded text-[#2a949b] hover:bg-teal-200" onClick={() => setExpandedExpenseId(expandedExpenseId === i._id ? null : i._id)}>
                      <FaEye />
                    </button>
                  </div>
                </div>
                {
                  expandedExpenseId === i._id &&
                  <div className="bg-white shadow-lg rounded-2xl p-5 border border-teal-100 hover:shadow-xl transition w-full max-w-md m-4">

                    <h2 className="text-xl font-semibold text-teal-700 mb-2">{i.title}</h2>
                    <p className="text-gray-600 text-sm mb-1"><span className="font-medium text-teal-600">Category:</span> {i.category}</p>
                    <p className="text-gray-600 text-sm mb-1"><span className="font-medium text-teal-600">Description:</span> {i.description}</p>
                    <p className="text-gray-600 text-sm mb-1"><span className="font-medium text-teal-600">Amount:</span> ₹{i.amount}</p>
                    <p className="text-gray-600 text-sm mb-3"><span className="font-medium text-teal-600">Split Type:</span> {i.splitType}</p>

                    {/* Split Details */}
                    <div className="bg-teal-50 rounded-lg p-3">
                      <h3 className="text-sm font-semibold text-teal-700 mb-2">Split Details</h3>

                      {i.splitDetails && i.splitDetails.map((j, index) => {
                        
                        return (
                          <div key={index} className="flex justify-between items-center text-sm text-gray-700 border-b last:border-none py-1 gap-2">
                            <span>{j?.userId?.name || 'Unknown'}</span>
                            <span className="text-teal-600 font-medium">₹{j?.amount ?? 0}</span>
                            <span className={`text-xs ${j?.isPaid ? "text-green-600" :  "text-gray-400"}`}>
                              {j?.isPaid ? "Settled" :  "Unpaid"}
                            </span>

                           
                          </div>
                        );
                      })}
                    </div>
                  </div>
                }
              </div>
            ))
          )}
          <div className="mt-4">
            <Link to={`/expenses/new/${grpid}`}>
              <button className='py-2 rounded-md bg-[#2a949b] text-white p-2'>
                +Add Expense
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGroup;
