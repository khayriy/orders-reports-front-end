/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useField } from "formik";

interface InputInterface {
  name: string;
  Icon: React.ReactNode;
  label: string;
  placeholder: string;
  required?: boolean;
  options : {
    value : string , 
    label : string
  }[] , 
  validation :  {
    validator({ field }: any, value: string): Promise<void>;
} 

}
const CustomSelect = ({
  required = true,
  placeholder,
  options , 
  label,
  name , 
  validation
}: InputInterface) => {
  

  const [field,meta] = useField(name)
  return (
    <>
      <Form.Item
        style={{ direction: "rtl", margin: "25px 0px" }}
        hasFeedback
        label={label}
        {...meta}
        {...field}
        validateTrigger="onBlur"
       
        rules={!required && meta.value ==='' ? [] : [validation]}
        required={required}
        tooltip={
          required
            ? "  مطلوب"
            : { title: "إختياري", icon: <InfoCircleOutlined /> }
        }
      >
        <Select
          size='large'
          
          showSearch
          allowClear
          placeholder={placeholder}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={options}
        />
      </Form.Item>
    </>
  );
};
export default CustomSelect;