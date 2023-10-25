import {createSlice} from '@reduxjs/toolkit';

export const globaldata = createSlice({
name:'globaldata',
initialState:{value:0},
reducers : {
    updatedata:(state,action)=>{
        state.value= action.payload;
    }
}
})

export const {updatedata} =globaldata.actions;
export default globaldata.reducer;
