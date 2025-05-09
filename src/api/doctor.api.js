import axios from "../utils/axiosDoctorService";

export const createDoctor = (doctorData) => {
  return axios.post(`/doctors`, doctorData);
};

export const deleteDoctor = (doctorId) => {
  return axios.delete(`/doctors/${doctorId}`);
};

export const getDoctorById = (doctorId) => {
  return axios.get(`/doctors/${doctorId}`);
};

export const getAllDoctors = () => {
  return axios.get(`/doctors`);
};

export const getAllSpecializations = () => {
  return axios.get("/doctors/specializations");
};

export const updateDoctorProfile = (doctorId, doctorData) => {
  return axios.put(`/doctors/${doctorId}/profile`, doctorData);
};


export const getAllClinics = () =>{
  return axios.get('/doctors/clinics');

}

export const getAllClinicsByDoctorId = (doctorId) =>{
  return axios.get(`/doctors/clinics/doctors/${doctorId}`);

}


export const createClinic = (clinicData) =>{
  return axios.post('/doctors/clinics',clinicData);

}

export const deleteClinic = (clinicId) =>{
  return axios.delete(`/doctors/clinics/${clinicId}`);

}

export const getClinicDetail = (clinicId) =>{
  return axios.get(`/doctors/clinics/${clinicId}`);

}

export const updateClinic = (clinicId,clinicData) =>{
  return axios.put(`/doctors/clinics/${clinicId}`,clinicData);

}

export const createNewSpecializations = (specializationsData) => {
  return axios.post(
    "/doctors/specializations",
    specializationsData,
  );
};

export const deleteSpecializations = (specializationId) => {
  return axios.delete(
    `/doctors/specializations/${specializationId}`,
  );
};

export const getSpecializationsById = (specializationId) => {
  return axios.get(
    `/doctors/specializations/${specializationId}`,
  
  );
};

export const updateSpecializations = (specializationId,specializationsData) => {
  return axios.put(
    `/doctors/specializations/${specializationId}`,
    specializationsData
  );
};


export const addSchedule = (doctorId , clinicId , scheduleData ) =>{
   return axios.post(`doctors/${doctorId}/clinic/${clinicId}/schedules`,scheduleData)
}

export const getDoctorSchedulesByClinic = (doctorId , clinicId) =>{
  return axios.get(`doctors/${doctorId}/clinic/${clinicId}/schedules`)

}

export const deleteScheduleById = (scheduleId) =>{
   return axios.delete(`doctors/schedules/${scheduleId}`)
}


export const getAllDoctorBySpecialization = (specializationId) =>{
  return axios.get(`doctors/specializations/${specializationId}/doctors`)

}

export const createRatingDoctor = (data) => {
  return axios.post(`doctors/ratings`,data);
};

export const deleteRatingDoctor = (ratingId) => {
  return axios.delete(`doctors/ratings/${ratingId}`);
};


export const getDoctorRatingsByDoctorId = (doctorId) => {
  return axios.get(`doctors/${doctorId}/ratings`);
};

export const updateRatingDoctor = (ratingId ,data) => {
  return axios.put(`doctors/ratings/${ratingId}`,data);
};