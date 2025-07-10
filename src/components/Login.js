import React, { useState } from 'react';

const Login = ({ setIsAuthenticated }) => {
  const [userId, setUserId] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const handleLogin = () => {
    if (userId === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input className="border p-2 rounded" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
      <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
