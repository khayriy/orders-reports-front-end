/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, DatePicker, Form } from "antd";
import type { DatePickerProps, FormInstance } from "antd";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlinePound,
  AiOutlineEnvironment,
  AiOutlineFileText,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import CustomInput from "../CustomInput/CustomInput";
import ProductInput from "../ProductInput/ProductInput";
import CustomVarSelectFormik from "../CustomVarSelectFormik/CustomVarSelectFormik";
import CustomInputNumberFormik from "../CustomInputNumberFormik/CustomInputNumberFormik";
import addOrderSchema, { yupSync } from "../../validationSchema/AddOrderSchema";
import countryptions from "../../data/countryData";
import DispatchInterface from "../../types/DispatchInterface";
import { getAllProducts } from "../../store/productSlice/productSlice";
import { getAllShips } from "../../store/shipSlice/shipSlice";
import { createNewOrder } from "../../store/orderSlice/orderSlice";
import styles from "./addOrder.module.scss";

// ---------------------------------------------------------------
// Form map: every field, its label, and the step it belongs to
// ---------------------------------------------------------------
type FieldKey =
  | "name" | "phone" | "phoneT" | "city" | "address"
  | "products" | "ship" | "price" | "details";

// order on the page (used for "jump to the first problem")
const FIELD_ORDER: FieldKey[] = [
  "name", "phone", "phoneT", "city", "address", "products", "ship", "price", "details",
];

const LABELS: Record<FieldKey, string> = {
  name: "الاسم",
  phone: "رقم الهاتف",
  phoneT: "هاتف بديل",
  city: "المحافظة/المركز",
  address: "العنوان التفصيلي",
  products: "المنتجات",
  ship: "مسئول الشحن",
  price: "سعر الطلب",
  details: "ملاحظات",
};

interface Step {
  n: number;
  title: string;
  hint: string;
  keys: FieldKey[];
}

const STEPS: Step[] = [
  { n: 1, title: "بيانات العميل", hint: "الاسم ورقم الهاتف للتواصل أثناء التسليم", keys: ["name", "phone", "phoneT"] },
  { n: 2, title: "العنوان", hint: "المحافظة والعنوان التفصيلي للتسليم", keys: ["city", "address"] },
  { n: 3, title: "المنتجات", hint: "اختر المنتج والكمية، ويمكنك إضافة أكثر من منتج", keys: ["products"] },
  { n: 4, title: "الشحن والسعر", hint: "مسئول الشحن وسعر الطلب، والجدولة إن لزم", keys: ["ship", "price", "details"] },
];

type State = "done" | "todo" | "error" | "hidden";
interface Item {
  key: string;
  label: string;
  state: State;
  note: string;
}

const MAX_PRODUCTS = 60;
const emptyProduct = () => [{ value: [""], quantity: 1, id: 0 }];
const isOut = (q: any) => q === 0 || q === "0";
const stockLabel = (name: string, q: any) => `${name}  متاح "${q}"`;
const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const filled = (v: any) =>
  Array.isArray(v) ? v.some(Boolean) : String(v ?? "").trim() !== "";

const messageOf = (e: any): string | undefined =>
  typeof e === "string" ? e : Array.isArray(e) ? e.find((x) => typeof x === "string") : undefined;

