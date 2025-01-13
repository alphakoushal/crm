import { createSlice } from "@reduxjs/toolkit";

export const userdata = createSlice({
    name:'userdata',
    initialState:{value:0,profilebar:{status:false,type:'AG',email:''}},
    reducers:{
        userprofileupdate:(state,action)=>
        {
state.value=action.payload;
        },
        profilesidebar: (state,action)=>{
state.profilebar=action.payload;
        }
    }
})

export const{userprofileupdate,profilesidebar}=userdata.actions;
export default userdata.reducer;