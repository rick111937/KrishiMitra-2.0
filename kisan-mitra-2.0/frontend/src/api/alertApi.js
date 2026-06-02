import axiosClient from './axiosClient';
export const fetchAlerts = () => axiosClient.get('/alerts');