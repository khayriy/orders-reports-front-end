/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { FloatButton, Form, FormInstance, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import ClearForm from "../../helpers/ClearForm/ClearForm";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import { updateShip } from "../../store/shipSlice/shipSlice";

interface ExpandShipInterface {
  record: any;
}

const ExpandShip = ({ record }: ExpandShipInterface) => {
  const arabicRX = new RegExp(/^[ء-ي\s]+$/);
  const numbersRX = new RegExp(/^[0-9]*$/);
  const formRef = useRef<FormInstance<any>>(null);
  const [shipName, setShipName] = useState(record.name);
  const [shipPhone, setShipPhone] = useState(record.phone);

  const {token} = useSelector((state : any) => state.auth)

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const dispatch : DispatchInterface = useDispatch()
 
  useEffect(() => {
    if (
      shipName !== record.name ||
      (shipPhone !== record.phone && shipPhone.startsWith("010")) ||
      shipPhone.startsWith("011") ||
      shipPhone.startsWith("012") ||
      shipPhone.startsWith("015")
    ) {
      setIsUpdateOpen(true);
    }
    else {
        setIsUpdateOpen(false);
    }
    if (
      arabicRX.test(shipName) === false ||
      numbersRX.test(shipPhone) === false
    ) {
      setIsUpdateOpen(false);
    }
    
  }, [shipName, shipPhone, record]);

    const updateShipHandler = () => {
    
    ClearForm(formRef)
    dispatch(
        updateShip({
        data: { name: shipName, phone: shipPhone },
        url: `ship/${record.key}`,
        toastMessage: "تم تعديل مسئول الشحن",
        token
      })
    );
  };
  return (
    <Form
      ref={formRef}
      layout="vertical"
      style={{ display: "flex", justifyContent: "flex-start", gap: "20px" }}
      initialValues={{
        ["name"]: shipName,
        ["phone"]: shipPhone,
      }}
    >
      <Form.Item
        hasFeedback
        name={"name"}
        validateTrigger="onBlur"
        label={"اسم مسئول الشحن"}
        rules={[
          {
            validator: async () => {
              if (!shipName || shipName === "") {
                return Promise.reject(
                  new Error("لابد من توافر اسم مسئول الشحن")
                );
              }
              if (arabicRX.test(shipName) === false) {
                return Promise.reject(
                  new Error("لابد من ادخال مسئول الشحن بالعربي فقط")
                );
              }
            },
          },
        ]}
        required={true}
        tooltip={"  مطلوب"}
      >
        <Input
          size="large"
          value={shipName}
          onChange={(e) => setShipName(e.target.value)}
          placeholder={"اسم مسئول الشحن"}
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item
        hasFeedback
        name={"phone"}
        validateTrigger="onBlur"
        label={"رقم الهاتف"}
        rules={[
          {
            validator: async () => {
              if (!shipPhone || shipPhone === "") {
                return Promise.reject(
                  new Error("لابد من توافر رقم هاتف مسئول الشحن")
                );
              }
              if (numbersRX.test(shipPhone) === false) {
                return Promise.reject(
                  new Error("لابد من ادخال رقم الهاتف ارقام فقط")
                );
              }
              if (shipPhone.length !== 11) {
                return Promise.reject(
                  new Error("لابد أن يكون رقم الهاتف 11 رقم")
                );
              }
              if (
                shipPhone.startsWith("011") === false &&
                shipPhone.startsWith("012") === false &&
                shipPhone.startsWith("015") === false &&
                shipPhone.startsWith("010") === false
              ) {
                return Promise.reject(
                  new Error(
                    "لابد ان يبدأ رقم الهاتف ب 011 أو 010 أو 015 أو 012"
                  )
                );
              }
            },
          },
        ]}
        required={true}
        tooltip={"مطلوب"}
      >
        <Input
          size="large"
          value={shipPhone}
          onChange={(e) => setShipPhone(e.target.value)}
          placeholder={"رقم هاتف مسئول الشحن"}
          prefix={<PhoneOutlined />}
        />
      </Form.Item>
      {isUpdateOpen ? (
        <FloatButton
          type="primary"
          onClick={updateShipHandler}
          icon={<AiOutlineCheck style={{ color: "white" }} />}
          style={{
            position: "relative",
            top: "0px",
            left: "10px",
            alignSelf: "center",
            boxShadow: "none",
          }}
          tooltip={<div>تأكيد</div>}
        />
      ) : null}
    </Form>
  );
};
export default ExpandShip;
