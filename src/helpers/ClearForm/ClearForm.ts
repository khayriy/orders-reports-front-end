/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInstance } from "antd";

const ClearForm = (formRef :React.RefObject<FormInstance<any>>)=>{
    
    formRef?.current?.resetFields();
  }

  export default ClearForm