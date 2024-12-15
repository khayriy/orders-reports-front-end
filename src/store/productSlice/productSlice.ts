/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GetFromDB from "../../helpers/GetFromDB/GetFromDB";
import AddToDB from "../../helpers/AddToDB/AddToDB";
import DeleteFromDB from "../../helpers/DeleteFromDB/DeleteFromDB";
import UpdateDB from "../../helpers/UpdateDB/UpdateDB";




export const getAllProducts = createAsyncThunk(
   "product/all",
    async (information : any, thunkAPI) => {
     return GetFromDB(information, thunkAPI);
    }
);

export const createNewProduct = createAsyncThunk(
    "product/createOrder",
     async (information : any, thunkAPI) => {
      return AddToDB(information, thunkAPI);
     }
 );

 export const deleteProduct = createAsyncThunk(
    "product/deleteOrder",
     async (information : any, thunkAPI) => {
      return DeleteFromDB(information, thunkAPI);
     }
 );


 export const deleteProductType = createAsyncThunk(
   "product/deleteType",
    async (information : any, thunkAPI) => {
     return UpdateDB(information, thunkAPI);
    }
);

 export const updateProduct = createAsyncThunk(
    "product/updateProduct",
     async (information : any, thunkAPI) => {
      return UpdateDB(information, thunkAPI);
     }
 );

 export const addTypeHandler = createAsyncThunk(
   "product/addType",
    async (information : any, thunkAPI) => {
     return UpdateDB(information, thunkAPI);
    }
);
 
 export const updateProductType = createAsyncThunk(
   "product/updateTypeA",
    async (information : any, thunkAPI) => {
     return UpdateDB(information, thunkAPI);
    }
);
 const initialState = {
   productsDB : [] , 
   isWaitingForGetProducts : false , 
   errorMessageInGet : "" ,
   errorMessage : undefined ,
   errorField : '' , 
   isProductsRequireRender : false , 
   isWaitingForAddOrder : false , 
   isWaitingForDeleteProduct : false , 
   isWaitingForUpdateProduct : false , 
   isErrorInUpdateProduct : false
}
const productSlice = createSlice({
   name : 'product' , 
   initialState ,
   reducers : {
      resetError(state ) {
         state.errorMessage = undefined
      }
   } ,
   extraReducers : (builder)=>{
       //start of get All products   Done!!!!!!!!!!!!!!!!!!1
       builder.addCase(getAllProducts.pending , (state )=>{
          state.isWaitingForGetProducts = true
       })
       builder.addCase(getAllProducts.fulfilled , (state , action)=>{
         state.productsDB = action.payload
         state.isWaitingForGetProducts = false
       })
       builder.addCase(getAllProducts.rejected , (state , action : any)=>{
         state.isWaitingForGetProducts = false
         state.errorMessageInGet = action.payload.message 
      })
     //end of get All products Done!!!!!!!!!!!!!!!!!!1
    
     //start of create product Done!!!!!!!!!!!!!!!!!!1
       builder.addCase(createNewProduct.pending , (state)=>{
         state.isWaitingForAddOrder = true
     })
     builder.addCase(createNewProduct.fulfilled , (state)=>{
        state.isWaitingForAddOrder = false
        state.isProductsRequireRender = !state.isProductsRequireRender
     })
     builder.addCase(createNewProduct.rejected , (state , action : any)=>{
        state.isWaitingForAddOrder = false
        state.errorField = action.payload.field
        state.errorMessage =   action.payload.message

    })
    //end of create product Done!!!!!!!!!!!!!!!!!!1

     //start of delete product Done!!!!!!!!!!!!!!!!!!1
     builder.addCase(deleteProduct.pending , (state)=>{
        state.isWaitingForGetProducts = true
        state.isWaitingForDeleteProduct =  true
     })
     builder.addCase(deleteProduct.fulfilled , (state)=>{
      state.isWaitingForGetProducts = false
      state.isWaitingForDeleteProduct =  false
      state.isProductsRequireRender = !state.isProductsRequireRender 
     })
     builder.addCase(deleteProduct.rejected , (state )=>{
      state.isWaitingForGetProducts = false
      state.isWaitingForDeleteProduct =  false
    })
    //end of delete product Done!!!!!!!!!!!!!!!!!!1

     //start of delete product type Done!!!!!!!!!!!!!!!!!!1
   builder.addCase(deleteProductType.pending , (state)=>{
      state.isWaitingForGetProducts = true
      state.isWaitingForDeleteProduct =  true
   })
   builder.addCase(deleteProductType.fulfilled , (state)=>{
     state.isWaitingForGetProducts = false
     state.isWaitingForDeleteProduct =  false
     state.isProductsRequireRender = !state.isProductsRequireRender 
   })
   builder.addCase(deleteProductType.rejected , (state )=>{
     state.isWaitingForGetProducts = false
     state.isWaitingForDeleteProduct =  false
  })
    //end of delete product delete product type Done!!!!!!!!!!!!!!!!!!1
    
    
    //star update just products without type Done!!!!!!!!!!!!!!!!!!1
    builder.addCase(updateProduct.pending , (state)=>{
      state.isWaitingForGetProducts = true
      state.isWaitingForUpdateProduct = true 
      state.isErrorInUpdateProduct = false
   })
   builder.addCase(updateProduct.fulfilled , (state)=>{
     state.isWaitingForGetProducts = false
     state.isWaitingForUpdateProduct = false 
     state.isProductsRequireRender = !state.isProductsRequireRender 
   })
   builder.addCase(updateProduct.rejected , (state )=>{
     state.isWaitingForGetProducts = false
     state.isErrorInUpdateProduct = true
  }) 
  //end update just products without type Done!!!!!!!!!!!!!!!!!!1

//star update just products without type Done!!!!!!!!!!!!!!!!!!1
builder.addCase(updateProductType.pending , (state)=>{
   state.isWaitingForGetProducts = true
   state.isWaitingForUpdateProduct = true 
   state.isErrorInUpdateProduct = false
})
builder.addCase(updateProductType.fulfilled , (state)=>{
  state.isWaitingForGetProducts = false
  state.isWaitingForUpdateProduct = false 
  state.isProductsRequireRender = !state.isProductsRequireRender 
})
builder.addCase(updateProductType.rejected , (state )=>{
  state.isWaitingForGetProducts = false
  state.isErrorInUpdateProduct = true
}) 
//end update just products without type Done!!!!!!!!!!!!!!!!!!1

builder.addCase(addTypeHandler.pending , (state)=>{
   state.isWaitingForGetProducts = true
   state.isWaitingForUpdateProduct = true 
   state.isErrorInUpdateProduct = false
})
builder.addCase(addTypeHandler.fulfilled , (state)=>{
  state.isWaitingForGetProducts = false
  state.isWaitingForUpdateProduct = false 
  state.isProductsRequireRender = !state.isProductsRequireRender 
})
builder.addCase(addTypeHandler.rejected , (state )=>{
  state.isWaitingForGetProducts = false
  state.isErrorInUpdateProduct = true
}) 
//end update just products without type Done!!!!!!!!!!!!!!!!!!1
 }
})
export default productSlice
export const productActions = productSlice.actions