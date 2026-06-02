import axiosClient from './axiosClient';
export const fetchRiskIndex = () => axiosClient.get('/crop-risk');