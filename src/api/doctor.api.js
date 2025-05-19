import axios from "../utils/axiosDoctorService";

export const createDoctor = (doctorData) => {
  return axios.post(`/`, doctorData);
};

export const deleteDoctor = (doctorId) => {
  return axios.delete(`/${doctorId}`);
};

export const getDoctorById = (doctorId) => {
  return axios.get(`/${doctorId}`);
};

export const getAllDoctors = () => {
  return axios.get(`/`);
};

export const getAllSpecializations = () => {
  return axios.get("/specializations");
};

export const updateDoctorProfile = (doctorId, doctorData) => {
  return axios.put(`/${doctorId}/profile`, doctorData);
};


export const getAllClinics = () =>{
  return axios.get('/clinics');

}

export const getAllClinicsByDoctorId = (doctorId) =>{
  return axios.get(`/clinics/doctors/${doctorId}`);

}


export const createClinic = (clinicData) =>{
  return axios.post('/clinics',clinicData);

}

export const deleteClinic = (clinicId) =>{
  return axios.delete(`/clinics/${clinicId}`);

}

export const getClinicDetail = (clinicId) =>{
  return axios.get(`/clinics/${clinicId}`);

}

export const updateClinic = (clinicId,clinicData) =>{
  return axios.put(`/clinics/${clinicId}`,clinicData);

}

export const createNewSpecializations = (specializationsData) => {
  return axios.post(
    "/specializations",
    specializationsData,
  );
};

export const deleteSpecializations = (specializationId) => {
  return axios.delete(
    `/specializations/${specializationId}`,
  );
};

export const getSpecializationsById = (specializationId) => {
  return axios.get(
    `/specializations/${specializationId}`,
  
  );
};

export const updateSpecializations = (specializationId,specializationsData) => {
  return axios.put(
    `/specializations/${specializationId}`,
    specializationsData
  );
};


export const addSchedule = (doctorId , clinicId , scheduleData ) =>{
   return axios.post(`/${doctorId}/clinic/${clinicId}/schedules`,scheduleData)
}

export const getDoctorSchedulesByClinic = (doctorId , clinicId , timeRange) =>{
  return axios.get(`/${doctorId}/clinic/${clinicId}/schedules/${timeRange}`)

}

export const deleteScheduleById = (scheduleId) =>{
   return axios.delete(`/schedules/${scheduleId}`)
}

export const updateScheduleById = (doctorId ,scheduleId , data) => {
     return axios.put(`/${doctorId}/schedules/${scheduleId}` , data)
}

export const getAllDoctorBySpecialization = (specializationId) =>{
  return axios.get(`/specializations/${specializationId}/doctors`)

}

export const createRatingDoctor = (data) => {
  return axios.post(`/ratings`,data);
};

export const deleteRatingDoctor = (ratingId) => {
  return axios.delete(`/ratings/${ratingId}`);
};


export const getDoctorRatingsByDoctorId = (doctorId) => {
  return axios.get(`/${doctorId}/ratings`);
};

export const updateRatingDoctor = (ratingId ,data) => {
  return axios.put(`/ratings/${ratingId}`,data);
};

export const getAllHealthHandBook = () =>{
  return axios.get('/all/handbooks')
}

export const getLatestlHealthHandBook = () =>{
  return axios.get('/latest/handbooks')
}

export const getOutStandinglHealthHandBook = () =>{
  return axios.get('/outstanding/handbooks')
}
export const getAllHealthHandBookByDoctorId = (doctorId) =>{
  return axios.get(`/all/handbooks/doctor/${doctorId}`)

}
export const createNewHealthHandbook = (data) => {
  return axios.post(`/handbook`,data);
};

export const getDetailHealthHandBook = (slug) =>{
  return axios.get(`/handbooks/${slug}`)
}

export const updateHealthHandBook = (slug , data) =>{
  return axios.put(`/handbooks/${slug}` , data)
}

export const deleteHeathHandBook = (id) => {
    return axios.delete(`/handbooks/${id}`)

}

export const createMeetingByDoctor = (doctorId,data) => {
  return axios.post(`/meetings/doctor/${doctorId}`, data)
};

export const getAllMeetingByDoctor = (doctorId) => {
  return axios.get(`/meetings/doctor/${doctorId}`)
};

export const deleteMeeting = (meetingId) => {
  return axios.delete(`/meetings/${meetingId}`)
};

