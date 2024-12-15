/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Form, Button, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { FormInstance } from "antd";
import {  UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import ClearForm from "../../helpers/ClearForm/ClearForm";
import PermissionRow from "../PermissionRow/PermissionRow";
import { createNewUser } from "../../store/authSlice/authSlice";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddNewUser = () => {

  const {token} = useSelector((state : any) =>state.auth)

  const  formRef = useRef<FormInstance<any>>(null);
  const {isWaitingForAddNewUser} = useSelector((state : any) => state.auth)
  const dispatch : DispatchInterface = useDispatch()
  const [email , setEmail]  = useState('')
  const [password , setPassword] = useState('')
  const [roleName , setRoleName] = useState('')
  const [isFormError, setIsFormError] = useState(false);

  const [view, setView] = useState([]);
  const [create, setCreate] = useState([]);
  const [update, setUpdate] = useState([]);
  const [remove, setRemove] = useState([]);
  
 
  useEffect(() => {
    if (
    email === "" 
    || password === '' || password.length < 8 || [...view , ...create , ...update , ...remove].length == 0
    ) {
      setIsFormError(true);
      return;
    } else {
      setIsFormError(false);
    }
  }, [email , password , view , create , update , remove]);
 
  const  addUserHandler = (e :React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    dispatch(createNewUser( 
      {token , data : {email  , password , roleName , permission : {
        view  , create  , update , remove  
      }  } , 
      toastMessage : 'تم اضافة المستخدم بنجاح' ,
      url : 'user/signup' , 
      clearForm : ()=> ClearForm(formRef) , 
       
    })
    )
}
  return (
    <Form layout="vertical" onSubmitCapture={(e)=>addUserHandler(e)} ref={formRef}>
    <Form.Item
      hasFeedback
      name={"name"}
      validateTrigger="onBlur" 
      label={"البريد الالكتروني"}
      rules={[{
          validator: async () => {
            if( !email || email === '') {
              return Promise.reject(new Error('لابد من توافر البريد '));
             } 
            if(emailRegex.test(email) === false) {
              return Promise.reject(new Error('لابد من ادخال بريد الكتروني صالح'));
             }
          },
        },   
        ]}      
        required={true}
        tooltip={"  مطلوب"}
    >
      <Input
        size="large"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={"البريد الاكتروني للمستخدم"}
        prefix={<UserOutlined  />}
      />
    </Form.Item>
    <Form.Item
      hasFeedback
      name={"name2"}
      validateTrigger="onBlur" 
      label={"كلمة المرور"}
      rules={[{
          validator: async () => {
            if( !password || password === '') {
              return Promise.reject(new Error('لابد من توافر المرور '));
             } 
            if(password.length < 8) {
              return Promise.reject(new Error('كلمة المرور علي الاقل 8'));
             }
          },
        },   
        ]}      
        required={true}
        tooltip={"  مطلوب"}
    >
      <Input
        size="large"
        value={email}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"كلمة مرور المستخدم"}
        prefix={<UserOutlined />}
      />
    </Form.Item>
    <Form.Item
      hasFeedback
      name={"name4"}
      validateTrigger="onBlur" 
      label={"اسم الدور"}
      rules={[{
          validator: async () => {
            if( !roleName || roleName === '') {
              return Promise.reject(new Error('لابد من توافر اسم الدور '));
             } 
          },
        },   
        ]}      
        required={true}
        tooltip={"مطلوب"}
    >
      <Input
        size="large"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        placeholder={"اسم الدور للمستخدم"}
        prefix={<UserOutlined  />}
      />
    </Form.Item>
    <Form.Item
      required
      label={"الصلاحيات"}
      
    >
     <PermissionRow
        view={view}
        setView={setView}
        create={create}
        setCreate={setCreate}
        update={update}
        setUpdate={setUpdate}
        remove={remove}
        setRemove={setRemove}
        text={'الشحن'}
        permissionField="ship"
      />

  <PermissionRow
        view={view}
        setView={setView}
        create={create}
        setCreate={setCreate}
        update={update}
        setUpdate={setUpdate}
        remove={remove}
        setRemove={setRemove}
        text={'الطلبات'}
        permissionField="order"
      />
      <PermissionRow
        view={view}
        setView={setView}
        create={create}
        setCreate={setCreate}
        update={update}
        setUpdate={setUpdate}
        remove={remove}
        setRemove={setRemove}
        text={'المنتجات'}
        permissionField="product"
      />
    </Form.Item>
    
    <Button
      type="primary"
      disabled={isFormError || isWaitingForAddNewUser}
      htmlType="submit"
      loading={isWaitingForAddNewUser}
      style={{ width: "100%", marginTop: "1rem" }}
    >
      إضافة  المستخدم
    </Button>
  </Form>
  )
};

export default AddNewUser;
