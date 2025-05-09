import axios from "../../src/utils/customAxios";
const token = JSON.parse(localStorage.getItem("token"))?.accessToken;


export const getAllMeetingByClassId = (classId) => {
  return axios.get(`/app/meetings/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createMeetingByClassId = (classId, roomName , link) => {
  console.log("Roomname" , roomName , "link" ,link)
  return axios.post(`/app/meetings/${classId}`, {roomName: roomName, link: link},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteMeetingById = (meetingId) => {
  return axios.delete(`/app/meetings/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};