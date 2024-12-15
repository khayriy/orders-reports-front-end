/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInstance ,  Col, Row, Button, FloatButton, Form, DatePicker } from "antd";
import CustomInput from "../CustomInput/CustomInput";
import { Formik } from "formik";
import addOrderSchema, { yupSync } from "../../validationSchema/AddOrderSchema";
import { AiOutlineUser, AiOutlinePhone, AiOutlinePound } from "react-icons/ai";
import ProductInput from "../ProductInput/ProductInput";
import type { DatePickerProps } from 'antd';
import { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import countryptions from "../../data/countryData";
import CustomVarSelectFormik from "../CustomVarSelectFormik/CustomVarSelectFormik";
import CustomInputNumberFormik from "../CustomInputNumberFormik/CustomInputNumberFormik";
import MainContainer from "../../Containers/MainContainer/MainContainer";
import { getAllProducts } from "../../store/productSlice/productSlice";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import { getAllShips } from "../../store/shipSlice/shipSlice";
import { createNewOrder } from "../../store/orderSlice/orderSlice";

const AddNewOrder = () => {
  
  const  formRef = useRef<FormInstance<any>>(null);
  const [isFormValid , setIsFormValid] = useState(false)
  const [isFormSubmit , setIsFormSubmit] = useState(false)
  
  const [schedule , setSchedule] = useState('')
  
  const dispatch : DispatchInterface = useDispatch()
  const {  productsDB   } = useSelector((state : any)=>state.product)
  const {isWaitingForAddOrder} = useSelector(( state : any)=>state.order)
  useEffect(()=>{
    dispatch(getAllProducts({url : 'product' , token}))
} , [dispatch , isFormSubmit])
const {  ships  } = useSelector((state : any)=>state.ship)

const [formattedProducts , setFormattedProducts] : any = useState([])
const [formattedShips , setFormattedShips] = useState([])
useEffect(()=>{
  dispatch(getAllShips({url : 'ship' , token}))
} , [ dispatch])

const {token} = useSelector((state : any)=>state.auth)
useEffect(()=>{
  if(!ships || ships.length ===0) return 
  const data = ships? ships.map(({ _id , name} : any)=>{
    return {value : _id , label : name}
  }) : []
  setFormattedShips(data)
} , [ships])

useEffect(()=>{
if(!productsDB || productsDB.length < 0) return 
const cloneProduct = productsDB && productsDB.length > 0 ? 
productsDB.map(({_id , type , name , quantity} : any)=>{
  if(type.length === 0) {
    if(quantity === 0 || quantity === '0') {
      return {value : _id , label : `${name}  متاح "${quantity}"` , disabled : true}
    } else {
      return {value : _id , label : `${name}  متاح "${quantity}"` , disabled : false}
    }
    
  }
  else {
    
    return {value : _id , label : name , children : type.map(({_id , name , quantity} : any)=>{
      if(quantity === 0 || quantity === '0') {
        
        return {value : _id , label : `${name}  متاح "${quantity}"` , disabled : true}
      }
      else {
        return {value : _id , label : `${name}  متاح "${quantity}"` , disabled : false}
      }
    })}
  }
}) : []

setFormattedProducts(cloneProduct)
} , [productsDB])

const [products, setProducts] = useState<any[]>([
    { value: [''], quantity: 1, id: 0 },
  ]);
const addProductInput = () => {
    setProducts((state) => {
      const lastId = state.at(-1);
      if (!lastId) return [{ value: [''], quantity: 1, id: 0 }];
      else {
        return [
          ...state,
          { value: [''] ,  quantity: 1, id: Number(lastId.id) + 1  },
        ];
      }
    });
  };
  

const deleteProduct = (ind: number) => {
    const newArray = [...products];
    const filteredOne = newArray.filter((e) => e.id !== ind);
    setProducts(filteredOne);
  };
  
useEffect(() => {
    if (!formattedProducts || formattedProducts.length === 0 || products.length === 0) return;
    const clone = formattedProducts.map((e : any) => {
      if (e.children) {
        return {
          ...e,
          children: e.children.map((type : any) => ({
            ...type,
            disabled: products.some((pro) => pro.value && pro.value.length === 2 && pro.value[1] === type.value),
          })),
        };
      } else {
        return {
          ...e,
          disabled: products.some((pro) => pro.value && (pro.value[0] === e.value || pro.value[1] === e.value)),
        };
      }
    });
  
    setFormattedProducts(clone);
  }, [products]);
    
// validate products
 useEffect(()=>{
  if(products[0].value === '') return 
  const isTrue =  products.some((e)=> e.value && e.value[0] !== '')
  if(isTrue) {
    setIsFormValid(true)
  }
  else {
    setIsFormValid(false)
  }
 } , [products]) 

 
 const scheduleHandler: DatePickerProps['onChange'] = (_, dateString) => {
  
  if(dateString && dateString.length !==0) {
    const [year , month , day] = dateString.split("-");

    // Create a new Date object with the components in the correct order
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    setSchedule(isoDate.toISOString())
    console.log(isoDate.toISOString());
  }
 

};

  return (
    <MainContainer title="اضافة طلب جديد" >
      <Formik   
        initialValues={{
          name: "",
          phone: "",
          phoneT: "",
          address: "",
          city: [null],
          details: "",
          price: "",
          ship: [null],
        }}
        onSubmit={(values , helpers) => {
          
          const chosenProducts = products.filter((e)=>e.value[0] !== '')
          const formattedChosen = chosenProducts.map((e)=>{
            if(e.value.length === 2) {
              return {product : e.value[0] , type : e.value[1] , quantity : e.quantity}
            }
            else {
              return {product : e.value[0] , quantity : e.quantity}
            }
          })
          
         const data =  {
            shipId : values.ship ? values.ship[0] : "" ,
            address : values.address , 
            notes : values.details , 
            country : values.city && values.city.length !==0  ? values.city.toString() : "", 
            price : values.price , 
            name : values.name , 
            phone : values.phone , 
            anotherPhone : values.phoneT , 
            products : formattedChosen ,
            createdAt : schedule
             }

          dispatch(createNewOrder(
            {url : 'order' , token  , clearForm : ()=> {
              helpers.resetForm()

              setProducts(()=>{
                return [{ value: [''], quantity: 1, id: 0 }]
              } )
              formRef?.current?.resetFields();
              setIsFormSubmit((e)=>{
                return !e
              })
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }  ,
             toastMessage : 'تم اضافة الطلب بنجاح' ,
             data : data
            }))

        }}
        validationSchema={addOrderSchema}
      >
        {({ handleSubmit , isValid  }) => {
          return (
            <Form onSubmitCapture={handleSubmit} layout="vertical" ref={formRef}>
              <CustomInput
                Icon={<AiOutlineUser />}
                label="الاسم"
                name="name"
                placeholder="اسم العميل"
                validation={yupSync}
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                label="الهاتف"
                name="phone"
                placeholder="رقم الهاتف"
                validation={yupSync}
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                required={false}
                label="هاتف بديل"
                name="phoneT"
                placeholder="رقم هاتف بديل"
                validation={yupSync}
              />
              {products.map((e, index) => {
                return (
                  <ProductInput
options={formattedProducts}
                  label="الاسم الفرعي"
                  placeholder="اكتب اسم النوع الداخلي"
                  Icon={<AiOutlinePhone />}
                  setProducts={setProducts}
                  product={e}
                  id={e.id}
                  isFirst={index === 0 && products.length === 1}
                  key={index}
                  products={products}
                  deleteProductInput={deleteProduct}
                  />
                );
              })}
              <Row justify="space-between">
                <Col>
                  {products.length < 60 ? (
                    <FloatButton
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addProductInput}
                      style={{
                        position: "relative",
                        top: "0px",
                        right: "10px",
                      }}
                      tooltip={<div>اصافة منتج</div>}
                    />
                  ) : null}
                </Col>
              </Row>
              <CustomVarSelectFormik
                placeholder="اختر المحافظة والمركز"
                label="المحافظة/المركز"
                options={countryptions}
                name="city"
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                isTextArea={true}
                label="العنوان التفصيلي"
                placeholder="قم بكتابة العنوان التفصيلي "
                name="address"
                validation={yupSync}
              />
              <CustomVarSelectFormik
                options={formattedShips}
                label="مسئول الشحن"
                placeholder="قم باختيار مسئول الشحن"
                name="ship"
              />
              <CustomInputNumberFormik
                Icon={<AiOutlinePound />}
                label="سعر الطلب"
                placeholder="ادحل اجمال السعر"
                name="price"
                validation={yupSync}
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                isTextArea={true}
                label="ملاجظات"
                placeholder="ملاحظات لمسئول الشحن"
                name="details"
                required={false}
                validation={yupSync}
              />
              <DatePicker onChange={scheduleHandler} />
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", marginTop: "1rem" }}
                disabled={!isValid || !isFormValid || isWaitingForAddOrder}
                loading={isWaitingForAddOrder}
              >
                سجل الطلب
              </Button>
            </Form>
          );
        }}
      </Formik>
    </MainContainer>
  );
};

export default AddNewOrder;
