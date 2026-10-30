/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Button, Form, Input } from "antd";
import type { InputRef } from "antd";
import { CheckOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createNewShip } from "../../store/shipSlice/shipSlice";
import DispatchInterface from "../../types/DispatchInterface";
import styles from "./addNewShip.module.scss";

const arabicRX = /^[ء-ي\s]+$/;
const numbersRX = /^[0-9]+$/;
const PREFIXES = ["010", "011", "012", "015"];

interface Props {
  /** called after the ship was created (e.g. to close the panel) */
  onSuccess?: () => void;
}

const AddNewShip = ({ onSuccess }: Props) => {
  const dispatch: DispatchInterface = useDispatch();
  const { isWaitingForAddShip } = useSelector((state: any) => state.ship);
  const { token } = useSelector((state: any) => state.auth);

  const nameRef = useRef<InputRef>(null);
  const phoneRef = useRef<InputRef>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [attempted, setAttempted] = useState(false);

  // ---- validation ----
  const trimmed = name.trim();
  const nameError = !trimmed
    ? "لابد من توافر اسم مسئول الشحن"
    : !arabicRX.test(trimmed)
    ? "لابد من ادخال مسئول الشحن بالعربي فقط"
    : "";

  const rules = [
    { key: "digits", text: "أرقام فقط", ok: numbersRX.test(phone), error: "لابد من ادخال رقم الهاتف ارقام فقط" },
    { key: "length", text: "11 رقمًا", ok: phone.length === 11, error: "لابد أن يكون رقم الهاتف 11 رقم" },
    {
      key: "prefix",
      text: "يبدأ بـ 010 أو 011 أو 012 أو 015",
      ok: PREFIXES.some((p) => phone.startsWith(p)),
      error: "لابد ان يبدأ رقم الهاتف ب 011 أو 010 أو 015 أو 012",
    },
  ];
  const phoneError = !phone ? "لابد من توافر رقم هاتف مسئول الشحن" : rules.find((r) => !r.ok)?.error ?? "";

  const showName = touched.name || attempted;
  const showPhone = touched.phone || attempted;

  const attempt = () => {
    setAttempted(true);
    setTouched({ name: true, phone: true });
    if (nameError) {
      nameRef.current?.focus();
      return;
    }
    if (phoneError) {
      phoneRef.current?.focus();
      return;
    }
    dispatch(
      createNewShip({
        data: { name: trimmed, phone },
        toastMessage: "تم اضافة مسئول الشحن بنجاح",
        url: "ship",
        clearForm: () => {
          setName("");
          setPhone("");
          setTouched({ name: false, phone: false });
          setAttempted(false);
          onSuccess?.();
        },
        token,
      })
    );
  };

  return (
    <section className={styles.panel}>
      <header className={styles.head}>
        <h2 className={styles.title}>إضافة مسئول شحن</h2>
        <span className={styles.hint}>الاسم بالعربي، ورقم هاتف مصري مكوّن من 11 رقمًا</span>
      </header>

      <Form
        layout="vertical"
        onSubmitCapture={(e) => {
          e.preventDefault();
          attempt();
        }}
      >
        <div className={styles.fields}>
          <Form.Item
            label="اسم مسئول الشحن"
            required
            hasFeedback={showName}
            validateStatus={showName ? (nameError ? "error" : "success") : undefined}
            help={showName && nameError ? nameError : undefined}
          >
            <Input
              ref={nameRef}
              size="large"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="اسم مسئول الشحن"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="رقم الهاتف"
            required
            hasFeedback={showPhone}
            validateStatus={showPhone ? (phoneError ? "error" : "success") : undefined}
            help={showPhone && !phone ? phoneError : undefined}
            extra={
              <ul className={styles.rules}>
                {rules.map((r) => {
                  const state = !phone ? "todo" : r.ok ? "ok" : showPhone ? "bad" : "todo";
                  return (
                    <li key={r.key} data-state={state}>
                      <span className={styles.dot}>{state === "ok" && <CheckOutlined />}</span>
                      {r.text}
                    </li>
                  );
                })}
              </ul>
            }
          >
            <Input
              ref={phoneRef}
              size="large"
              className={styles.phone}
              inputMode="numeric"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              placeholder="رقم هاتف مسئول الشحن"
              prefix={<PhoneOutlined />}
            />
          </Form.Item>
        </div>

        <div className={styles.actions}>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submit}
            loading={isWaitingForAddShip}
            disabled={isWaitingForAddShip}
          >
            إضافة مسئول الشحن
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default AddNewShip;