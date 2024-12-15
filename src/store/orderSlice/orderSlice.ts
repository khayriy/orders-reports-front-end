/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AddToDB from "../../helpers/AddToDB/AddToDB";
import GetFromDB from "../../helpers/GetFromDB/GetFromDB";
import UpdateDB from "../../helpers/UpdateDB/UpdateDB";
import DeleteFromDB from "../../helpers/DeleteFromDB/DeleteFromDB";

export const createNewOrder = createAsyncThunk(
    "order/create",
     async (information : any, thunkAPI) => {
      return AddToDB(information, thunkAPI);
     }
 );

 export const getAllPendingOrders = createAsyncThunk(
  "order/getPending",
   async (information : any, thunkAPI) => {
    return GetFromDB(information, thunkAPI);
   }
);


export const getAllScheduleOrders = createAsyncThunk(
  "order/getSchedule",
   async (information : any, thunkAPI) => {
    return GetFromDB(information, thunkAPI);
   }
);


export const getAllRunningOrders = createAsyncThunk(
  "order/getRunning",
   async (information : any, thunkAPI) => {
    return GetFromDB(information, thunkAPI);
   }
);
export const updateOrderProducts = createAsyncThunk(
  "order/updateProducts",
   async (information : any, thunkAPI) => {
    return UpdateDB(information, thunkAPI);
   }
);

export const updateOrdersToRun = createAsyncThunk(
  "order/runOrders",
  async (information : any, thunkAPI) => {
   return AddToDB(information, thunkAPI);
  }
)


export const geOrdersCount = createAsyncThunk(
  "order/count",
  async (information : any, thunkAPI) => {
   return GetFromDB(information, thunkAPI);
  }
)

export const deletePendingOrder = createAsyncThunk(
  "order/delete",
   async (information : any, thunkAPI) => {
    return DeleteFromDB(information, thunkAPI);
   }
);

export const deleteScheduleOrder = createAsyncThunk(
  "order/ScheduleDelete",
   async (information : any, thunkAPI) => {
    return DeleteFromDB(information, thunkAPI);
   }
);

export const getSingleOrder = createAsyncThunk('order/getSingle' , 

async(information : any , thunkAPI)=>{
  return GetFromDB(information , thunkAPI)
})

export const getOrdersByPhone = createAsyncThunk('order/getByPhone' , 

async(information : any , thunkAPI)=>{
  return GetFromDB(information , thunkAPI)
})
export const getOrdersByName = createAsyncThunk('order/getByName' , 

async(information : any , thunkAPI)=>{
  return GetFromDB(information , thunkAPI)
})
export const updateOrders = createAsyncThunk(
  "order/updateMany",
  async (information : any, thunkAPI) => {
   return AddToDB(information, thunkAPI);
  }
)

export const getAllOrdersWithFilter = createAsyncThunk(
  "order/getFilter",
   async (information : any, thunkAPI) => {
    return GetFromDB(information, thunkAPI);
   }
);

