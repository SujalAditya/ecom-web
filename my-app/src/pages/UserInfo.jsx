import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserInfo() {
  const { user, logout, fetchUserInfo } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobile: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [addrForm, setAddrForm] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: '', phone: '', isDefault: false
  });
  const [addrEditIdx, setAddrEditIdx] = useState(-1);
  const [addrMsg, setAddrMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUserInfo();
      setForm({
        firstName: user.firstName || user.fullName?.split(' ')[0] || '',
        lastName: user.lastName || user.fullName?.split(' ')[1] || '',
        gender: user.gender || '',
        mobile: user.mobile || ''
      });
    }
    // eslint-disable-next-line
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setEditMode(false);
        setSuccess('Profile updated successfully!');
        fetchUserInfo();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch {
      setError('Failed to update profile');
    }
    setSaving(false);
  };

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/addresses', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      console.log('Fetched addresses:', data); // DEBUG LOG
      setAddresses(data);
    } else {
      console.log('Failed to fetch addresses'); // DEBUG LOG
    }
  };

  useEffect(() => {
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  const handleAddrChange = e => {
    const { name, value, type, checked } = e.target;
    setAddrForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const resetAddrForm = () => {
    setAddrForm({ name: '', street: '', city: '', state: '', zip: '', country: '', phone: '', isDefault: false });
    setAddrEditIdx(-1);
  };
  const handleAddrSave = async () => {
    setAddrMsg('');
    const token = localStorage.getItem('token');
    const method = addrEditIdx === -1 ? 'POST' : 'PUT';
    const url = '/api/addresses' + (addrEditIdx === -1 ? '' : `/${addrEditIdx}`);
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(addrForm)
    });
    if (res.ok) {
      setAddrMsg('Address saved!');
      fetchAddresses();
      resetAddrForm();
    } else {
      let data;
      try {
        data = await res.json();
      } catch(e) { data = {}; }
      setAddrMsg(data.message || 'Failed to save address');
      console.error('Failed to save address:', data);
    }
  };
  const handleAddrEdit = idx => {
    setAddrEditIdx(idx);
    setAddrForm(addresses[idx]);
  };
  const handleAddrDelete = async idx => {
    setAddrMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/addresses/${idx}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      setAddrMsg('Address deleted!');
      fetchAddresses();
    } else {
      setAddrMsg('Failed to delete address');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 border-r border-gray-200 p-6 bg-gray-50 flex flex-col gap-4 text-gray-900">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : user.email[0].toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-lg text-gray-900">Hello,</div>
              <div className="font-bold text-base text-gray-900">{user.fullName || user.email}</div>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <button className={`text-left px-2 py-2 rounded ${activeTab==='profile' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-200 text-gray-900'}`} onClick={() => setActiveTab('profile')}>Profile Information</button>
            <button className={`text-left px-2 py-2 rounded ${activeTab==='addresses' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-200 text-gray-900'}`} onClick={() => setActiveTab('addresses')}>Manage Addresses</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">PAN Card Information</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">Gift Cards</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">Saved UPI</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">Saved Cards</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">My Coupons</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">My Reviews & Ratings</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">All Notifications</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-gray-900">My Wishlist</button>
            <button className="text-left px-2 py-2 rounded hover:bg-gray-200 text-red-600 mt-8" onClick={logout}>Logout</button>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 text-gray-900">
          {activeTab === 'profile' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                {!editMode ? (
                  <button className="text-indigo-600 hover:underline" onClick={() => setEditMode(true)}>Edit</button>
                ) : (
                  <button className="text-gray-600 hover:underline" onClick={() => setEditMode(false)}>Cancel</button>
                )}
              </div>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              {success && <div className="text-green-600 mb-2">{success}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editMode ? form.firstName : user.firstName || user.fullName?.split(' ')[0] || ''}
                    onChange={editMode ? handleChange : undefined}
                    disabled={!editMode}
                    className={`w-full px-4 py-2 border rounded bg-gray-100 text-gray-900 ${editMode ? 'bg-white border-indigo-400' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editMode ? form.lastName : user.lastName || user.fullName?.split(' ')[1] || ''}
                    onChange={editMode ? handleChange : undefined}
                    disabled={!editMode}
                    className={`w-full px-4 py-2 border rounded bg-gray-100 text-gray-900 ${editMode ? 'bg-white border-indigo-400' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Gender</label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 text-gray-900">
                      <input type="radio" name="gender" value="male" checked={editMode ? form.gender === 'male' : user.gender === 'male'} onChange={editMode ? handleChange : undefined} disabled={!editMode} /> Male
                    </label>
                    <label className="flex items-center gap-2 text-gray-900">
                      <input type="radio" name="gender" value="female" checked={editMode ? form.gender === 'female' : user.gender === 'female'} onChange={editMode ? handleChange : undefined} disabled={!editMode} /> Female
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    name="mobile"
                    value={editMode ? form.mobile : user.mobile || ''}
                    onChange={editMode ? handleChange : undefined}
                    disabled={!editMode}
                    className={`w-full px-4 py-2 border rounded bg-gray-100 text-gray-900 ${editMode ? 'bg-white border-indigo-400' : ''}`}
                  />
                </div>
              </div>
              {editMode && (
                <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-2">FAQs</h3>
                <div className="text-gray-600 text-sm space-y-2">
                  <div><b>What happens when I update my email address (or mobile number)?</b><br />Your login email id (or mobile number) changes. You'll receive all your account related communication on your updated email address (or mobile number).</div>
                  <div><b>When will my account be updated with the new email address (or mobile number)?</b><br />It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</div>
                  <div><b>What happens to my existing account when I update my email address (or mobile number)?</b><br />Updating your email address or mobile number doesn't invalidate your account. Your account remains fully functional. You'll continue receiving notifications on your updated email address or mobile number.</div>
                </div>
              </div>
            </>
          )}
          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Addresses</h2>
              {addrMsg && <div className="mb-2 text-green-700">{addrMsg}</div>}
              <div className="mb-6">
                <input className="mb-2 px-2 py-1 border rounded w-full" name="name" placeholder="Name" value={addrForm.name} onChange={handleAddrChange} />
                <input className="mb-2 px-2 py-1 border rounded w-full" name="street" placeholder="Street" value={addrForm.street} onChange={handleAddrChange} />
                <input className="mb-2 px-2 py-1 border rounded w-full" name="city" placeholder="City" value={addrForm.city} onChange={handleAddrChange} />
                <input className="mb-2 px-2 py-1 border rounded w-full" name="state" placeholder="State" value={addrForm.state} onChange={handleAddrChange} />
                <input className="mb-2 px-2 py-1 border rounded w-full" name="zip" placeholder="ZIP" value={addrForm.zip} onChange={handleAddrChange} />
                <input className="mb-2 px-2 py-1 border rounded w-full" name="country" placeholder="Country" value={addrForm.country} onChange={handleAddrChange} />
                <input className="mb-2 px-2 py-1 border rounded w-full" name="phone" placeholder="Phone" value={addrForm.phone} onChange={handleAddrChange} />
                <label className="flex items-center mb-2">
                  <input type="checkbox" name="isDefault" checked={addrForm.isDefault} onChange={handleAddrChange} />
                  <span className="ml-2">Set as default</span>
                </label>
                <button className="px-4 py-1 bg-indigo-600 text-white rounded mr-2" onClick={handleAddrSave}>{addrEditIdx === -1 ? 'Add Address' : 'Update Address'}</button>
                {addrEditIdx !== -1 && <button className="px-4 py-1 bg-gray-400 text-white rounded" onClick={resetAddrForm}>Cancel</button>}
              </div>
              <div>
                {addresses.length === 0 && <div className="text-gray-500">No addresses added.</div>}
                {addresses.map((addr, idx) => (
                  <div key={idx} className="border rounded p-4 mb-3 flex justify-between items-center bg-gray-50">
                    <div>
                      <div className="font-bold">{addr.name} {addr.isDefault && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded ml-2">Default</span>}</div>
                      <div>{addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                      <div>Phone: {addr.phone}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => handleAddrEdit(idx)}>Edit</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleAddrDelete(idx)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
