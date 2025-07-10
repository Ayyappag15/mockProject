import axios from 'axios';
const API_URL = 'https://686e1feac9090c4953885f55.mockapi.io/mockData/employee';

export const fetchEmployees = () => axios.get(API_URL);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);
export const updateEmployee = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const addEmployee = (data) => axios.post(API_URL, data);
