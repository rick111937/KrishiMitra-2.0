import axiosClient from './axiosClient';

export const fetchWarehouses = () => axiosClient.get('/warehouses');
export const bookWarehouse = (data) => axiosClient.post('/warehouses/book', data);