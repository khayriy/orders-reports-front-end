/* eslint-disable @typescript-eslint/no-explicit-any */

import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import AxiosInstance from "../AxiosInstance/AxiosInstance";
import DisplayToast from "../DisplayToast/DisplayToast";

const AddToDB = async (information : any , thunkAPI : GetThunkAPI<any>) => {
    const {   url  , data , token , toastMessage , clearForm } = information;
    const {  rejectWithValue } = thunkAPI;
    
    try {
      const response = await AxiosInstance.post(url , {...data} , {
          headers: {
             Authorization:
             "Bearer " + token
          }
      })
      if (response.status === 200 || response.status === 201) {  
        DisplayToast(toastMessage, true)
        if(clearForm) {
          clearForm()
        }
       
      
        
      }
      else {

        const message = response.data.message
        DisplayToast(message , false)
      }
      return response.data.data;
    } catch (err : any) {
      console.log(err?.response , 'are you here')
      const message =   err.response ? err.response.data.error : 'حاول في وقت لاحق'
      DisplayToast(message , false)
      if(err?.response?.data?.data) {
        throw rejectWithValue(err?.response?.data);
      }
      else {
        throw rejectWithValue(message);
      }
      
    }
};
export default AddToDB