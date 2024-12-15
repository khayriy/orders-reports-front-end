/* eslint-disable @typescript-eslint/no-explicit-any */
import { FloatButton, Form, Input, InputNumber, List } from "antd";
import ExpandProductItem from "../ExpandProductItem/ExpandProductItem";
import { AiOutlineCheck } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import {
  
  addTypeHandler,
  updateProduct,
} from "../../store/productSlice/productSlice";

import { FormInstance } from "antd";
import ClearForm from "../../helpers/ClearForm/ClearForm";
import { PlusOutlined } from "@ant-design/icons";

interface ExpandProductListInterface {
  product: any;
}
const ExpandProductList = ({ product }: ExpandProductListInterface) => {
  const [addTypeName , setAddTypeName] = useState('')
  const [addTypeQuantity , setAddTypeQuantity] = useState('')
  const [addType , setAddType] = useState(false)
  const formRef = useRef<FormInstance<any>>(null);
  const dispatch: DispatchInterface = useDispatch();
  const [typeName, setTypeName] = useState(product.name);
  const [addedQuantity, setAddedQuantity] = useState("");
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const {token} = useSelector((state : any) =>state.auth)

  useEffect(() => {
    if (
      typeName !== product.name ||
      addedQuantity !== "" ||
      Number(addedQuantity) !== 0
    ) {
      setIsUpdateOpen(true);
    } else {
      setIsUpdateOpen(false);
    }
    if (Number(addedQuantity) + product.quantity < 0) {
      setIsUpdateOpen(false);
    }
  }, [typeName, addedQuantity, product]);

  const changeQuantityHandler = (e: string | null) => {
    if (e !== null) setAddedQuantity(e);
  };


  const updateProductNameOrQuantity = () => {
    setAddedQuantity("");
    ClearForm(formRef);
    dispatch(
      updateProduct({
        data: { name: typeName, totalQuantity: addedQuantity },
        url: `product/${product._id}`,
        toastMessage: "تم تعديل المنتج بنجاح", 
        token
      })
    );
  };


  const addTypeToProducts = () => {
    
    dispatch(
      addTypeHandler({
        data: { typeName: addTypeName, quantity: addTypeQuantity },
        url: `product/addType/${product._id}`,
        toastMessage: "تم اضافة النوع بنجاح", 
        token , 
        clear : ()=>{
          setAddType(false) 
          setAddTypeName("") 
          setAddTypeQuantity("")
        }
      })
    );

   
  };
  return (
    <>
      <Form
        ref={formRef}
        layout="vertical"
        style={{ display: "flex", justifyContent: "flex-start", gap: "20px" }}
      >
        <Form.Item
          hasFeedback
          label="اسم المنتج"
          name={"treter"}
          validateTrigger="onBlur"
          rules={[{ required: true, message: "اسم النوع مطلوب" }]}
          tooltip={"  مطلوب"}
        >
          <Input
            placeholder="اسم النوع"
            onChange={(e) => setTypeName(e.target.value)}
            value={typeName}
            defaultValue={typeName}
          />
        </Form.Item>

        <Form.Item hasFeedback label="الكمية المتاحة">
          <InputNumber value={product.quantity} disabled readOnly={true} />
        </Form.Item>

        {product.type.length === 0 ? (
          <>
            <Form.Item
              hasFeedback
              label="تزويد الكمية"
              validateTrigger="onChange"
              name="vcvcv "
              rules={[
                {
                  validator: async () => {
                    if (Number(addedQuantity) === 0) {
                      return Promise.reject(new Error("ادخل عدد صالح"));
                    }
                    if (Number(addedQuantity) + product.quantity < 0) {
                      return Promise.reject(new Error("الكمية غير متاحة"));
                    }
                  },
                },
              ]}
            >
              <InputNumber
                placeholder="الكمية "
                value={addedQuantity}
                onChange={(e) => changeQuantityHandler(e)}
              />
            </Form.Item>
            {isUpdateOpen ? (
              <FloatButton
                type="primary"
                onClick={updateProductNameOrQuantity}
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
            ) : null}
          </>
        ) : null}
      </Form>
      {product.type.length > 0 ? (
        <>
          <h3>الانواع الداخلية</h3>
          <List
            bordered
            dataSource={product.type}
            renderItem={(e, index) => (
              <ExpandProductItem
                // confirmDelete={confirmDelete}
                key={index}
                type={e}
                productId={product._id}
              />
            )}
          />
          {addType &&  
           <List  bordered>
              <List.Item>
      <Form layout="vertical" style={{ display: "flex", gap: "25px" }} onSubmitCapture={addTypeToProducts}>
        <Form.Item
          hasFeedback
          label="اسم النوع"
          name={"treter"}
          validateTrigger="onBlur"
          rules={[{ required: true, message: "اسم النوع مطلوب"}]}
          tooltip={"  مطلوب"} 
        >
          <Input value={addTypeName} onChange={(e)=>setAddTypeName(e.target.value)} placeholder="اسم النوع"  />
        </Form.Item>
       
        <Form.Item
          hasFeedback
          label=" الكمية"
          validateTrigger="onChange"
          name="vcvcv "
          rules={[{ required: true, message: "الكمية مطلوبة"} , {type : 'number' , message : 'لابد من ان يكون رقم' }]}
        >
          <InputNumber value={addTypeQuantity} onChange={(e)=>setAddTypeQuantity(e||'')} placeholder="الكمية "/>
        </Form.Item>
       {addTypeName && addTypeQuantity ?
       <FloatButton
       type="primary"

       onClick={addTypeToProducts}
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
     : null }
      </Form>
    
    </List.Item>
    </List>
    }
          <FloatButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={()=>setAddType((e)=> !e)}
              style={{
                position: "relative",
                top: "0px",
                right: "10px",
                marginTop: "20px",
              }}
              tooltip={<div>اصافة منتج</div>}
            />
        </>
      ) : null}
    </>
  );
};
export default ExpandProductList;
