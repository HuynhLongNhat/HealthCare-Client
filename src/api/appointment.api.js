import axios from "../utils/axiosAppointmentServcice"

export const createBooking = (data) => {
  return axios.post("/", data);
};

export const getAllMyBooking = (userId) => {
   return axios.get(`/all/${userId}`)
}

export const getBookingDetail = (appointmentId) => {
   return axios.get(`/${appointmentId}`)
}

export const cancelAppointment = (appointmentId, data) => {
     return axios.patch(`/${appointmentId}/cancel` , data)
 
}

export const approvalAppointment = (appointmentId) => {
     return axios.patch(`/${appointmentId}/approve` )
 
}

export const rejectAppointment = (appointmentId , data) => {
     return axios.patch(`/${appointmentId}/reject` ,data)
 
}

export const confirmPayment = (appointmentId) => {
     return axios.put(`/${appointmentId}/confirmPayment`)
 
}

export const createPaymentLink = async (data) => {
    return axios.post("/create-payment-link", data);
   
};

