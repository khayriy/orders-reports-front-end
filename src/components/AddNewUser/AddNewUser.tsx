/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Form, Input } from "antd";
import { CheckOutlined, IdcardOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import PermissionRow from "../PermissionRow/PermissionRow";
import { createNewUser } from "../../store/authSlice/authSlice";
import styles from "./addNewUser.module.scss";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

type State = "done" | "todo" | "error";
interface Item {
  key: string;
  label: string;
  state: State;
  note: string;
}

const SECTIONS = [
  { text: "الشحن", field: "ship" },
  { text: "الطلبات", field: "order" },
  { text: "المنتجات", field: "product" },
];

const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const focusField = (key: string) => {
  const el = document.getElementById(`field-${key}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add(styles.flash);
  window.setTimeout(() => el.classList.remove(styles.flash), 1500);
  window.setTimeout(() => {
    (el.querySelector("input, textarea, button") as HTMLElement | null)?.focus({ preventScroll: true });
  }, 350);
};

interface Props {
  /** called after the user was created (e.g. to close the panel) */
  onSuccess?: () => void;
}

const AddNewUser = ({ onSuccess }: Props) => {
  const dispatch: DispatchInterface = useDispatch();
  const { token, isWaitingForAddNewUser } = useSelector((state: any) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("");
  const [view, setView] = useState<any[]>([]);
  const [create, setCreate] = useState<any[]>([]);
  const [update, setUpdate] = useState<any[]>([]);
  const [remove, setRemove] = useState<any[]>([]);
  const [touched, setTouched] = useState({ email: false, password: false, role: false });
  const [attempted, setAttempted] = useState(false);

  const emailValid = emailRegex.test(email.trim());
  const passwordValid = password.length >= MIN_PASSWORD;
  const roleValid = roleName.trim() !== "";
  const permCount = [...view, ...create, ...update, ...remove].length;

  const show = (k: "email" | "password" | "role") => attempted || touched[k];
  const touch = (k: "email" | "password" | "role") => setTouched((t) => ({ ...t, [k]: true }));

  // ---- one status per requirement ----
  const items: Item[] = [
    emailValid
      ? { key: "email", label: "البريد الالكتروني", state: "done", note: email.trim() }
      : {
          key: "email",
          label: "البريد الالكتروني",
          state: show("email") ? "error" : "todo",
          note: show("email")
            ? email.trim()
              ? "لابد من ادخال بريد الكتروني صالح"
              : "لابد من توافر البريد"
            : "مطلوب",
        },
    passwordValid
      ? { key: "password", label: "كلمة المرور", state: "done", note: "••••••••" }
      : {
          key: "password",
          label: "كلمة المرور",
          state: show("password") ? "error" : "todo",
          note: show("password")
            ? password
              ? `كلمة المرور ${MIN_PASSWORD} أحرف على الأقل`
              : "لابد من توافر كلمة المرور"
            : "مطلوب",
        },
    roleValid
      ? { key: "role", label: "اسم الدور", state: "done", note: roleName.trim() }
      : {
          key: "role",
          label: "اسم الدور",
          state: show("role") ? "error" : "todo",
          note: show("role") ? "لابد من توافر اسم الدور" : "مطلوب",
        },
    permCount > 0
      ? { key: "permissions", label: "الصلاحيات", state: "done", note: `${permCount} صلاحية` }
      : {
          key: "permissions",
          label: "الصلاحيات",
          state: attempted ? "error" : "todo",
          note: attempted ? "اختر صلاحية واحدة على الأقل" : "مطلوب",
        },
  ];

  const doneCount = items.filter((i) => i.state === "done").length;
  const problems = items.length - doneCount;
  const percent = Math.round((doneCount / items.length) * 100);
  const ready = problems === 0;

  const stepState = (list: Item[]): State =>
    list.some((i) => i.state === "error") ? "error" : list.every((i) => i.state === "done") ? "done" : "todo";
  const step1 = stepState(items.slice(0, 3));
  const step2 = stepState(items.slice(3));

  const reset = () => {
    setEmail("");
    setPassword("");
    setRoleName("");
    setView([]);
    setCreate([]);
    setUpdate([]);
    setRemove([]);
    setTouched({ email: false, password: false, role: false });
    setAttempted(false);
  };

  // always clickable: explains what is missing and jumps to it
  const attempt = () => {
    setAttempted(true);
    setTouched({ email: true, password: true, role: true });
    const first = items.find((i) => i.state !== "done");
    if (first) {
      focusField(first.key);
      return;
    }
    dispatch(
      createNewUser({
        token,
        data: {
          email: email.trim(),
          password,
          roleName: roleName.trim(),
          permission: { view, create, update, remove },
        },
        toastMessage: "تم اضافة المستخدم بنجاح",
        url: "user/signup",
        clearForm: () => {
          reset();
          onSuccess?.();
        },
      })
    );
  };

  const badge = (n: number, s: State) => (
    <span className={styles.stepBadge} data-state={s}>
      {s === "done" ? <CheckOutlined /> : s === "error" ? "!" : n}
    </span>
  );

  return (
    <div className={styles.page}>
      <Form
        layout="vertical"
        className={styles.form}
        onSubmitCapture={(e) => {
          e.preventDefault();
          attempt();
        }}
      >
        <div className={styles.main}>
          {/* ---- 1. account ---- */}
          <section className={cls(styles.card, step1 === "done" && styles.card_done, step1 === "error" && styles.card_error)}>
            <header className={styles.cardHead}>
              {badge(1, step1)}
              <div className={styles.headText}>
                <h2 className={styles.cardTitle}>بيانات الحساب</h2>
                <span className={styles.cardHint}>البريد وكلمة المرور واسم الدور</span>
              </div>
            </header>

            <div className={styles.fields}>
              <div id="field-email" className={cls(styles.field, styles.span2)}>
                <Form.Item
                  label="البريد الالكتروني"
                  required
                  hasFeedback={show("email")}
                  validateStatus={show("email") ? (emailValid ? "success" : "error") : undefined}
                  help={show("email") && !emailValid ? items[0].note : undefined}
                >
                  <Input
                    size="large"
                    className={styles.ltr}
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => touch("email")}
                    placeholder="البريد الالكتروني للمستخدم"
                    prefix={<MailOutlined />}
                  />
                </Form.Item>
              </div>

              <div id="field-password" className={styles.field}>
                <Form.Item
                  label="كلمة المرور"
                  required
                  validateStatus={show("password") ? (passwordValid ? "success" : "error") : undefined}
                  extra={
                    <ul className={styles.rules}>
                      <li data-state={passwordValid ? "ok" : show("password") && password ? "bad" : "todo"}>
                        <span className={styles.dot}>{passwordValid && <CheckOutlined />}</span>
                        {MIN_PASSWORD} أحرف على الأقل
                      </li>
                    </ul>
                  }
                >
                  <Input.Password
                    size="large"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => touch("password")}
                    placeholder="كلمة مرور المستخدم"
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
              </div>

              <div id="field-role" className={styles.field}>
                <Form.Item
                  label="اسم الدور"
                  required
                  hasFeedback={show("role")}
                  validateStatus={show("role") ? (roleValid ? "success" : "error") : undefined}
                  help={show("role") && !roleValid ? items[2].note : undefined}
                >
                  <Input
                    size="large"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    onBlur={() => touch("role")}
                    placeholder="اسم الدور للمستخدم"
                    prefix={<IdcardOutlined />}
                  />
                </Form.Item>
              </div>
            </div>
          </section>

          {/* ---- 2. permissions ---- */}
          <section className={cls(styles.card, step2 === "done" && styles.card_done, step2 === "error" && styles.card_error)}>
            <header className={styles.cardHead}>
              {badge(2, step2)}
              <div className={styles.headText}>
                <h2 className={styles.cardTitle}>الصلاحيات</h2>
                <span className={styles.cardHint}>حدد ما يمكن للمستخدم رؤيته وإنشاءه وتعديله وحذفه في كل قسم</span>
              </div>
              {permCount > 0 && <span className={styles.stepCount}>{permCount}</span>}
            </header>

            <div id="field-permissions" className={cls(styles.field, styles.permissions)}>
              {SECTIONS.map(({ text, field }) => (
                <PermissionRow
                  key={field}
                  view={view}
                  setView={setView}
                  create={create}
                  setCreate={setCreate}
                  update={update}
                  setUpdate={setUpdate}
                  remove={remove}
                  setRemove={setRemove}
                  text={text}
                  permissionField={field}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ---- summary / checklist ---- */}
        <aside className={styles.side}>
          <section className={styles.summary}>
            <h2 className={styles.summaryTitle}>ملخص المستخدم</h2>

            <div className={styles.progress}>
              <div className={styles.progressTop}>
                <span>اكتمال البيانات</span>
                <b>
                  {doneCount}/{items.length}
                </b>
              </div>
              <div
                className={styles.bar}
                role="progressbar"
                aria-label="اكتمال البيانات"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
              >
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>

            <ul className={styles.checklist}>
              {items.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className={styles.check}
                    data-state={item.state}
                    onClick={() => focusField(item.key)}
                  >
                    <span className={styles.mark}>
                      {item.state === "done" ? <CheckOutlined /> : item.state === "error" ? "!" : ""}
                    </span>
                    <span className={styles.checkText}>
                      <b>{item.label}</b>
                      <small>{item.note}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className={styles.status} data-ready={ready} aria-live="polite">
              {ready
                ? "كل البيانات مكتملة. يمكنك إضافة المستخدم."
                : attempted
                ? `يوجد ${problems} بند يحتاج إلى مراجعة. اضغط على أي بند للانتقال إليه.`
                : `متبقي ${problems} بند قبل إضافة المستخدم.`}
            </p>

            <Button
              type="primary"
              className={cls(styles.submit, ready && styles.ready)}
              onClick={attempt}
              loading={isWaitingForAddNewUser}
              disabled={isWaitingForAddNewUser}
            >
              إضافة المستخدم
            </Button>
          </section>
        </aside>
      </Form>
    </div>
  );
};

export default AddNewUser;