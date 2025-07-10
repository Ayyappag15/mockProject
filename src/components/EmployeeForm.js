import React, { useEffect, useState } from 'react';

const EmployeeForm = ({ onSubmit, initialData, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setEmail(initialData.email);
      setSalary(initialData.salary);
      setDate(initialData.date || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setSalary('');
      setDate('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: initialData?.id, firstName, lastName, email, salary, date });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <input className="border p-2 rounded" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
      <input className="border p-2 rounded" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
      <input className="border p-2 rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input className="border p-2 rounded" placeholder="Salary" type="number" value={salary} onChange={e => setSalary(e.target.value)} required />
      <input className="border p-2 rounded" placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <button className="bg-green-600 text-white px-3 py-2 rounded" type="submit">{initialData ? 'Update' : 'Add'}</button>
      <button className="bg-gray-500 text-white px-3 py-2 rounded" type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EmployeeForm;
