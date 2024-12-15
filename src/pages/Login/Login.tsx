/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Form, Input, Button, Card } from "antd";
import {useDispatch, useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'
import { login } from "../../store/authSlice/authSlice";
import DispatchInterface from "../../types/DispatchInterface";

const Login = () => {
  const {isUserLogIn , isWaitingForLogin} = useSelector((state : any)=>state.auth)
  
  const dispatch : DispatchInterface = useDispatch()
  
  const onFinish = (values : any) => {
     dispatch(login({url : `/user/login` , data : {
      email : values.username , password : values.password
     } , toastMessage : 'تم تسجيل الدخول بنجاح' } ))
  };

  if(isUserLogIn) return <Navigate to={'/'} replace={true}/>
  return (
    <Row justify="center" align="middle" style={{ minHeight: "90vh" , maxHeight: "90vh" }}>
      <Col
        xs={24}
        sm={24}
        md={12}
        lg={8}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <img
          src="/logo.png"
          style={{
            width: "80%",
            alignSelf: "center",
            justifyContent: "center",
           
          }}
        />
        <Card
          title="تسجيل الدخول"
          style={{
            direction : 'rtl' , 
            marginTop : '30px' , 
            backgroundColor: "rgba(255,255,255,.94)",
          }}
        >
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="البريد الالكتروني"
              name="username"
              rules={[
                { required: true, message: "من فضلك ادخل البريد الالكتروني" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="كلمة المرور"
              name="password"
              rules={[
                { required: true, message: "من فضلك ادخل كلمة المرور" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={isWaitingForLogin}
                disabled={isWaitingForLogin}
              >
                تسجيل الدخول
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
