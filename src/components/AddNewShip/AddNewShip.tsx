/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Form, Button, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { FormInstance } from "antd";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createNewShip } from "../../store/shipSlice/shipSlice";
import DispatchInterface from "../../types/DispatchInterface";
import ClearForm from "../../helpers/ClearForm/ClearForm";

const arabicRX = new RegExp(/^[ء-ي\s]+$/) 
const numbersRX = new RegExp(/^[0-9]*$/)
const AddNewShip = () => {

  const  formRef = useRef<FormInstance<any>>(null);
  const {isWaitingForAddShip} = useSelector((state : any) => state.ship)
  const dispatch : DispatchInterface = useDispatch()
  const [shipName , setShipName]  = useState('')
  const [shipPhone , setShipPhone] = useState('')
  const [isFormError, setIsFormError] = useState(false);

  const {token} = useSelector((state : any)=>state.auth)
  useEffect(() => {
    if (
    shipName === "" 
    || shipPhone === "" 
    || arabicRX.test(shipName) === false 
    || shipPhone.length !==11 
    || numbersRX.test(shipPhone) === false || shipPhone.startsWith('010') === false
    && shipPhone.startsWith('011') === false 
    && shipPhone.startsWith('012') === false 
    && shipPhone.startsWith('015') === false
    ) {
      setIsFormError(true);
      return;
    } else {
      setIsFormError(false);
    }
  }, [shipPhone, shipName]);
 
  const  addShipHandler = (e :React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    dispatch(createNewShip( 
      {data : {name : shipName , phone : shipPhone} , 
      toastMessage : 'تم اضافة مسئول الشحن بنجاح' ,
      url : 'ship' , 
      clearForm : ()=> ClearForm(formRef) , 
      token
    })
    )
}
  return (
    <Form layout="vertical" onSubmitCapture={(e)=>addShipHandler(e)} ref={formRef}>
    <Form.Item
      hasFeedback
      name={"name"}
      validateTrigger="onBlur" 
      label={"اسم مسئول الشحن"}
      rules={[{
          validator: async () => {
            if( !shipName || shipName === '') {
              return Promise.reject(new Error('لابد من توافر اسم مسئول الشحن'));
             } 
            if(arabicRX.test(shipName) === false) {
              return Promise.reject(new Error('لابد من ادخال مسئول الشحن بالعربي فقط'));
             }
          },
        },   
        ]}      
        required={true}
        tooltip={"  مطلوب"}
    >
      <Input
        size="large"
        value={shipName}
        onChange={(e) => setShipName(e.target.value)}
        placeholder={"اسم مسئول الشحن"}
        prefix={<UserOutlined  />}
      />
    </Form.Item>
   
    <Form.Item
      hasFeedback
      name={"phone"}
      validateTrigger="onBlur" 
      label={"رقم الهاتف"}
      rules={[{
        validator: async () => {
          if( !shipPhone || shipPhone === '') {
            return Promise.reject(new Error('لابد من توافر رقم هاتف مسئول الشحن'));
           } 
          if(numbersRX.test(shipPhone) === false) {
            return Promise.reject(new Error('لابد من ادخال رقم الهاتف ارقام فقط'));
           }
           if(shipPhone.length !== 11){
            return Promise.reject(new Error('لابد أن يكون رقم الهاتف 11 رقم'));
           }
           if(shipPhone.startsWith('011') === false 
           && shipPhone.startsWith('012')=== false 
           &&shipPhone.startsWith('015')=== false 
           &&shipPhone.startsWith('010')=== false){
            return Promise.reject(new Error('لابد ان يبدأ رقم الهاتف ب 011 أو 010 أو 015 أو 012'));
           }
        },
      },   
      ]}        required={true}
      tooltip={"مطلوب"}
    >
      <Input
        size="large"
        value={shipPhone}
        onChange={(e) => setShipPhone(e.target.value)}
        placeholder={"رقم هاتف مسئول الشحن"}
        prefix={<PhoneOutlined />}
      />
    </Form.Item>
    <Button
      type="primary"
      disabled={isFormError}
      htmlType="submit"
      loading={isWaitingForAddShip}
      style={{ width: "100%", marginTop: "1rem" }}
    >
      إضافة مسئول الشحن
    </Button>
  </Form>
  )
        
         
  
            
         
       
       

};

export default AddNewShip;
