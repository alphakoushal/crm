import { configureStore } from '@reduxjs/toolkit'
import userdata from '../reducers/Userdata'
import  Crmstyle from '../reducers/Style'
import { globaldata } from '../reducers/Gloabldata'
export default configureStore({
  reducer: {
    userdata:userdata,
    crmstyle:Crmstyle,
    Globaldata :globaldata
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    thunk: {
      extraArgument: 'crm'
    }
  })
})