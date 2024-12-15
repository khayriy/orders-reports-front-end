/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, InputNumber } from "antd";
import { useField } from "formik";

import { InfoCircleOutlined } from "@ant-design/icons";

interface InputInterface {
  name: string;
  Icon?: React.ReactNode;
  label: string;
  placeholder: string;
  required?: boolean;
  isTextArea?: boolean;
  isReadOnly? : boolean ;
  validation :  {
    validator({ field }: any, value: string): Promise<void>;
} 
}
const CustomInputNumberFormik = ({
  
  required = true,
  placeholder,
  name,
  Icon,
  label,
  validation , 
  isReadOnly
}: InputInterface) => {
  const [field, meta] = useField(name);

  return (
    <Form.Item
      hasFeedback
      label={label}
      {...field}
      name={name}
      validateTrigger="onBlur"
      {...meta}
      rules={!required && meta.value ==='' ? [] : [validation]}
      required={required}
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
          disabled={isReadOnly}
        />
    </Form.Item>
  );
};

export default CustomInputNumberFormik;