const focusField = (key: string) => {
  const el = document.getElementById(`field-${key}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add(styles.flash);
  window.setTimeout(() => el.classList.remove(styles.flash), 1500);
  window.setTimeout(() => {
    (el.querySelector("input, textarea") as HTMLElement | null)?.focus({ preventScroll: true });
  }, 350);
};

const truncate = (s: string, n = 28) => (s.length > n ? `${s.slice(0, n)}…` : s);

// ---------------------------------------------------------------
// Turns Formik state into one status per field
// ---------------------------------------------------------------
const buildItems = (ctx: {
  values: any;
  errors: any;
  touched: any;
  attempted: boolean;
  selectedCount: number;
  shipLabel?: string;
}): Item[] => {
  const { values, errors, touched, attempted, selectedCount, shipLabel } = ctx;

  const preview = (key: FieldKey): string => {
    switch (key) {
      case "city": return (values.city ?? []).filter(Boolean).join(" / ");
      case "ship": return shipLabel ?? "";
      case "price": return Number(values.price).toLocaleString("en-US");
      case "products": return `${selectedCount} منتج`;
      default: return truncate(String(values[key] ?? ""));
    }
  };

  const items: Item[] = FIELD_ORDER.map((key) => {
    const label = LABELS[key];

    if (key === "products") {
      if (selectedCount > 0) return { key, label, state: "done", note: preview(key) };
      return {
        key,
        label,
        state: attempted ? "error" : "todo",
        note: attempted ? "اختر منتجًا واحدًا على الأقل" : "مطلوب",
      };
    }

    const hasError = Boolean(errors[key]);
    const isFilled = filled(values[key]);

    if (!hasError) {
      return isFilled
        ? { key, label, state: "done", note: preview(key) }
        : { key, label, state: "hidden", note: "" }; // optional and empty
    }
    const show = attempted || Boolean(touched[key]) || isFilled;
    return {
      key,
      label,
      state: show ? "error" : "todo",
      note: show ? messageOf(errors[key]) ?? "راجع هذا الحقل" : "مطلوب",
    };
  });

  // errors on fields this page doesn't know about must never be invisible
  Object.keys(errors)
    .filter((k) => !(k in LABELS))
    .forEach((k) =>
      items.push({ key: k, label: k, state: "error", note: messageOf(errors[k]) ?? "راجع هذا الحقل" })
    );

  return items;
};

// ---------------------------------------------------------------
// Step header
// ---------------------------------------------------------------
const StepHead = ({ step, items }: { step: Step; items: Item[] }) => {
  const mine = items.filter((i) => step.keys.includes(i.key as FieldKey) && i.state !== "hidden");
  const done = mine.filter((i) => i.state === "done").length;
  const state = mine.some((i) => i.state === "error")
    ? "error"
    : mine.length > 0 && done === mine.length
    ? "done"
    : "todo";

  return (
    <header className={styles.cardHead}>
      <span className={styles.stepBadge} data-state={state}>
        {state === "done" ? <CheckOutlined /> : state === "error" ? "!" : step.n}
      </span>
      <div className={styles.headText}>
        <h2 className={styles.cardTitle}>{step.title}</h2>
        <span className={styles.cardHint}>{step.hint}</span>
      </div>
      {mine.length > 0 && (
        <span className={styles.stepCount} data-state={state}>
          {done}/{mine.length}
        </span>
      )}
    </header>
  );
};

const stepState = (step: Step, items: Item[]) => {
  const mine = items.filter((i) => step.keys.includes(i.key as FieldKey) && i.state !== "hidden");
  if (mine.some((i) => i.state === "error")) return "error";
  if (mine.length > 0 && mine.every((i) => i.state === "done")) return "done";
  return "todo";
};

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------
const AddNewOrder = () => {
  const dispatch: DispatchInterface = useDispatch();
  const formRef = useRef<FormInstance<any>>(null);

  const { token } = useSelector((state: any) => state.auth);
  const { productsDB } = useSelector((state: any) => state.product);
  const { ships } = useSelector((state: any) => state.ship);
  const { isWaitingForAddOrder } = useSelector((state: any) => state.order);

  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [products, setProducts] = useState<{value: string[] , quantity: number , id : number }[]>(emptyProduct());
  const [schedule, setSchedule] = useState("");
  const [scheduleValue, setScheduleValue] = useState<any>(null);

  useEffect(() => {
    dispatch(getAllProducts({ url: "product", token }));
  }, [dispatch, token, isFormSubmit]);

  useEffect(() => {
    dispatch(getAllShips({ url: "ship", token }));
  }, [dispatch, token]);

  const shipOptions = useMemo(
    () => (ships ?? []).map(({ _id, name }: any) => ({ value: _id, label: name })),
    [ships]
  );

  const baseOptions = useMemo(
    () =>
      (productsDB ?? []).map(({ _id, type, name, quantity }: any) => {
        if (!type || type.length === 0) {
          return { value: _id, label: stockLabel(name, quantity), outOfStock: isOut(quantity) };
        }
        return {
          value: _id,
          label: name,
          children: type.map((t: any) => ({
            value: t._id,
            label: stockLabel(t.name, t.quantity),
            outOfStock: isOut(t.quantity),
          })),
        };
      }),
    [productsDB]
  );

  const productOptions = useMemo(
    () =>
      baseOptions.map((opt: any) => {
        if (opt.children) {
          return {
            value: opt.value,
            label: opt.label,
            children: opt.children.map((t: any) => ({
              value: t.value,
              label: t.label,
              disabled:
                t.outOfStock ||
                products.some((p) => p.value?.length === 2 && p.value[1] === t.value),
            })),
          };
        }
        return {
          value: opt.value,
          label: opt.label,
          disabled:
            opt.outOfStock ||
            products.some((p) => p.value && (p.value[0] === opt.value || p.value[1] === opt.value)),
        };
      }),
    [baseOptions, products]
  );

  const selectedCount = products.filter((p) => p.value?.[0]).length;
  const hasProduct = selectedCount > 0;

  const addProductInput = () => {
  setProducts((state) => {
    const last = state[state.length - 1];

    if (!last) return emptyProduct();

    return [
      ...state,
      {
        value: [""],
        quantity: 1,
        id: last.id + 1,
      },
    ];
  });
};

  const deleteProduct = (id: number) => {
    setProducts((state) => state.filter((e) => e.id !== id));
  };

  const scheduleHandler: DatePickerProps["onChange"] = (date, dateString) => {
    setScheduleValue(date);
    const str = Array.isArray(dateString) ? dateString[0] : dateString;
    if (str) {
      const [year, month, day] = str.split("-");
      setSchedule(new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString());
    } else {
      setSchedule("");
    }
  };

  return (
    <div className={styles.page}>
      <Formik
        initialValues={{
          name: "",
          phone: "",
          phoneT: "",
          address: "",
          city: [null],
          details: "",
          price: "",
          ship: [null],
        }}
        validationSchema={addOrderSchema}
        validateOnMount // so the checklist knows what is missing from the start
        onSubmit={(values, helpers) => {
          if (!hasProduct) return;

          const formattedChosen = products
            .filter((e) => e.value?.[0])
            .map((e) =>
              e.value.length === 2
                ? { product: e.value[0], type: e.value[1], quantity: e.quantity }
                : { product: e.value[0], quantity: e.quantity }
            );

          const data = {
            shipId: values.ship ? values.ship[0] : "",
            address: values.address,
            notes: values.details,
            country: values.city && values.city.length !== 0 ? values.city.toString() : "",
            price: values.price,
            name: values.name,
            phone: values.phone,
            anotherPhone: values.phoneT,
            products: formattedChosen,
            createdAt: schedule,
          };

          dispatch(
            createNewOrder({
              url: "order",
              token,
              clearForm: () => {
                helpers.resetForm();
                setProducts(emptyProduct());
                setSchedule("");
                setScheduleValue(null);
                setAttempted(false);
                formRef.current?.resetFields();
                setIsFormSubmit((e) => !e);
                window.scrollTo({ top: 0, behavior: "smooth" });
              },
              toastMessage: "تم اضافة الطلب بنجاح",
              data,
            })
          );
        }}
      >
        {({ values, errors, touched, validateForm, setTouched, submitForm }) => {
          const shipLabel = shipOptions.find((o: any) => o.value === values.ship?.[0])?.label;
          const items = buildItems({ values, errors, touched, attempted, selectedCount, shipLabel });
          const visible = items.filter((i) => i.state !== "hidden");
          const doneCount = visible.filter((i) => i.state === "done").length;
          const problems = visible.length - doneCount;
          const percent = visible.length ? Math.round((doneCount / visible.length) * 100) : 0;
          const ready = problems === 0;
          const stateOf = (n: number) => stepState(STEPS[n], items);

          // One entry point for the button and for Enter: validate, explain, then submit.
          const attempt = async () => {
            setAttempted(true);
            formRef.current?.validateFields().catch(() => {}); // lets inline messages appear too
            const errs: any = await validateForm();

            if (Object.keys(errs).length === 0 && hasProduct) {
              submitForm();
              return;
            }
            setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])) as any, false);
            const first = FIELD_ORDER.find((k) => (k === "products" ? !hasProduct : errs[k]));
            if (first) focusField(first);
          };

          return (
            <Form
              layout="vertical"
              ref={formRef}
              className={styles.form}
              onSubmitCapture={(e) => {
                e.preventDefault();
                attempt();
              }}
            >
              {/* ---------------- Steps ---------------- */}
              <div className={styles.main}>
                <section className={cls(styles.card, styles[`card_${stateOf(0)}`])}>
                  <StepHead step={STEPS[0]} items={items} />
                  <div className={styles.fields}>
                    <div id="field-name" className={cls(styles.field, styles.span2)}>
                      <CustomInput
                        Icon={<AiOutlineUser />}
                        label="الاسم"
                        name="name"
                        placeholder="اسم العميل"
                        validation={yupSync}
                      />
                    </div>
                    <div id="field-phone" className={styles.field}>
                      <CustomInput
                        Icon={<AiOutlinePhone />}
                        label="الهاتف"
                        name="phone"
                        placeholder="رقم الهاتف"
                        validation={yupSync}
                      />
                    </div>
                    <div id="field-phoneT" className={styles.field}>
                      <CustomInput
                        Icon={<AiOutlinePhone />}
                        required={false}
                        label="هاتف بديل"
                        name="phoneT"
                        placeholder="رقم هاتف بديل"
                        validation={yupSync}
                      />
                    </div>
                  </div>
                </section>

                <section className={cls(styles.card, styles[`card_${stateOf(1)}`])}>
                  <StepHead step={STEPS[1]} items={items} />
                  <div className={styles.fields}>
                    <div id="field-city" className={cls(styles.field, styles.span2)}>
                      <CustomVarSelectFormik
                        placeholder="اختر المحافظة والمركز"
                        label="المحافظة/المركز"
                        options={countryptions}
                        name="city"
                      />
                    </div>
                    <div id="field-address" className={cls(styles.field, styles.span2)}>
                      <CustomInput
                        Icon={<AiOutlineEnvironment />}
                        isTextArea={true}
                        label="العنوان التفصيلي"
                        placeholder="قم بكتابة العنوان التفصيلي"
                        name="address"
                        validation={yupSync}
                      />
                    </div>
                  </div>
                </section>

                <section className={cls(styles.card, styles[`card_${stateOf(2)}`])}>
                  <StepHead step={STEPS[2]} items={items} />
                  <div id="field-products" className={cls(styles.field, styles.products)}>
                    {products.map((e, index) => (
                      <ProductInput
                        options={productOptions}
                        label="الاسم الفرعي"
                        placeholder="اكتب اسم النوع الداخلي"
                        Icon={<AiOutlineShoppingCart />}
                        setProducts={setProducts}
                        product={e}
                        id={e.id}
                        isFirst={index === 0 && products.length === 1}
                        key={e.id}
                        products={products}
                        deleteProductInput={deleteProduct}
                      />
                    ))}
                  </div>

                  {products.length < MAX_PRODUCTS && (
                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={addProductInput}
                      className={styles.add}
                    >
                      إضافة منتج
                    </Button>
                  )}
                </section>

                <section className={cls(styles.card, styles[`card_${stateOf(3)}`])}>
                  <StepHead step={STEPS[3]} items={items} />
                  <div className={styles.fields}>
                    <div id="field-ship" className={styles.field}>
                      <CustomVarSelectFormik
                        options={shipOptions}
                        label="مسئول الشحن"
                        placeholder="قم باختيار مسئول الشحن"
                        name="ship"
                      />
                    </div>
                   
                     <div id="field-price" className={cls(styles.field)}>

                    
                     <CustomInputNumberFormik
                        Icon={<AiOutlinePound />}
                        label="سعر الطلب"
                        placeholder="ادخل اجمالي السعر"
                        name="price"
                        validation={yupSync}
                      />
                       </div>
                  
                    <div id="field-details" className={cls(styles.field, styles.span2)}>
                      <CustomInput
                        Icon={<AiOutlineFileText />}
                        isTextArea={true}
                        label="ملاحظات"
                        placeholder="ملاحظات لمسئول الشحن"
                        name="details"
                        required={false}
                        validation={yupSync}
                      />
                    </div>
                      <Form.Item
                      label="جدولة الطلب (اختياري)"
                      extra="اتركه فارغًا إذا لم يكن الطلب مجدولًا"
                    >
                      <DatePicker
                        value={scheduleValue}
                        onChange={scheduleHandler}
                        format="YYYY-MM-DD"
                        style={{ width: "100%" }}
                      />
                    </Form.Item> 
                  </div>
                </section>
              </div>

              {/* ---------------- Summary / checklist ---------------- */}
              <aside className={styles.side}>
                <section className={styles.summary}>
                  <h2 className={styles.summaryTitle}>ملخص الطلب</h2>

                  <div className={styles.progress}>
                    <div className={styles.progressTop}>
                      <span>اكتمال البيانات</span>
                      <b>
                        {doneCount}/{visible.length}
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
                    {visible.map((item) => (
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
                      ? "كل البيانات مكتملة. يمكنك تسجيل الطلب."
                      : attempted
                      ? `يوجد ${problems} بند يحتاج إلى مراجعة. اضغط على أي بند للانتقال إليه.`
                      : `متبقي ${problems} بند قبل تسجيل الطلب.`}
                  </p>

                  <Button
                    type="primary"
                    className={cls(styles.submit, ready && styles.ready)}
                    onClick={attempt}
                    loading={isWaitingForAddOrder}
                    disabled={isWaitingForAddOrder}
                  >
                    سجل الطلب
                  </Button>
                </section>
              </aside>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddNewOrder;