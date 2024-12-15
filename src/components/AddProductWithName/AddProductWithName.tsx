/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";
import { MdFormatListNumberedRtl } from "react-icons/md";
import { FaLuggageCart } from "react-icons/fa";
import { FormInstance } from "antd";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct, productActions } from "../../store/productSlice/productSlice";
const AddProductWithName = () => {
  const  formRef = useRef<FormInstance<any>>(null);
  const {isWaitingForAddOrder , errorMessage } = useSelector((state : any)=>state.product)
  const dispatch : DispatchInterface = useDispatch()
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [isFormError, setIsFormError] = useState(false);
  
  const {token} = useSelector((state : any)=>state.auth)

  const [form] = Form.useForm();
  
  // handle backend duplicate error 
 
  useEffect(()=>{
    if(!productName || productName === '') return 
    dispatch(productActions.resetError())
  } ,[productName])  
  useEffect(() => {
    if (productQuantity === "" || productName === "") {
      setIsFormError(true);
      return;
    } else {
      setIsFormError(false);
    }
  }, [productQuantity, productName]);
   const clearForm = ()=>{
    setProductName('')
    setProductQuantity('')
    formRef?.current?.resetFields();
  }
  const  addProductHandler = (e :React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
   
    dispatch(createNewProduct(
      {url : 'product' , clearForm  ,
       toastMessage : 'تم اضافة المنتج بنجاح' ,
       data : {name : productName ,  quantity : productQuantity } , 
       token
      }))
}


  return (
    <Form form={form} layout="vertical" onSubmitCapture={(e)=>addProductHandler(e)} ref={formRef}>
      <Form.Item
        hasFeedback
        name={"name"}
        validateTrigger="onBlur"
        
        label={"اسم المنتج"}
        rules={[{ required: true, message: "اسم المنتج مطلوب" }]}
        required={true}
        tooltip={"  مطلوب"}
      >
        <Input
          size="large"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder={"اسم المنتج"}
          prefix={<FaLuggageCart />}
        />
      </Form.Item>
      <Form.Item
        style={{ direction: "rtl", margin: "8px 0px" }}
        hasFeedback
        label="الكمية"
        validateTrigger="onBlur"
        name="quantity"
        rules={[{ required: true, message: "لابد من ادخال ارقام فقط" }]}
        tooltip={"مطلوب"}
      >
        <InputNumber
          style={{ width: "100%" , margin : '8px 0px' }}
          placeholder="كمية المنتج"
          prefix={<MdFormatListNumberedRtl />}
          size="large"
          onChange={(e) => setProductQuantity(e || "")}
          value={productQuantity}
        />
      </Form.Item>
      {errorMessage ? 
      <h3 style={{textAlign : 'center' , color : 'red'}}>{errorMessage}</h3>
      : 
      null
      }
      <Button
        type="primary"
        disabled={isFormError}
        htmlType="submit"
        loading={isWaitingForAddOrder}
        style={{ width: "100%", marginTop: "1rem" }}
      >
        إضافة المنتج
      </Button>
    </Form>
  );
};
export default AddProductWithName;
