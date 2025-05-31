import { configureStore } from '@reduxjs/toolkit'
import appointmentReducer from "./appointment.slice"
import userReducer from "./user.slice"
export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    user : userReducer,
  },
})