/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, FloatButton, Row, Form, Input } from "antd";
import CustomInputNumber from "../CustomInputNumber/CustomInputNumber";
import { MdFormatListNumberedRtl } from "react-icons/md";
import {  MinusOutlined } from "@ant-design/icons";
import CustomVarSelect from "../CustomVarSelect/CustomVarSelect";

interface ProductInputInterface {
  isFirst: boolean;
  deleteProductInput?: any;
  id: number;
  setProducts: any;
  products: any;
  isText?: boolean;
  placeholder?: string;
  Icon?: React.ReactNode;
  label?: string;
  product: any;
  options?: any;
  isReadOnly? :  boolean , 
  isProductDisable? : boolean
}

const ProductInput = ({
  isText,
  id,
  isFirst,
  deleteProductInput,
  setProducts,
  products,
  placeholder,
  Icon,
  label,
  product,
  options,
  isReadOnly , 
  isProductDisable
}: ProductInputInterface) => {
  const addProduct = (value: any) => {
    const newProducts = [...products];
    const filtered = newProducts.findIndex((e) => e.id === id);

    newProducts[filtered] = { ...newProducts[filtered], name: value };

    setProducts(newProducts);
  };
  return (
    <Row
      style={{
        justifyContent: "space-between",
        position: "relative",
        alignItems: "center",
      }}
    >
      <Col span={16}>
        {isText ? (
          <Form.Item
            style={{ direction: "rtl", margin: "15px 0px" }}
            hasFeedback
            validateTrigger="onBlur"
            label={label}
            name={id}
            rules={[
              { required: true, message: "لايد من ادخال اسم النوع" },
              { min: 3, message: "الاسم قصير للغاية" },
            ]}
            tooltip={"مطلوب"}
          >
            <Input
              size="large"
              value={product.value}
              placeholder={placeholder}
              prefix={Icon}
              onChange={(e) => addProduct(e.target.value)}

            />
          </Form.Item>
        ) : (
          <CustomVarSelect
            placeholder="اختر المنتج"
            label="المنتج"
            options={options}
            value={product.value}
            id={id}
            setProducts={setProducts}
            products={products}
            isReadOnly={isReadOnly}
            isProductDisable={isProductDisable}
          />
        )}
      </Col>
      <Col span={6}>
        <CustomInputNumber
          Icon={<MdFormatListNumberedRtl />}
          label="الكمية"
          placeholder="الكمية"
          setProducts={setProducts}
          products={products}
          id={id}
          isReadOnly={isReadOnly}
          product={product}
        />
      </Col>
      {!isFirst  ? (
        <FloatButton
          onClick={deleteProductInput ? () => deleteProductInput(id) : () => {}}
          type="primary"
          icon={<MinusOutlined />}
          style={{
            position: "relative",
            top: "12px",
            left: "5px",
          }}
          tooltip={<div>طرح منتج</div>}
        />
        //<MinusCircleOutlined onClick={deleteProductInput ? () => deleteProductInput(id) : () => {}} />
      ) : null}
    </Row>
  );
};
export default ProductInput;
