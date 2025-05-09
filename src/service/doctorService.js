import axios from "axios";



export const getAllDoctors = () => {
  return axios.get(
    "http://localhost:8002/api/doctors",
   
  );
};

export const getDoctorsById = (doctorId) => {
  return axios.get(`http://localhost:8002/api/doctors/${doctorId}`);
};

export const updateDoctorInfoByAdmin = (doctorId , doctorData) => {
  return axios.put(`http://localhost:8002/api/doctors/${doctorId}`, doctorData ,
      {
      withCredentials: true,
    }
  );
};

export const getAllSchedule = () => {
  return axios.get('http://localhost:8002/api/doctors/all/schedules');
};

export const getDetailsShedule = (doctorId , scheduleId) => {
  return axios.get(`http://localhost:8002/api/doctors/${doctorId}/schedules/${scheduleId}`);
};