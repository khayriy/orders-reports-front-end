import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AddToDB from "../../helpers/AddToDB/AddToDB";

export const getAllOrdersByIds = createAsyncThunk(
    "ordersByIds/getAll",
    async (information : any, thunkAPI) => {
     return AddToDB(information, thunkAPI);
    }
  )

  const initialState = {
    isWaitingForGetOrders : false , 
    ordersByIds : [] , 
   
  }

  const ordersByIdsSlice = createSlice({
    name : 'order' , 
    initialState ,
    reducers : {
        clearOrders : (state)=>{
            state.ordersByIds = []
        }
    } ,
    extraReducers : (builder)=>{
     
     
     builder.addCase(getAllOrdersByIds.pending , (state)=>{
        state.isWaitingForGetOrders = true
    })
    builder.addCase(getAllOrdersByIds.fulfilled , (state , action)=>{
        state.isWaitingForGetOrders = false
        state.ordersByIds = action.payload
    })
    builder.addCase(getAllOrdersByIds.rejected , (state )=>{
        state.isWaitingForGetOrders = false
   })
   // end of get orders by phone

   

  }
 })
 
 export const ordersByIdsActions = ordersByIdsSlice.actions
 export default ordersByIdsSlice