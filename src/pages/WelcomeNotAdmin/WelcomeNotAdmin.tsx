/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from "antd";

const WelcomeNotAdmin = () => {
  return (
    <Result
      status="success"
      title="تم تسجيل الدخول بنجاح"
      subTitle={`مرحبا بك مرة اخري نذكرك انه يمكنك ادارة مايظهر لك فقط   `}
    />
  );
};

export default WelcomeNotAdmin;
