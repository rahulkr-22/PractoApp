import {createSlice} from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
    name:"appointment",
    initialState:{
        time:null,
        doctorId:0,
        fee:0,
        doctorName:"",
        doctorImg:"",

    },
    reducers:{
        // actions
        setTime:(state,action)=>{
            state.time = action.payload;
        },
        setDoctorId:(state,action)=>{
            state.doctorId=action.payload;
        },
        setFee:(state,action)=>{
            state.fee=action.payload;
        },
        setDoctorName:(state,action)=>{
            state.doctorName=action.payload
        },
        setDoctorImg:(state,action)=>{
            state.doctorImg=action.payload
        },
    }
});
export const {setTime,setDoctorId,setFee,setDoctorName,setDoctorImg} = appointmentSlice.actions;
export default appointmentSlice.reducer;