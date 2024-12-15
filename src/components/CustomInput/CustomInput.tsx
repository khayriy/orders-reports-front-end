/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input } from "antd";
import { useField } from "formik";
import { InfoCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

interface InputInterface {
  name: string;
  Icon?: React.ReactNode;
  label: string;
  placeholder: string;
  isReadOnly? : boolean ;
  required?: boolean;
  isTextArea?: boolean;
  validation :  {
    validator({ field }: any, value: string): Promise<void>;
} 
}
const CustomInput = ({
  isTextArea,
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
      style={{ width :   "100%"  }}
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
      {isTextArea ? (
        <TextArea disabled={isReadOnly} size="large" rows={2} placeholder={placeholder} />
      ) : (
        <Input disabled={isReadOnly} size="large" placeholder={placeholder} prefix={Icon} />
      )}
    </Form.Item>
  );
};

export default CustomInput;
