/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import AxiosInstance from "../AxiosInstance/AxiosInstance";
import DisplayToast from "../DisplayToast/DisplayToast";

const DeleteFromDB = async (information : any , thunkAPI : GetThunkAPI<any>) => {
    const {   url  , id , token , toastMessage } = information;
    const URL = id ?  `${url}/${id}` : url
    const {  rejectWithValue } = thunkAPI;
    try {
      const response = await AxiosInstance.delete(URL , {
        headers : {
            Authorization: "Bearer " + token,
        }
      });
      if (response.status === 200 || response.status === 201) {  
        DisplayToast(toastMessage , true)
        return true;
      } 
    } catch (err : any) {
      console.log(err)
      const message =   err.response.data.message ? err.response.data.message : 'حاول في وقت لاحق'
      DisplayToast(message , false)
      throw rejectWithValue(message);
    }
};

export default DeleteFromDB