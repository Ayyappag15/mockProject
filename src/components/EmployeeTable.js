import React, { useEffect, useState } from 'react';
import { fetchEmployees, deleteEmployee, updateEmployee, addEmployee } from '../api/employeeApi';
import EmployeeForm from './EmployeeForm';
import Swal from 'sweetalert2';
 
const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const itemsPerPage = 12;
 
  // Currency formatter
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
 
  const loadEmployees = async () => {
    const res = await fetchEmployees();
    setEmployees(res.data);
  };
 
  useEffect(() => {
    loadEmployees();
  }, []);
 
  // Handle individual employee selection
  const handleSelectEmployee = (employeeId) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };
 
  // Handle select all functionality
  const handleSelectAll = () => {
    const currentPageEmployeeIds = paginatedData.map(emp => emp.id);
    const allCurrentSelected = currentPageEmployeeIds.every(id => selectedEmployees.has(id));
   
    const newSelected = new Set(selectedEmployees);
   
    if (allCurrentSelected) {
      // Deselect all current page employees
      currentPageEmployeeIds.forEach(id => newSelected.delete(id));
    } else {
      // Select all current page employees
      currentPageEmployeeIds.forEach(id => newSelected.add(id));
    }
   
    setSelectedEmployees(newSelected);
  };
 
  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEmployees.size === 0) {
      Swal.fire('No Selection', 'Please select employees to delete.', 'info');
      return;
    }
 
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will delete ${selectedEmployees.size} employee(s)!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!'
    });
 
    if (result.isConfirmed) {
      try {
        // Delete all selected employees
        const deletePromises = Array.from(selectedEmployees).map(id => deleteEmployee(id));
        await Promise.all(deletePromises);
       
        // Clear selection and reload data
        setSelectedEmployees(new Set());
        await loadEmployees();
       
        Swal.fire('Deleted!', `${selectedEmployees.size} employee(s) have been deleted.`, 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete some employees.', 'error');
      }
    }
  };
 
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the employee!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
 
    if (result.isConfirmed) {
      await deleteEmployee(id);
      // Remove from selection if it was selected
      const newSelected = new Set(selectedEmployees);
      newSelected.delete(id);
      setSelectedEmployees(newSelected);
      await loadEmployees();
      Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
    }
  };
 
  const handleFormSubmit = async (emp) => {
    if (emp.id) {
      await updateEmployee(emp.id, emp);
      Swal.fire('Updated!', 'Employee has been updated.', 'success');
    } else {
      await addEmployee(emp);
      Swal.fire('Added!', 'New employee added.', 'success');
    }
    setEditingEmployee(null);
    setShowForm(false);
    loadEmployees();
  };
 
  const handleSort = (field) => {
    const isAsc = field === sortField ? !sortAsc : true;
    setSortField(field);
    setSortAsc(isAsc);
 
    const sorted = [...employees].sort((a, b) => {
      const aVal = a[field] || '';
      const bVal = b[field] || '';
      if (typeof aVal === 'number') return isAsc ? aVal - bVal : bVal - aVal;
      return isAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
 
    setEmployees(sorted);
  };
 
  // Helper function to render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <span className="inline-block ml-1 text-gray-400">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 3l3 3H3l3-3zM6 9L3 6h6l-3 3z" />
          </svg>
        </span>
      );
    }
   
    return (
      <span className="inline-block ml-1 text-gray-600">
        {sortAsc ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 3l3 3H3l3-3z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 9L3 6h6l-3 3z" />
          </svg>
        )}
      </span>
    );
  };
 
  const paginatedData = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  const totalPages = Math.ceil(employees.length / itemsPerPage);
 
  // Check if all current page employees are selected
  const isAllCurrentPageSelected = paginatedData.length > 0 &&
    paginatedData.every(emp => selectedEmployees.has(emp.id));
 
  // Check if some current page employees are selected
  const isSomeCurrentPageSelected = paginatedData.some(emp => selectedEmployees.has(emp.id));
 
  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Salary', 'Date'];
    const rows = employees.map(emp => [
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.salary,
      emp.date || '-',
    ]);
 
    let csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');
 
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
 
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => { setEditingEmployee(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selectedEmployees.size === 0}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Selected ({selectedEmployees.size})
        </button>
      </div>
 
      {showForm && (
        <div className="bg-gray-100 p-4 mb-4 rounded shadow">
          <EmployeeForm
            onSubmit={handleFormSubmit}
            initialData={editingEmployee}
            onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
          />
        </div>
      )}
 
      <table className="w-full border text-sm bg-white shadow-md rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">
              <input
                type="checkbox"
                checked={isAllCurrentPageSelected}
                ref={input => {
                  if (input) input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                }}
                onChange={handleSelectAll}
                className="cursor-pointer"
              />
            </th>
            <th className="border px-2 py-1">S.No</th>
            <th className="border px-2 py-1 cursor-pointer text-left hover:bg-gray-300 transition-colors duration-150"
                onClick={() => handleSort('firstName')}>
              <div className="flex items-center justify-between">
                First Name
                {renderSortIcon('firstName')}
              </div>
            </th>
            <th className="border px-2 py-1 cursor-pointer text-left hover:bg-gray-300 transition-colors duration-150"
                onClick={() => handleSort('lastName')}>
              <div className="flex items-center justify-between">
                Last Name
                {renderSortIcon('lastName')}
              </div>
            </th>
            <th className="border px-2 py-1 text-left">Email</th>
            <th className="border px-2 py-1 cursor-pointer text-right hover:bg-gray-300 transition-colors duration-150"
                onClick={() => handleSort('salary')}>
              <div className="flex items-center justify-between">
                Salary
                {renderSortIcon('salary')}
              </div>
            </th>
            <th className="border px-2 py-1 cursor-pointer text-right hover:bg-gray-300 transition-colors duration-150"
                onClick={() => handleSort('date')}>
              <div className="flex items-center justify-between">
                DOJ
                {renderSortIcon('date')}
              </div>
            </th>
            <th className="border px-2 py-1 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((emp, index) => (
            <tr key={emp.id} className="hover:bg-gray-50">
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={selectedEmployees.has(emp.id)}
                  onChange={() => handleSelectEmployee(emp.id)}
                  className="cursor-pointer"
                />
              </td>
              <td className="border px-2 py-1 text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="border px-2 py-1">{emp.firstName}</td>
              <td className="border px-2 py-1">{emp.lastName}</td>
              <td className="border px-2 py-1">{emp.email}</td>
              <td className="border px-2 py-1 text-right">{formatter.format(emp.salary)}</td>
              <td className="border px-2 py-1 text-right">{emp.date || '-'}</td>
              <td className="border px-2 py-1">
                <button
                  className="text-blue-600 mr-2"
                  onClick={() => { setEditingEmployee(emp); setShowForm(true); }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      {/* Pagination Controls */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
 
export default EmployeeTable;
