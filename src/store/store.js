import { configureStore } from '@reduxjs/toolkit'
import appointmentReducer from "./appointment.slice"

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
  },
})