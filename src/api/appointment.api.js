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

export const createDiagnosis = async (data) => {
    return axios.post("/diagnosis", data);
};

export const getDiagnosisByAppointmentId = async (appointmentId) => {
    return axios.get(`/${appointmentId}/diagnosis`);
};

export const deleteDiagnosis = async (diagnosisId) => {
    return axios.delete(`/diagnosis/${diagnosisId}`);
};

export const updateDiagnosis = async (diagnosisId , data) => {
    return axios.put(`/diagnosis/${diagnosisId}`,data);
};


export const createPrescription = async (data) => {
    return axios.post("/prescription", data);
};

export const getPrescriptionByAppointmentId = async (appointmentId) => {
    return axios.get(`/${appointmentId}/prescription`);
};

export const deletePrescription = async (prescriptionId) => {
    return axios.delete(`/prescription/${prescriptionId}`);
};
export const updatePrescription = async (prescription_detailsId , data) => {
    return axios.put(`/prescription/${prescription_detailsId}`,data);
};



export const sendPrescription = async (prescriptionId,data) => {
    return axios.post(`/prescription/${prescriptionId}/send`, data);
};