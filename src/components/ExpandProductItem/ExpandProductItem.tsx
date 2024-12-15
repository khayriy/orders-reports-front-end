/* eslint-disable @typescript-eslint/no-explicit-any */
import { FloatButton, Form, FormInstance, Input, InputNumber, List } from "antd";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import ClearForm from "../../helpers/ClearForm/ClearForm";
import DispatchInterface from "../../types/DispatchInterface";
import { updateProductType } from "../../store/productSlice/productSlice";

interface ExpandProps {
  type : any ,
  confirmDelete? : any , 
  productId : any
}
const ExpandProductItem = ({type  , productId} : ExpandProps) => {
  
  const  formRef = useRef<FormInstance<any>>(null);
  const [typeName , setTypeName] = useState(type.name)
  const [addedQuantity , setAddedQuantity] = useState('')
  const [isUpdateOpen , setIsUpdateOpen] = useState(false)

 
  const dispatch: DispatchInterface = useDispatch();
  
  
  const {token} = useSelector((state: any)=> state.auth)

  useEffect(()=>{
       if(typeName !== type.name || addedQuantity !=='' || Number(addedQuantity) !==0) {
        setIsUpdateOpen(true)
       }
       else {
        setIsUpdateOpen(false)
       }
       if(Number(addedQuantity) + type.quantity < 0) {
        setIsUpdateOpen(false)
       }
  } ,[typeName , addedQuantity , type])


  const changeQuantityHandler = (e : string | null)=>{
    if(e!==null) setAddedQuantity(e)
  }

  const updateProductTypeNameOrQuantity = () => {
    
    if(typeName !== type.name) {
      dispatch(
        updateProductType({
          token , 
          data: { name: typeName, quantity: addedQuantity , typeId : type._id },
          url: `product/add/${productId}`,
          toastMessage: "تم تعديل النوع بنجاح",
        })
      );
    }
    else {
      dispatch(
        updateProductType({
          token , 
          data: {  quantity: addedQuantity , typeId : type._id },
          url: `product/add/${productId}`,
          toastMessage: "تم تعديل النوع بنجاح",
        })
      );
    }
    ClearForm(formRef)
    setAddedQuantity('')
  };
  return (
    <List.Item>
      <Form layout="vertical" style={{ display: "flex", gap: "25px" }} ref={formRef}>
        <Form.Item
          hasFeedback
          label="اسم النوع"
          name={"treter"}
          validateTrigger="onBlur"
          rules={[{ required: true, message: "اسم النوع مطلوب"}]}
          tooltip={"  مطلوب"} 
        >
          <Input placeholder="اسم النوع"  onChange={(e)=>setTypeName(e.target.value)} value={typeName} defaultValue={typeName}/>
        </Form.Item>
        <Form.Item hasFeedback label="الكمية المتاحة">
          <InputNumber value={type.quantity} disabled readOnly={true} />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="تزويد الكمية"
          validateTrigger="onChange"
          name="vcvcv "
          rules={[ 
          {
            validator: async () => {
               if(Number(addedQuantity)  === 0) {
                return Promise.reject(new Error('ادخل عدد صالح'));
               }
               if (Number(addedQuantity) + type.quantity < 0) {
                 return Promise.reject(new Error('الكمية غير متاحة'));
               }
            },
          },   
          ]}
        >
          <InputNumber placeholder="الكمية " value={addedQuantity} onChange={(e)=> changeQuantityHandler(e)}/>
        </Form.Item>
        {isUpdateOpen ? 
       <FloatButton
       type="primary"
       onClick={updateProductTypeNameOrQuantity}
       icon={<AiOutlineCheck style={{ color: "white" }} />}
       style={{
         position: "relative",
         top: "0px",
         left: "10px",
         alignSelf: "center",
         boxShadow: "none",
       }}
       tooltip={<div>تأكيد</div>}
     />
      : null
      }
      </Form>
      {/* <div style={{cursor : 'pointer'}}>
         <MdDeleteOutline style={{ fontSize : '20px' }} 
         onClick={()=> DeleteModal(type.name, isWaitingForDeleteProduct ,()=>confirmDelete(type._id))}/>
      </div> */}
    </List.Item>
  );
};
export default ExpandProductItem;