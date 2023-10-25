import { createSlice } from "@reduxjs/toolkit";

export const Crmstyle = createSlice({
    name:"crmstyle",
    initialState : {value:{wrap:{'style':'white-space:nowrap;overflow:hidden;width:100px;max-width:100px','active':'1'},fontsize:'10px'}},
    reducers: {
        updatestyle:(state,action)=>{
state.value[action.payload[1]]=action.payload[0];
        }
        
    }
})

export const{updatestyle} = Crmstyle.actions;
export default Crmstyle.reducer;