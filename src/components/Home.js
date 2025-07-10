import React from 'react';
import EmployeeTable from './EmployeeTable';

const Home = ({ setIsAuthenticated }) => (
  <div>
    <header className="bg-gray-100 p-4 flex justify-between items-center">
      <h3 className="text-lg font-semibold">Employee Management</h3>
      <button onClick={() => setIsAuthenticated(false)} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
    </header>
    <EmployeeTable />
  </div>
);

export default Home;
