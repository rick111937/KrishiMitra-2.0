import axiosClient from './axiosClient';
export const fetchPrices = () => axiosClient.get('/market');