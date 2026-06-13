/*VIEW IN MAIN PAGE*/
import React, { use, useEffect ,useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import Header from '../components/Header';


export const EditExpense = () => {
    const [loading,setloading]=useState(false);
    const [error,seterror]=useState("");
    const [title,settitle]=useState("");
    const [description,setdescription]=useState("");
    const [amount,setamount]=useState("");
    const [category,setcategory]=useState("Others");
    const [splitType,setsplitType]=useState("equal");
    const [grpmem,setgrpmem]=useState([{id:0,name:"",selected:true,amt:""}]);
    const [members,setMembers]=useState([{id:0,name:"",amt:0}]);
    const [groupId, setGroupId] = useState("");

    const {expid}=useParams();
    const navigate = useNavigate();
    const name = title;
    const expname=name;

    useEffect(()=>{
        fetchexp();
    },[expid]);
    const fetchexp = async()=>{
        setloading(true);
        seterror("");
        try{
            const res= await API.get(`/expenses/${expid}`);
            console.log(res.data.data.splitDetails);
            settitle(res.data.data.title);
            setdescription(res.data.data.description);
            setamount(res.data.data.amount);
            setcategory(res.data.data.category);
            setsplitType(res.data.data.splitType);
            const rawGroupId = res.data.data.groupId;
            const fetchedGroupId = rawGroupId && rawGroupId !== 'undefined' ? String(rawGroupId) : '';
            setGroupId(fetchedGroupId);
            const memberIds = res.data.data.splitDetails?.map(i => ({
                id: i?.userId?._id,
                name: i?.userId?.name,
                amt: i?.amount
            })).filter(m => m.id && m.name && m.amt != null) || [];
            setMembers(memberIds);

            if (fetchedGroupId) {
                const res1 = await API.get(`/groups/${fetchedGroupId}`);
                console.log(res1.data.data.members);
                const grpmem = res1.data.data.members?.map(i => {
                    const found = memberIds.find(j => j.id === i._id)
                    return {
                        id: i._id,
                        name: i.name,
                        selected: !!found,
                        amt: found?.amt ?? 0
                    }
                }) || [];
                setgrpmem(grpmem)
                console.log("GRPMEM",grpmem)
            } else {
                const grpmemFallback = memberIds.map(i => ({
                    id: i.id,
                    name: i.name,
                    selected: true,
                    amt: i.amt
                }));
                setgrpmem(grpmemFallback);
                console.log("GRPMEM fallback", grpmemFallback);
            }
        }
        catch(error){
            console.error(error);
            seterror('Failed to load expense details');
        }
        finally{
            setloading(false);
        }
    }
    
    const validateUnequalSplit = (members = grpmem, currentAmount = amount, activeSplitType = splitType) => {
        if (activeSplitType !== 'unequal') {
            seterror('');
            return true;
        }

        const selectedTotal = members
            .filter(member => member.selected)
            .reduce((sum, member) => sum + Number(member.amt || 0), 0);

        if (Number(currentAmount) !== selectedTotal) {
            seterror('Unequal split total must equal the expense amount.');
            return false;
        }

        seterror('');
        return true;
    };

    const handlesubmit = async(e)=>{
        e.preventDefault();
        if (!validateUnequalSplit()) return;

        setloading(true);
        seterror("");
        const splitDetails =grpmem.filter(i=>i.selected).map(j=>({userId:j.id,amount:j.amt}))
        const edited_expense={title,description,amount,category,splitType,splitDetails}
        try{
            const res2 =await API.put(`/expenses/${expid}`, edited_expense);
            console.log("updated");
            console.log(res2.data.data);
            navigate(groupId && groupId !== 'undefined' ? `/groups/${groupId}` : '/');
        }
        catch{
            console.log(error);
            seterror('Failed to update expense');
        }
        finally{
            setloading(false);
        }
    }


    const handleequalsplit = (e) => {
        const newSplitType = e.target.value;
        setsplitType(newSplitType);

        if (newSplitType === 'equal') {
            const selectedCount = grpmem.filter(i => i.selected).length;
            if (selectedCount === 0) {
                seterror('');
                return;
            }

            const equalamt = Number(amount) / selectedCount;

            setgrpmem(prev =>
                prev.map(member =>
                    member.selected
                        ? { ...member, amt: equalamt }
                        : member
                )
            );
            seterror('');
        } else {
            validateUnequalSplit(grpmem, amount, newSplitType);
        }
    };

    const handleMemberToggle = (memberId) => {
        const nextMembers = grpmem.map(member =>
            member.id === memberId ? { ...member, selected: !member.selected } : member
        );
        setgrpmem(nextMembers);
        if (splitType === 'unequal') {
            validateUnequalSplit(nextMembers, amount, splitType);
        }
    };

    const handleMemberAmountChange = (memberId, value) => {
        const amt = value === '' ? '' : Number(value);
        const nextMembers = grpmem.map(member =>
            member.id === memberId ? { ...member, amt } : member
        );

        setgrpmem(nextMembers);
        if (splitType === 'unequal') {
            validateUnequalSplit(nextMembers, amount, splitType);
        }
    };


  return (
    <div>
        <Header/>
          <div className='bg-[#eef0f4] m-4 p-4 rounded-md max-w-4xl mx-auto'>
              {error ? <p className=' bg-[#f96a6b] text-white p-3 rounded mb-4'>{error}</p>:""}
          <h1 className='text-lg font-bold '>Edit Expense -- {expname}</h1>
              <div className=''>

            <form onSubmit={handlesubmit} className='bg-white m-4 p-4 rounded-md' >
                      <div >
                    <label className='block font-semibold mb-2'>Title</label>
                    <input className=' w-full border p-2 rounded mb-4' name='title' value={title} onChange={((e)=>settitle(e.target.value))} required></input>
                </div>
                  <div>
                          <label className='block font-semibold mb-2'>Description</label>
                          <textarea className='w-full border p-2 rounded mb-4' type='textbox' name='description' value={description} onChange={(e) => setdescription(e.target.value)} required></textarea>
                  </div>
                  <div>
                          <label className='block font-semibold mb-2'>Amount</label>
                          <input className='w-full border p-2 rounded mb-4' type='number' name='amount' value={amount} onChange={(e) => {
                              const nextAmount = e.target.value;
                              setamount(nextAmount);
                              if (splitType === 'unequal') {
                                  validateUnequalSplit(grpmem, nextAmount, splitType);
                              }
                          }} required></input>
                  </div>
                  <div>
                          <label className='block font-semibold mb-2'>Category</label>
                          <select className='w-full border p-2 rounded mb-4' name='category' value={category} onChange={((e) => setcategory(e.target.value))} required>
                          <option value='Housing'>Housing</option>
                          <option value='Food'>Food</option>
                          <option value='Utilities'>Utilities</option>
                          <option value='Transport'>Transport</option>
                          <option value='Entertainment'>Entertainment</option>
                          <option value='Groceries'>Groceries</option>
                          <option value='Health'>Health</option>
                          <option value='Others'>Others</option>
                      </select>
                  </div>
                  <div>
                          <label className='block font-semibold mb-2'>Split Type</label>
                          <select className='w-full border p-2 rounded mb-4' name='splitType' value={splitType} onChange={((e) => handleequalsplit(e))} required>
                          <option value='equal'>Equal</option>
                          <option value='unequal'>Unequal</option>
                      </select>
                  </div>
                  {loading ? <p>loading</p> : (
                          <div className='bg-[#eef0f4] p-4 rounded '>
                              <h2 className='font-semibold mb-4'>Selected Members for Split</h2>
                      <div>
                           
                              {grpmem.map((i) => (
                                  <div className='flex flex-row justify-around mb-2' key={i.id}>
                                      <input
                                        className=''
                                          type='checkbox'
                                          checked={i.selected}
                                          onChange={() => handleMemberToggle(i.id)}
                                      />
                                      <p>{i.name}</p>
                                      {(splitType==='unequal')?
                                          <input
                                            className='px-4 py-2 border rounded'
                                            value={i.amt}
                                            type='number'
                                            onChange={(e) => handleMemberAmountChange(i.id, e.target.value)}
                                          />
                                          : <div className='bg-white w-[100px] px-4'><p>{i.amt}</p></div>}
                                  </div>
                              ))}
                      </div>
                      
                    </div>
                  )}
                      <div className='flex flex-col justify-center '>
                        <button className='bg-[#2a949b] text-white py-2 px-4 rounded hover:bg-[#217a80] mt-4 mb-4'
                              type='submit' disabled={!!error}>{loading?'Saving Changes':'Save Changes'}
                        </button>
                          <button className='text-[#2a949b] underline' type="button" onClick={()=>navigate(groupId && groupId !== 'undefined' ? `/groups/${groupId}` : '/')}>Cancel </button>
                  </div>
            </form>
        </div>
          </div>
    </div>
  )
}
