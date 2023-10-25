import { createSlice } from "@reduxjs/toolkit";

export const userdata = createSlice({
    name:'userdata',
    initialState:{value:0},
    reducers:{
        userprofileupdate:(state,action)=>
        {
state.value=action.payload;
        }
    }
})

export const{userprofileupdate}=userdata.actions;
export default userdata.reducer;