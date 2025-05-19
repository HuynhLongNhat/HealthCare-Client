import axios from "../utils/axiosPaymentService"

export const createPaymentHistory = (data) => {
  return axios.post("/paymentForCash", data);
};

export const getAllMyPayment = (userId) => {
  return axios.get(`/all/${userId}`, );
};

export const getPaymentDetail = (paymentId) => {
  return axios.get(`/${paymentId}`, );
};


export const getPaymentByAppointmentId = (appointmentId) => {
  return axios.get(`/appointment/${appointmentId}`, );
};
export const processPaymentCallback = async (orderCode , status) => {
    return await axios.post(`/${orderCode}/callback`,  status );
 
 
};