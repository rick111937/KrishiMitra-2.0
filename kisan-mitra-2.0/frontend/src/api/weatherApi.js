import axiosClient from './axiosClient';
export const fetchWeather = () => axiosClient.get('/weather');