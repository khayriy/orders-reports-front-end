/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GetFromDB from "../../helpers/GetFromDB/GetFromDB";
import AddToDB from "../../helpers/AddToDB/AddToDB";
import DeleteFromDB from "../../helpers/DeleteFromDB/DeleteFromDB";
import UpdateDB from "../../helpers/UpdateDB/UpdateDB";

export const login = createAsyncThunk(
  "auth/login",
  async (information: any, thunkAPI) => {
    return AddToDB(information, thunkAPI);
  }
);
export const createNewUser = createAsyncThunk(
  "auth/create",
  async (information: any, thunkAPI) => {
    return AddToDB(information, thunkAPI);
  }
);

export const deleteUser = createAsyncThunk(
  "auth/delete",
  async (information: any, thunkAPI) => {
    return DeleteFromDB(information, thunkAPI);
  }
);

export const getAllUsers = createAsyncThunk(
  "auth/getAll",
  async (information: any, thunkAPI) => {
    return GetFromDB(information, thunkAPI);
  }
);

export const updateUser = createAsyncThunk(
  "auth/update",
  async (information: any, thunkAPI) => {
    return UpdateDB(information, thunkAPI);
  }
);
const storedPermissionsString = sessionStorage.getItem("senoritaPermissions");
let parsedPermissions;

try {
  parsedPermissions = storedPermissionsString
    ? JSON.parse(storedPermissionsString)
    : {};
} catch (error) {
  parsedPermissions = {}; // Provide a default value in case of parsing error
}
const initialState = {
  token: sessionStorage.getItem("senoritaToken") ?? "",
  roleName: sessionStorage.getItem("senoritaRoleName") ?? "",
  permissions: parsedPermissions,
  isUserLogIn: !!sessionStorage.getItem("senoritaToken"),
  isWaitingForLogin: false,
  users: [],
  isWaitingForAddNewUser: false,
  isUsersRequireRender: false,
  isWaitingForGetUsers : false , 
  isWaitingForDeletUser : false , 
  isWaitingForUpdateUser : false
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    // get All
    builder.addCase(getAllUsers.pending, (state) => {
      state.isWaitingForGetUsers = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state , action) => {
      state.users = action.payload
      state.isWaitingForGetUsers = false;
    });
    builder.addCase(getAllUsers.rejected, (state) => {
      state.isWaitingForGetUsers = false;
    });
    //get all !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // delete one
    builder.addCase(deleteUser.pending, (state) => {
      state.isWaitingForDeletUser = true;
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.isUsersRequireRender = !state.isUsersRequireRender
      state.isWaitingForDeletUser = false;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.isWaitingForDeletUser = false;
    });
    //delete One !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

     //update one
     builder.addCase(updateUser.pending, (state) => {
      state.isWaitingForUpdateUser = true;
    });
    builder.addCase(updateUser.fulfilled, (state) => {
      state.isUsersRequireRender = !state.isUsersRequireRender
      state.isWaitingForUpdateUser = false;
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.isWaitingForUpdateUser = false;
    });
    //update One !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    // login start
    builder.addCase(login.pending, (state) => {
      state.isWaitingForLogin = true;
    });
    builder.addCase(login.fulfilled, (state, action: any) => {
      state.isWaitingForLogin = false;
      state.token = action.payload.token;
      state.permissions = action.payload.user.permission;
      state.isUserLogIn = true;
      sessionStorage.setItem("senoritaToken", action?.payload?.token);
      sessionStorage.setItem("senoritaRoleName", action.payload.user.roleName);
      sessionStorage.setItem(
        "senoritaPermissions",
        JSON.stringify(action.payload.user.permission)
      );
    });
    builder.addCase(login.rejected, (state) => {
      state.isWaitingForLogin = false;
    });
    //login end

    // add new user
    builder.addCase(createNewUser.pending, (state) => {
      state.isWaitingForAddNewUser = true;
    });
    builder.addCase(createNewUser.fulfilled, (state) => {
      state.isUsersRequireRender = !state.isUsersRequireRender;
      state.isWaitingForAddNewUser = false;
    });
    builder.addCase(createNewUser.rejected, (state) => {
      state.isWaitingForAddNewUser = false;
    });
    //add new user end !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  },
});
export default authSlice;
export const authActions = authSlice.actions;
