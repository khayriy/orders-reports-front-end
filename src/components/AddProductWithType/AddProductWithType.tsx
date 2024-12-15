/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Button, Row, Col, FloatButton, Input, FormInstance } from "antd";
import { useEffect, useRef, useState } from "react";
import ProductInput from "../ProductInput/ProductInput";
import { AiOutlinePhone } from "react-icons/ai";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct, productActions } from "../../store/productSlice/productSlice";
import DispatchInterface from "../../types/DispatchInterface";

const AddProductWithType = () => {
  
  const {isWaitingForAddOrder , errorMessage } = useSelector((state : any)=>state.product)
  const [products, setProducts] = useState<any[]>([
    { name: "", quantity: 1, id: 0 },
  ]);
  const [productName, setProductName] = useState("");
  const [isFormError, setIsFormError] = useState(false);

  const {token} = useSelector((state : any)=>state.auth)

  const dispatch : DispatchInterface = useDispatch()
  const addProductInput = () => {
    setProducts((state) => {
      const lastId = state.at(-1);
      if (!lastId) return [{ product: "", quantity: 1, id: 0 }];
      else {
        return [
          ...state,
          { product: "", quantity: 1, id: Number(lastId.id) + 1 },
        ];
      }
    });
  };
 
  const  formRef = useRef<FormInstance<any>>(null);

  useEffect(()=>{
    if(!productName || productName === '') return 
    dispatch(productActions.resetError())
  } ,[productName])
 useEffect(() => {
    products.map((e) => {
      if (e.name === "" || productName === "") return setIsFormError(true);
      if (e.quantity < 0 || productName === "") return setIsFormError(true);
      else return setIsFormError(false);
    });
  }, [products, productName]);

  const deleteProduct = (ind: number) => {
    const newArray = [...products];
    const filteredOne = newArray.filter((e) => e.id !== ind);

    setProducts(filteredOne);
  };
  const clearForm = ()=>{
    setProductName('')
    setProducts([{ name: "", quantity: 1, id: 0 }])
    formRef?.current?.resetFields();
  }
  const  addProductHandler = (e :React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      const formattedProducts = products?.map(({name , quantity})=>{
          return {name , quantity : Number(quantity)}
      })    
      dispatch(createNewProduct(
        {url : 'product' , clearForm  ,
         toastMessage : 'تم اضافة المنتج بنجاح' ,
         data : {name : productName ,  type : formattedProducts } , 
         token
        }))
  }
 
  return (
    <Form layout="vertical" onSubmitCapture={(e)=>addProductHandler(e)} ref={formRef}>
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
          allowClear={true}
          onChange={(e) => setProductName(e.target.value)}
          placeholder={"اسم المنتج"}
          prefix={<AiOutlinePhone />}
        />
      </Form.Item>
      {products.map((e, index) => {
        return (
          <ProductInput
            label="الاسم الفرعي"
            placeholder="اكتب اسم النوع الداخلي"
            Icon={<AiOutlinePhone />}
            setProducts={setProducts}
            product={e}
            id={e.id}
            isFirst={index === 0 && products.length === 1}
            key={index}
            isText={true}
            products={products}
            deleteProductInput={deleteProduct}
          />
        );
      })}
      <Row justify="space-between">
        <Col>
          {products.length < 10 ? (
            <FloatButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={addProductInput}
              style={{
                position: "relative",
                top: "0px",
                right: "10px",
                marginTop: "20px",
              }}
              tooltip={<div>اصافة منتج</div>}
            />
          ) : null}
        </Col>
      </Row>
      {errorMessage ? 
      <h3 style={{textAlign : 'center' , color : 'red'}}>{errorMessage}</h3>
      : 
      null
      }
      <Button
        type="primary"
        loading={isWaitingForAddOrder}
        disabled={isFormError}
        htmlType="submit"
        style={{ width: "100%", marginTop: "1rem" }}
      >
        إضافة المنتج
      </Button>
    </Form>
  );
};

export default AddProductWithType;
