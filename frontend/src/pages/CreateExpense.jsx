import React, { useState, useEffect } from 'react'
import Header from '../components/Header.jsx'
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import API from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export const CreateExpense = () => {
  const { user } = useAuth();//get user from backend
  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'Others',
    splitType: 'equal',
  });
  const [group, setGroup] = useState(null);//get grpid 
  const [members, setMembers] = useState([]);//all mem from grp
  const [selectedMembers, setSelectedMembers] = useState([]);//selected mem
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const { grpid } = useParams();
  const rawGroupID = state?.grpid || grpid || '';
  const groupID = rawGroupID === 'undefined' ? '' : rawGroupID;
  const navigate = useNavigate();

  useEffect(() => {
    if (groupID && user) {
      fetchGroup();
    }
  }, [groupID, user]);

  const fetchGroup = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/groups/${groupID}`);
      setGroup(response.data.data);
      console.log(response);
      const otherMembers = response.data.data.members.filter(
        (member) => member._id !== user?.id && member._id !== user?._id
      );
      setMembers(otherMembers);
    } catch (err) {
      setError('Unable to load group members.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (member) => {
    const exists = selectedMembers.some((item) => item._id === member._id);
    if (exists) {
      setSelectedMembers((prev) => prev.filter((item) => item._id !== member._id));
      return;
    }

    const newMember = {
      _id: member._id,
      name: member.name,
      amount: 0,
    };
    setSelectedMembers((prev) => [...prev, newMember]);
  };

  const handleAmountChange = (memberId, value) => {
    setSelectedMembers((prev) =>
      prev.map((member) =>
        member._id === memberId
          ? { ...member, amount: Number(value) }
          : member
      )
    );
  };

  const buildSplitDetails = () => {
    if (selectedMembers.length === 0) return [];

    const totalAmount = Number(form.amount) || 0;
    if (form.splitType === 'equal') {
      const splitAmount = Number((totalAmount / selectedMembers.length).toFixed(2));
      return selectedMembers.map((member) => ({
        userId: member._id,
        amount: splitAmount,
        isPaid: false,
      }));
    }

    return selectedMembers.map((member) => ({
      userId: member._id,
      amount: Number(member.amount) || 0,
      isPaid: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!groupID) {
      setError('Group ID is missing. Please open this page from a group view.');
      return;
    }

    if (!user) {
      setError('You must be logged in to create an expense.');
      return;
    }

    if (!form.title || !form.amount || selectedMembers.length === 0) {
      setError('Title, amount, and at least one member are required.');
      return;
    }

    const splitDetails = buildSplitDetails();

    const payload = {
      title: form.title,
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
      groupId: groupID,
      paidBy: user.id || user._id,
      splitType: form.splitType,
      splitDetails,
      status: 'Pending',
    };

    setLoading(true);
    try {
      await API.post('/expenses', payload);
      navigate(`/groups/${groupID}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const equalShare =
    form.splitType === 'equal' && selectedMembers.length > 0
      ? Number(form.amount || 0) / selectedMembers.length
      : 0;

  return (
    <div className='min-h-screen '>
      <Header />
      <div className='max-w-4xl mx-auto p-4 bg-[#eef0f4]'>
        <h1 className='text-2xl font-bold mb-4'>Create Group Expense</h1>

        {error && (
          <div className='bg-[#f96a6b] text-white p-3 rounded mb-4'>{error}</div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-lg shadow'>
          <div>
            <label className='block font-semibold mb-1'>Title</label>
            <input
              name='title'
              value={form.title}
              onChange={handleInputChange}
              className='w-full border p-2 rounded'
              required
            />
          </div>

          <div>
            <label className='block font-semibold mb-1'>Description</label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleInputChange}
              className='w-full border p-2 rounded'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block font-semibold mb-1'>Amount</label>
              <input
                name='amount'
                type='number'
                value={form.amount}
                onChange={handleInputChange}
                className='w-full border p-2 rounded'
                min='0'
                step='0.01'
                required
              />
            </div>

            <div>
              <label className='block font-semibold mb-1'>Category</label>
              <select
                name='category'
                value={form.category}
                onChange={handleInputChange}
                className='w-full border p-2 rounded'
              >
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
              <label className='block font-semibold mb-1'>Split Type</label>
              <select
                name='splitType'
                value={form.splitType}
                onChange={handleInputChange}
                className='w-full border p-2 rounded'
              >
                <option value='equal'>Equal</option>
                <option value='unequal'>Unequal</option>
              </select>
            </div>
          </div>

          <div className='bg-[#f5f7fb] p-4 rounded'>
            <h2 className='font-semibold mb-3'>Select Members to Split With</h2>
            {loading ? (
              <p>Loading members...</p>
            ) : members.length === 0 ? (
              <p>No other group members found in this group.</p>
            ) : (
              members.map((member) => {
                const selected = selectedMembers.some((item) => item._id === member._id);
                return (
                  <div key={member._id} className='flex items-center justify-between mb-2'>
                    <label className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={selected}
                        onChange={() => handleMemberToggle(member)}
                      />
                      <span>{member.name}</span>
                    </label>
                    {selected && form.splitType === 'unequal' && (
                      <input
                        type='number'
                        value={selectedMembers.find((item) => item._id === member._id)?.amount || ''}
                        onChange={(e) => handleAmountChange(member._id, e.target.value)}
                        className='w-28 border p-1 rounded'
                        min='0'
                        step='0.01'
                      />
                    )}
                    {selected && form.splitType === 'equal' && (
                      <div className='text-sm text-[#2a949b]'>
                        ₹{equalShare.toFixed(2)} each
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className='flex justify-between items-center'>
            <button
              type='submit'
              className='bg-[#2a949b] text-white py-2 px-4 rounded hover:bg-[#217a80]'
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
            <button
              type='button'
              className='text-[#2a949b] underline'
              onClick={() => navigate(groupID ? `/groups/${groupID}` : '/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
