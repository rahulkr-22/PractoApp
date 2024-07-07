import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import appointmentSlice from "./appointmentSlice";

const store = configureStore({
    reducer:{
        user:userSlice,
        appointment: appointmentSlice
    }
});
export default store;