export const getSingleOrderView = createAsyncThunk('order/getSingleView' , 

async(information : any , thunkAPI)=>{
  return GetFromDB(information , thunkAPI)
})
// تعديل الشحن للكثير 
export const updateOrdersShip = createAsyncThunk(
  "order/updateShip",
  async (information : any, thunkAPI) => {
   return AddToDB(information, thunkAPI);
  }
)

 const initialState = {
  isWaitingForAddOrder : false , 
  pendingOrders : [] , 
  runningOrders : [] , 
  isWaitingForGetPendingOrders : false , 
  isPendingOrdersRequireRender : false , 
  isErrorInGetPendingOrders : '' || undefined , 
  isRequireRender : false , 
  isWaitingForUpdateOrder : false ,
  isWaitingForRunOrders : false , 
  isWaitingForGetCount : false , 
  counts : {} , 
  isWaitingForDeleteOrder : false , 
  isWaitingForGetSingleOrder : false , 

  singleOrder : {} , 
  ordersByName : [] , 
  ordersByPhone : [] ,
  isWaitingForGetSingleOrderView : false , 
  issWaitingForGetOrdersByName : false , 

  issWaitingForGetOrdersByPhone : false , 
  
  singleOrderView : {} , 
  
  isWaitingForUpdateManyOrders : false , 
  errorInUpdateMany : '' || undefined , 
  isSingleOrderRequireRender : false , 
  isWaitingForGetOrdersWithFilter : false , 
  filterOrders : [] , 
  isWaitingForDeleteScheduleOrder : false , 
  isScheduleOrdersRequireRender : false, 
  isWaitingForScheduleOrders : false, 
  scheduleOrdersDB : [] , 
  ordersWithStates : [] , 
   
  

}
const orderSlice = createSlice({
   name : 'order' , 
   initialState ,
   reducers : {
      clearOrderSearch(state){
        state.singleOrder = {}
      } , 
      clearOrdersWithStates(state){
        state.ordersWithStates = []
      }
   } ,
   extraReducers : (builder)=>{
    
    //start of get schedule orders   Done!!!!!!!!!!!!!!!!!!1
    builder.addCase(getAllScheduleOrders.pending , (state )=>{
      state.isWaitingForScheduleOrders = true
   })
   builder.addCase(getAllScheduleOrders.fulfilled , (state , action)=>{
     state.scheduleOrdersDB = action.payload 
     state.isWaitingForScheduleOrders = false
   })
   builder.addCase(getAllScheduleOrders.rejected , (state )=>{
     state.isWaitingForScheduleOrders = false
  })
 //end of get pending schedule Done!!!!!!!!!!!!!!!!!!1
    // start od delete Schedule Order
    builder.addCase(deleteScheduleOrder.pending , (state )=>{
      state.isWaitingForDeleteScheduleOrder = true
     })
     builder.addCase(deleteScheduleOrder.fulfilled , (state )=>{ 
       state.isWaitingForDeleteScheduleOrder = false
       state.isScheduleOrdersRequireRender = ! state.isPendingOrdersRequireRender
     })
     builder.addCase(deleteScheduleOrder.rejected , (state )=>{
       state.isWaitingForDeleteScheduleOrder = false
      })
    // end of delete Schedule Order !!!!!!!!!!!!!!!!!!1
     //start of get singleOrder 
     builder.addCase(getAllOrdersWithFilter.pending , (state )=>{
      state.isWaitingForGetOrdersWithFilter = true
   })
   builder.addCase(getAllOrdersWithFilter.fulfilled , (state , action)=>{
     state.isWaitingForGetOrdersWithFilter = false
     state.filterOrders = action.payload
     
   })
   builder.addCase(getAllOrdersWithFilter.rejected , (state)=>{
     state.isWaitingForGetOrdersWithFilter = false
     
  })
  // end of get single order   

    //start of get update Orders 
     builder.addCase(updateOrders.pending , (state )=>{
      state.ordersWithStates = []
      state.isWaitingForUpdateManyOrders = true
   })
   builder.addCase(updateOrders.fulfilled , (state)=>{
     state.ordersWithStates = []
     state.isWaitingForUpdateManyOrders = false
   })
   builder.addCase(updateOrders.rejected , (state , action : any)=>{
      state.ordersWithStates = action?.payload?.data ?? []
     state.isWaitingForUpdateManyOrders = false
     
  })
  
  // end of update orders 

   //start of get update Orders 
   builder.addCase(updateOrdersShip.pending , (state)=>{
    state.ordersWithStates = []
    state.isWaitingForUpdateManyOrders = true
 })
 builder.addCase(updateOrdersShip.fulfilled , (state)=>{
   state.ordersWithStates = []
   state.isWaitingForUpdateManyOrders = false
 })
 builder.addCase(updateOrdersShip.rejected , (state , action : any)=>{
    state.ordersWithStates = action?.payload?.data ?? []
   state.isWaitingForUpdateManyOrders = false
   
})

// end of update orders 
  
   //start of get singleOrder 
   builder.addCase(getSingleOrderView.pending , (state )=>{
    state.isWaitingForGetSingleOrder = true
 })
 builder.addCase(getSingleOrderView.fulfilled , (state , action)=>{
   state.isWaitingForGetSingleOrderView = false
   state.singleOrderView = action.payload
 })
 builder.addCase(getSingleOrderView.rejected , (state )=>{
   state.isWaitingForGetSingleOrderView = false
})
// end of get single order   
  
  //start of get singleOrder 
      builder.addCase(getSingleOrder.pending , (state )=>{
        state.isWaitingForGetSingleOrder = true
        state.singleOrder = {} ,
        state.ordersByPhone = [] , 
        state.ordersByName = []
     })
     builder.addCase(getSingleOrder.fulfilled , (state , action)=>{
       state.isWaitingForGetSingleOrder = false
       state.singleOrder = action.payload
     })
     builder.addCase(getSingleOrder.rejected , (state )=>{
       state.isWaitingForGetSingleOrder = false
    })
    // end of get single order
    
    //start of get orders by phone 
    builder.addCase(getOrdersByPhone.pending , (state )=>{
      state.issWaitingForGetOrdersByPhone = true
        state.singleOrder = {} ,
        state.ordersByPhone = [] , 
        state.ordersByName = []
   })
   builder.addCase(getOrdersByPhone.fulfilled , (state , action)=>{
     state.issWaitingForGetOrdersByPhone = false
     state.ordersByPhone = action.payload
   })
   builder.addCase(getOrdersByPhone.rejected , (state )=>{
     state.issWaitingForGetOrdersByPhone = false
  })
  // end of get orders by phone

   //start of get orders by names 
   builder.addCase(getOrdersByName.pending , (state )=>{
    state.issWaitingForGetOrdersByName = true
      state.singleOrder = {} ,
      state.ordersByPhone = [] , 
      state.ordersByName = []
 })
 builder.addCase(getOrdersByName.fulfilled , (state , action)=>{
   state.issWaitingForGetOrdersByName = false
   state.ordersByName = action.payload
 })
 builder.addCase(getOrdersByName.rejected , (state )=>{
   state.issWaitingForGetOrdersByName = false
})
// end of get orders by phone

     //start of create order   Done!!!!!!!!!!!!!!!!!!1
     builder.addCase(createNewOrder.pending , (state )=>{
        state.isWaitingForAddOrder = true
     })
     builder.addCase(createNewOrder.fulfilled , (state )=>{
       state.isWaitingForAddOrder = false
     })
     builder.addCase(createNewOrder.rejected , (state )=>{
       state.isWaitingForAddOrder = false
    })
   //end of create order Done!!!!!!!!!!!!!!!!!!1
   
 //start of get pending orders   Done!!!!!!!!!!!!!!!!!!1
 builder.addCase(getAllRunningOrders.pending , (state )=>{
  state.isWaitingForGetPendingOrders = true
})
builder.addCase(getAllRunningOrders.fulfilled , (state , action)=>{
 state.runningOrders = action.payload 
 state.isWaitingForGetPendingOrders = false
})
builder.addCase(getAllRunningOrders.rejected , (state )=>{
 state.isWaitingForGetPendingOrders = false
})
//end of get pending orders Done!!!!!!!!!!!!!!!!!!1

   //start of get pending orders   Done!!!!!!!!!!!!!!!!!!1
     builder.addCase(getAllPendingOrders.pending , (state )=>{
        state.isWaitingForGetPendingOrders = true
     })
     builder.addCase(getAllPendingOrders.fulfilled , (state , action)=>{
       state.pendingOrders = action.payload 
       state.isWaitingForGetPendingOrders = false
     })
     builder.addCase(getAllPendingOrders.rejected , (state )=>{
       state.isWaitingForGetPendingOrders = false
    })
   //end of get pending orders Done!!!!!!!!!!!!!!!!!!1

   //start of get update  orders products  Done!!!!!!!!!!!!!!!!!!1
 builder.addCase(updateOrdersToRun.pending , (state )=>{
  state.isWaitingForRunOrders = true
 })
 builder.addCase(updateOrdersToRun.fulfilled , (state )=>{ 
   state.isWaitingForRunOrders = false
   state.isPendingOrdersRequireRender = !state.isPendingOrdersRequireRender
 })
 builder.addCase(updateOrdersToRun.rejected , (state )=>{
   state.isWaitingForRunOrders = false
   state.isPendingOrdersRequireRender = !state.isPendingOrdersRequireRender
  })
//end of  update orders products Done!!!!!!!!!!!!!!!!!!1

 //start of run orders  Done!!!!!!!!!!!!!!!!!!1
 builder.addCase(updateOrderProducts.pending , (state )=>{
  state.isWaitingForUpdateOrder = true
 })
 builder.addCase(updateOrderProducts.fulfilled , (state )=>{ 
   state.isWaitingForUpdateOrder = false
   state.isSingleOrderRequireRender = !state.isSingleOrderRequireRender
  
 })
 builder.addCase(updateOrderProducts.rejected , (state )=>{
   state.isWaitingForUpdateOrder = false
   state.isPendingOrdersRequireRender = !state.isPendingOrdersRequireRender
  })
//end of  run orders Done!!!!!!!!!!!!!!!!!!1

//start of count  Done!!!!!!!!!!!!!!!!!!1
builder.addCase(geOrdersCount.pending , (state )=>{
  state.isWaitingForGetCount = true
 })
 builder.addCase(geOrdersCount.fulfilled , (state , action)=>{ 
   state.isWaitingForGetCount = false
   state.counts = action.payload
 })
 builder.addCase(geOrdersCount.rejected , (state )=>{
   state.isWaitingForGetCount = false
  
  })
  
//end of  run orders Done!!!!!!!!!!!!!!!!!!1
//start of count  Done!!!!!!!!!!!!!!!!!!1
builder.addCase(deletePendingOrder.pending , (state )=>{
  state.isWaitingForDeleteOrder = true
 })
 builder.addCase(deletePendingOrder.fulfilled , (state )=>{ 
   state.isWaitingForDeleteOrder = false
   state.isPendingOrdersRequireRender = ! state.isPendingOrdersRequireRender
 })
 builder.addCase(deletePendingOrder.rejected , (state )=>{
   state.isWaitingForDeleteOrder = false
  
  })
  
//end of  run orders Done!!!!!!!!!!!!!!!!!!1
   
 }
})
export const orderActions = orderSlice.actions
export default orderSlice
