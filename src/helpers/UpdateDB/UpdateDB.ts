/* eslint-disable @typescript-eslint/no-explicit-any */

import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import AxiosInstance from "../AxiosInstance/AxiosInstance";
import DisplayToast from "../DisplayToast/DisplayToast";

const UpdateDB = async (information : any , thunkAPI : GetThunkAPI<any>) => {
    const {   url , data  , token  , toastMessage  , clear} = information;
    const {  rejectWithValue } = thunkAPI;
    
    try {
      const response = await AxiosInstance.patch(url , {...data} ,  {
        headers :  {
          Authorization: "Bearer " + token,
        } 
      });
      if (response.status === 200 || response.status === 201) {  
        
        DisplayToast(toastMessage , true)
        if(clear) {
          clear()
        }
        return true;
      } 
      
    } catch (err : any) {
      const message =   err.response ? err.response.data.error : 'حاول في وقت لاحق'
      DisplayToast(message , false)
      throw rejectWithValue(message);
    }
};

export default UpdateDB