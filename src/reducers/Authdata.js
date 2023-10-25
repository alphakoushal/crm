import { createSlice } from "@reduxjs/toolkit";

export const Authdata = createSlice({
    name: "authdata",
    initialState : {'userid':'','type':''},
    reducers :{
        addauthdata : function(state,action){
state.userid='';
state.type='';
        }
    }
})

export const {addauthdata} =Authdata.actions;
export default addauthdata.reducers;