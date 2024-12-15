/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, InputNumber } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import {  useState } from "react";

interface InputInterface {
  Icon: React.ReactNode;
  label: string;
  placeholder: string;
  required?: boolean;
  id: any;
  products: any;
  setProducts: any;
  product: any;
  isReadOnly?: boolean;
}
const CustomInputNumber = ({
  required = true,
  placeholder,
  Icon,
  label,
  id,
  products,
  setProducts,
  product,
  isReadOnly,
}: InputInterface) => {
  const [error, setError] = useState("");
  const reg = /^[0-9]*$/;
  const changeQuantity = (e: any) => {
    if (!reg.test(e)) {
      setError("لابد من ادخال ارقام فقط");
      return;
    } else {
      setError("");
      const newProducts = [...products];
      const isExist = newProducts.findIndex((e) => e.id === id);
      if (isExist === -1) {
        return;
      } else {
        newProducts[isExist] = { ...newProducts[isExist], quantity: e };
        setProducts(newProducts);
      }
    }
  };

  return (
    <>
      <Form.Item
        style={{ direction: "rtl", margin: "8px 0px" }}
        hasFeedback
        label={label}
        validateStatus={error ? "error" : ""}
        help={error}
        tooltip={
          required
            ? "  مطلوب"
            : { title: "إختياري", icon: <InfoCircleOutlined /> }
        }
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder={placeholder}
          prefix={Icon}
          size="large"
          onChange={(e) => changeQuantity(e)}
          value={product.quantity}
          disabled={isReadOnly}
        />
      </Form.Item>
    </>
  );
};
export default CustomInputNumber;
