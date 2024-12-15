/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, FloatButton, Form, FormInstance, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import CustomInput from "../CustomInput/CustomInput";
import { AiOutlinePhone, AiOutlinePound, AiOutlineUser } from "react-icons/ai";
import { Formik } from "formik";
import addOrderSchema, { yupSync } from "../../validationSchema/AddOrderSchema";
import { PlusOutlined } from "@ant-design/icons";
import CustomVarSelectFormik from "../CustomVarSelectFormik/CustomVarSelectFormik";
import countryptions from "../../data/countryData";
import CustomInputNumberFormik from "../CustomInputNumberFormik/CustomInputNumberFormik";
import ProductInput from "../ProductInput/ProductInput";
import { getAllProducts } from "../../store/productSlice/productSlice";
import { getAllShips } from "../../store/shipSlice/shipSlice";
import statusData, { statusPendingData } from "../../data/statusData";
import { updateOrderProducts } from "../../store/orderSlice/orderSlice";
import AcceptModal from "../../modals/AcceptModal/AcceptModal";

interface ExpandrecordListInterface {
  record: any;
}
const ExpandPendingOrders = ({ record }: ExpandrecordListInterface) => {
  // state and function to manage open update modal in case تسليم جزئي
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };

  const {token} = useSelector((state : any)=>state.auth)
  const handleUpdateDeliver = () => {
    const chosenProducts = products.filter((e: any) => e.value[0] !== "");
    const formattedChosen = chosenProducts.map((e: any) => {
      if (e.value.length === 2) {
        return {
          product: e.value[0],
          type: e.value[1],
          quantity: e.quantity,
        };
      } else {
        return { product: e.value[0], quantity: e.quantity };
      }
    });

    if (details !== "" && details) {
      dispatch(
        updateOrderProducts({
          url: `order/status/${record._id}`,
          toastMessage: "تم توصيل الطلب بنجاح",
          data: {
            acceptedProducts: formattedChosen,
            status: "تسليم جزئي",
            notes: details,
            price: price,
          },
          clear: () => {
            setIsFormSubmit((e) => !e);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsModalOpen(false);
          },
          token
        })
      );
    } else {
      dispatch(
        updateOrderProducts({
          url: `order/status/${record._id}`,
          toastMessage: "تم توصيل الطلب بنجاح",
          data: {
            acceptedProducts: formattedChosen,
            status: "تسليم جزئي",
            price: price,
          },
          clear: () => {
            setIsFormSubmit((e) => !e);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsModalOpen(false);
          },
          token
        })
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // product ids to disable to choose it again
  const [isFormSubmit, setIsFormSubmit] = useState(false);

  const { isWaitingForUpdateOrder } = useSelector((state: any) => state.order);
  const productIds = record.products.map((e: any) => {
    if (!e.product?.type || e.product?.type === "") return e.product?._id;
  });
  const typesIds = record.products.map((e: any) => {
    if (e.product && e.product?.type && e.product?.type !== "")
      return e.product.type._id;
  });

  const [products, setProducts] = useState(
    record.products.map((e: any, index: number) => {
      if (e.product.type && e.product.type !== "") {
        return {
          value: [e.product._id, e.product.type._id],
          quantity: e.product.quantity,
          id: index,
        };
      } else {
        return {
          value: [e.product._id],
          quantity: e.product.quantity,
          id: index,
        };
      }
    })
  );
  const { productsDB } = useSelector((state: any) => state.product);
  const dispatch: DispatchInterface = useDispatch();
  const { ships } = useSelector((state: any) => state.ship);

  const [formattedShips, setFormattedShips] = useState([]);

  const deleteProduct = (ind: number) => {
    const newArray = [...products];
    const filteredOne = newArray.filter((e) => e.id !== ind);
    setProducts(filteredOne);
  };

  const addProductInput = () => {
    setProducts((state: any) => {
      const lastId = state.at(-1);
      if (!lastId) return [{ value: [""], quantity: 1, id: 0 }];
      else {
        return [
          ...state,
          { value: [""], quantity: 1, id: Number(lastId.id) + 1 },
        ];
      }
    });
  };

  useEffect(() => {
    if (!ships || ships.length === 0) return;
    const data = ships
      ? ships.map(({ _id, name }: any) => {
          return { value: _id, label: name };
        })
      : [];
    setFormattedShips(data);
  }, [ships]);
  /// get ships and products and getProducts after update to display the new quantity
  useEffect(() => {
    dispatch(getAllShips({ url: "ship" , token}));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllProducts({ url: "product" , token }));
  }, [dispatch, isFormSubmit]);

  const [formattedProducts, setFormattedProducts]: any = useState([]);
  const formRef = useRef<FormInstance<any>>(null);

  useEffect(() => {
    if (!productsDB || productsDB.length < 0) return;
    const cloneProduct =
      productsDB && productsDB.length > 0
        ? productsDB.map(({ _id, type, name, quantity }: any) => {
            if (type.length === 0) {
              if (
                quantity === 0 ||
                quantity === "0" ||
                productIds.includes(_id)
              ) {
                return {
                  value: _id,
                  label: `${name}  متاح "${quantity}"`,
                  disabled: true,
                };
              } else {
                return {
                  value: _id,
                  label: `${name}  متاح "${quantity}"`,
                  disabled: false,
                };
              }
            } else {
              return {
                value: _id,
                label: name,
                children: type.map(({ _id, name, quantity }: any) => {
                  if (
                    quantity === 0 ||
                    quantity === "0" ||
                    typesIds.includes(_id)
                  ) {
                    return {
                      value: _id,
                      label: `${name}  متاح "${quantity}"`,
                      disabled: true,
                    };
                  } else {
                    return {
                      value: _id,
                      label: `${name}  متاح "${quantity}"`,
                      disabled: false,
                    };
                  }
                }),
              };
            }
          })
        : [];

    setFormattedProducts(cloneProduct);
  }, [productsDB]);



  
  return (
    <>
      <AcceptModal
        details={details}
        setDetails={setDetails}
        price={price}
        setPrice={setPrice}
        formattedProducts={formattedProducts}
        setProducts={setProducts}
        deleteProduct={deleteProduct}
        products={products}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleUpdateDeliver}
      />
      <Formik
        initialValues={{
          name: record.name,
          phone: record.phone,
          phoneT: record.anotherPhone,
          address: record.address,
          city: [record.country.split(",")],
          details: record.notes,
          price: record.price,
          ship: [record.ship._id],
          status: [record.status],
        }}
        onSubmit={(values) => {
          const chosenProducts = products.filter((e: any) => e.value[0] !== "");
          const formattedChosen = chosenProducts.map((e: any) => {
            if (e.value.length === 2) {
              return {
                product: e.value[0],
                type: e.value[1],
                quantity: e.quantity,
              };
            } else {
              return { product: e.value[0], quantity: e.quantity };
            }
          });
          if (values.status[0] === "تسليم جزئي") {
            showModal();
            return;
          }
          if (record.status !== "معلق") {
            dispatch(
              updateOrderProducts({
                url: `order/status/${record._id}`,
                toastMessage: "تم تعديل الطلب بنجاح",
                data: {
                  status: values.status ? values.status[0] : "",
                },
                clear: () => {
                  setIsFormSubmit((e) => !e);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                },
                token
              })
            );
          } else {
            dispatch(
              updateOrderProducts({
                url: `order/order/${record._id}`,
                toastMessage: "تم تعديل الطلب بنجاح",
                data: {
                  shipId: values.ship ? values.ship[0] : "",
                  address: values.address,
                  notes: values.details,
                  country:
                    values.city && values.city.length !== 0
                      ? values.city.toString()
                      : "",
                  price: values.price,
                  name: values.name,
                  phone: values.phone,
                  anotherPhone: values.phoneT,
                  products: formattedChosen,
                  status: values.status ? values.status[0] : ""
                  
                },
                clear: () => {
                  setIsFormSubmit((e) => !e);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                },
                token 
              })
            );
          }
        }}
        validationSchema={addOrderSchema}
      >
        {({ handleSubmit }) => {
          return (
            <Form
              onSubmitCapture={handleSubmit}
              layout="vertical"
              ref={formRef}
            >
              <CustomInput
                Icon={<AiOutlineUser />}
                label="الاسم"
                name="name"
                placeholder="اسم العميل"
                validation={yupSync}
                isReadOnly={record.status === "قيد التشغيل"}
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                label="الهاتف"
                name="phone"
                placeholder="رقم الهاتف"
                validation={yupSync}
                isReadOnly={record.status === "قيد التشغيل"}
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                required={false}
                label="هاتف بديل"
                name="phoneT"
                placeholder="رقم هاتف بديل"
                validation={yupSync}
                isReadOnly={record.status === "قيد التشغيل"}
              />
              {products.map((e: any, index: number) => {
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
                    isReadOnly={record.status === "قيد التشغيل"}
                    products={products}
                    deleteProductInput={deleteProduct}
                  />
                );
              })}
              {record.status === "معلق" ? (
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
                        }}
                        tooltip={<div>اصافة منتج</div>}
                      />
                    ) : null}
                  </Col>
                </Row>
              ) : null}

              <CustomVarSelectFormik
                placeholder="اختر المحافظة والمركز"
                label="المحافظة/المركز"
                options={countryptions}
                name="city"
                isReadOnly={record.status === "قيد التشغيل"}
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                isTextArea={true}
                label="العنوان التفصيلي"
                placeholder="قم بكتابة العنوان التفصيلي "
                name="address"
                validation={yupSync}
                isReadOnly={record.status === "قيد التشغيل"}
              />
              <CustomVarSelectFormik
                options={formattedShips}
                label="مسئول الشحن"
                placeholder="قم باختيار مسئول الشحن"
                name="ship"
                isReadOnly={record.status === "قيد التشغيل"}
              />
              <CustomInputNumberFormik
                Icon={<AiOutlinePound />}
                label="سعر الطلب"
                placeholder="ادحل اجمال السعر"
                name="price"
                validation={yupSync}
                isReadOnly={record.status === "قيد التشغيل"}
              />
              <CustomInput
                Icon={<AiOutlinePhone />}
                isTextArea={true}
                label="ملاجظات"
                placeholder="ملاحظات لمسئول الشحن"
                name="details"
                required={false}
                validation={yupSync}
                isReadOnly={record.status === "قيد التشغيل"}
              />
              <CustomVarSelectFormik
                placeholder="الحالة"
                label="الحالة"
                options={
                  record.status === "قيد التشغيل"
                    ? statusData
                    : statusPendingData
                }
                name="status"
              />
            
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", marginTop: "1rem" }}
                loading={isWaitingForUpdateOrder}
                disabled={isWaitingForUpdateOrder}
              >
                تعديل الطلب
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
export default ExpandPendingOrders;
