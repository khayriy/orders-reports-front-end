/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GetFromDB from "../../helpers/GetFromDB/GetFromDB";
import AddToDB from "../../helpers/AddToDB/AddToDB";
import DeleteFromDB from "../../helpers/DeleteFromDB/DeleteFromDB";
import UpdateDB from "../../helpers/UpdateDB/UpdateDB";




export const getAllShips = createAsyncThunk(
   "ship/all",
    async (information : any, thunkAPI) => {
     return GetFromDB(information, thunkAPI);
    }
);

export const createNewShip = createAsyncThunk(
    "ship/create",
     async (information : any, thunkAPI) => {
      return AddToDB(information, thunkAPI);
     }
 );

 export const deleteShip = createAsyncThunk(
    "ship/delete",
     async (information : any, thunkAPI) => {
      return DeleteFromDB(information, thunkAPI);
     }
 );


 export const updateShip = createAsyncThunk(
   "ship/update",
    async (information : any, thunkAPI) => {
     return UpdateDB(information, thunkAPI);
    }
);


export const getSingleShip = createAsyncThunk('ship/getOne' , 
async (information : any , thunkAPI)=>{
   return GetFromDB(information , thunkAPI)
}
)


export const getSingleShipOrdersByDate = createAsyncThunk('ship/getByDate' , 
   async (information : any , thunkAPI)=>{
      return GetFromDB(information , thunkAPI)
   }
   )

 const initialState = {
   ships : [] , 
   isWaitingForShips : false , 
   errorMessageInGetShips : "" ,
   errorMessage : undefined ,
   isShipsRequireRender : false , 
   isWaitingForAddShip : false , 
   isWaitingForDeleteShip : false , 
   isWaitingForUpdateShip : false , 
   isErrorInUpdateShip : false , 
   ship : {} , 
   isWaitingForGetShip : false , 
   isWaitingForGetOrdersByDate : false, 
   ordersByDate : {}
}
const shipSlice = createSlice({
   name : 'ship' , 
   initialState ,
   reducers : {
      resetError(state ) {
         state.errorMessage = undefined
      }
   } ,
   extraReducers : (builder)=>{
       //start of get All ships   Done!!!!!!!!!!!!!!!!!!1
       builder.addCase(getAllShips.pending , (state )=>{
          state.isWaitingForShips = true
       })
       builder.addCase(getAllShips.fulfilled , (state , action)=>{
         state.ships = action.payload
         state.isWaitingForShips = false
       })
       builder.addCase(getAllShips.rejected , (state , action : any)=>{
         state.isWaitingForShips = false
         state.errorMessageInGetShips = action.payload.message 
      })
     //end of get All ships Done!!!!!!!!!!!!!!!!!!1
    
     //start of create ship  Done!!!!!!!!!!!!!!!!!!1
      builder.addCase(createNewShip.pending , (state )=>{
        state.isWaitingForAddShip = true
     })
     builder.addCase(createNewShip.fulfilled , (state )=>{
        state.isWaitingForAddShip = false
        state.isShipsRequireRender = !state.isShipsRequireRender
     })
     builder.addCase(createNewShip.rejected , (state , action : any)=>{
        state.isWaitingForAddShip = false
        state.errorMessage =   action.payload.message
    })
   //end of of create ship Done!!!!!!!!!!!!!!!!!!1
   //start of  delete  Done!!!!!!!!!!!!!!!!!!1
    builder.addCase(deleteShip.pending , (state )=>{
        state.isWaitingForShips = true
        state.isWaitingForDeleteShip = true
     })
     builder.addCase(deleteShip.fulfilled , (state )=>{
        state.isWaitingForShips = false
        state.isWaitingForDeleteShip = false
        state.isShipsRequireRender = !state.isShipsRequireRender
     })
     builder.addCase(deleteShip.rejected , (state )=>{
        state.isWaitingForShips = false
        state.isWaitingForDeleteShip = false

    })
   //end of of  delete  Done!!!!!!!!!!!!!!!!!!1
    //start of update 
     builder.addCase(updateShip.pending , (state )=>{
      state.isWaitingForShips = true
      state.isWaitingForUpdateShip = true 
      state.isErrorInUpdateShip = false
     })
     builder.addCase(updateShip.fulfilled , (state)=>{
      state.isWaitingForShips = false
      state.isWaitingForUpdateShip = false 
      state.isShipsRequireRender = !state.isShipsRequireRender 
     })
     builder.addCase(updateShip.rejected , (state )=>{
      state.isWaitingForShips = false
      state.isErrorInUpdateShip = true
    })
   //end of update
   
   builder.addCase(getSingleShip.pending , (state )=>{
      state.isWaitingForGetShip = true
     
     })
     builder.addCase(getSingleShip.fulfilled , (state , action)=>{
      state.isWaitingForGetShip = false
      state.ship = action.payload 
     })
     builder.addCase(getSingleShip.rejected , (state )=>{
      state.isWaitingForGetShip = false
      
    })
// start of get ship orders by date
    builder.addCase(getSingleShipOrdersByDate.pending , (state )=>{
      state.isWaitingForGetOrdersByDate = true
     
     })
     builder.addCase(getSingleShipOrdersByDate.fulfilled , (state , action)=>{
      state.isWaitingForGetOrdersByDate = false
      state.ordersByDate = action.payload 
     })
     builder.addCase(getSingleShipOrdersByDate.rejected , (state )=>{
      state.isWaitingForGetOrdersByDate = false
    })
    // end of get ship orders by date

}
})
export default shipSlice
export const shipActions = shipSlice.actions