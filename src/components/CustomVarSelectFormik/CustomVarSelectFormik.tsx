/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cascader, Divider, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { yupSync } from "../../validationSchema/AddOrderSchema";
import { useField } from "formik";


interface InputInterface {
  
  options :  any[] ,
  label: string;
  placeholder: string;
  required?: boolean;
  isReadOnly? :boolean ; 
  name : string 
}
const CustomVarSelectFormik = ({
  required = true,
  placeholder,
  label,
  options , 
  isReadOnly , 
   name   
}: InputInterface) => {
  const [field, meta , helpers] = useField(name);
    const dropdownRender = (menus: React.ReactNode) => (
        <div >
          {menus}
          <Divider style={{ margin: 0 }} />
        
        </div>
      );

    
  return (
    <>
      <Form.Item
        style={{ direction: "rtl", margin: "25px 0px" }}
        hasFeedback
        label={label}
        validateTrigger="onBlur"
        {...field}
        {...meta}
        rules={[yupSync]}
        required={required}
        tooltip={
          required
            ? "  مطلوب"
            : { title: "إختياري", icon: <InfoCircleOutlined /> }
        }
      >
        <Cascader 
        showSearch
        style={{width : '100%'}} size="large" options={options} dropdownRender={dropdownRender}
         placeholder={placeholder} 
         onChange={(e)=> helpers.setValue(e)}
         disabled={isReadOnly}
         />
      </Form.Item>
    </>
  );
};
export default CustomVarSelectFormik;