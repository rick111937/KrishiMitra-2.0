import axiosClient from './axiosClient';
export const fetchSoilStats = () => axiosClient.get('/soil');