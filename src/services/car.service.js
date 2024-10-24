// src/services/car.service.js
import api from './api'; // Make sure to adjust the import if your api file is in a different location

export const getCars = async () => {
  const response = await api.get('/cars');
  return response.data;
};

export const createCar = async (carData) => {
  const response = await api.post('/cars', carData);
  return response.data;
};

export const updateCar = async (id, carData) => {
  const response = await api.put(`/cars/${id}`, carData);
  return response.data;
};

export const deleteCar = async (id) => {
  await api.delete(`/cars/${id}`);
};
