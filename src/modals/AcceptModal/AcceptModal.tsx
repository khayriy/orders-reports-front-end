/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, InputNumber, Modal } from "antd";
import ProductInput from "../../components/ProductInput/ProductInput";
import { AiOutlinePhone } from "react-icons/ai";
import { DollarOutlined } from "@ant-design/icons";
import { useState } from "react";
import TextArea from "antd/lib/input/TextArea";
interface AcceptModalInterface {
  products: any;
  isModalOpen: boolean;
  handleCancel: any;
  handleOk: any;
  deleteProduct: any;
  setProducts: any;
  formattedProducts: any;
  price : any , 
  setPrice : any , 
  details : any , 
  setDetails : any
}
const AcceptModal = ({
  formattedProducts,
  products,
  deleteProduct,
  setProducts,
  isModalOpen,
  handleCancel,
  handleOk,
  price  , 
  setPrice , 
  details , 
  setDetails 
}: AcceptModalInterface) => {
  
  const [error, setError] = useState("");
  const reg = /^[0-9]*$/;
  const changeQuantity = (e: any) => {
    if (!reg.test(e)) {
      setError("لابد من ادخال ارقام فقط");
      return;
    } else {
      setError("");
      setPrice(e);
    }
  };
  return (
    <>
      <Modal
        title="تسليم جزئي"
        open={isModalOpen}
        width={1000}
        onOk={handleOk}
        footer={[
          <div style={{ marginTop: "40px" }}>
            <Button onClick={handleCancel}> غلق </Button>,
            <Button type="primary" onClick={handleOk}>
              تاكيد الاستلام الجزئي
            </Button>
          </div>,
        ]}
      >
        <Form layout="vertical">
          {products.map((e: any, index: number) => {
            return (
              <ProductInput
                isProductDisable={true}
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

          <Form.Item
            style={{ direction: "rtl", margin: "8px 0px" }}
            hasFeedback
            label="السعر الجديد"
            validateStatus={error ? "error" : ""}
            help={error}
            tooltip={"مطلوب"}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder={"ادحال السعر الجديد بعد التسليم"}
              prefix={<DollarOutlined />}
              size="large"
              onChange={(e) => changeQuantity(e)}
              value={price}
            />
          </Form.Item>
          <Form.Item
            style={{ direction: "rtl", width: "100%" }}
            label={"ملاحظات التسليم الجزئي"}
          >
            <TextArea
              size="large"
              rows={2}
              placeholder={"بعض ملاحظات التسليم الجزئي"}
              value={details} 
              onChange={(e)=> setDetails(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AcceptModal;
