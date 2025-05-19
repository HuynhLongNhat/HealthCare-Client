// src/redux/features/appointmentSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentBooking: null,
  paymentStatus: null,
  isLoading: false,
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setBooking: (state, action) => {
      state.currentBooking = action.payload
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  }
})

export const { setBooking, setPaymentStatus, setLoading } = appointmentSlice.actions
export default appointmentSlice.reducer