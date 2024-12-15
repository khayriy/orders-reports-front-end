/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segmented } from "antd";

import MainContainer from "../../Containers/MainContainer/MainContainer";

import { useState } from "react";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import AddProductWithType from "../AddProductWithType/AddProductWithType";
import AddProductWithName from "../AddProductWithName/AddProductWithName";

const AddNewProduct = () => {
  const [isHaveType, setIsHaveType] = useState(false);
 
  return (
    <>
      <MainContainer title="اضافة منتج جديد">
       
        <Segmented
          style={{ marginBottom: "20px" }}
          onChange={(value) => {
            if (value === "without") setIsHaveType(false);
            if (value === "with") setIsHaveType(true);
          }}
          options={[
            {
              label: "منتج لا يحتوي علي أنواع داخلية",
              value: "without",
              icon: <BarsOutlined />,
            },
            {
              label: "منتج يحتوي علي انواع داخلية",
              value: "with",
              icon: <AppstoreOutlined />,
            },
          ]}
        />
        {!isHaveType ? <AddProductWithName /> : <AddProductWithType />}
      </MainContainer>
    </>
  );
};

export default AddNewProduct;
