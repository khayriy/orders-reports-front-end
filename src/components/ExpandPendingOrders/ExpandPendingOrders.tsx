/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form } from "antd";
import type { FormInstance } from "antd";
import { ExclamationCircleFilled, LockOutlined, PlusOutlined } from "@ant-design/icons";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineEnvironment,
  AiOutlineFileText,
  AiOutlinePhone,
  AiOutlinePound,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import CustomInput from "../CustomInput/CustomInput";
import CustomVarSelectFormik from "../CustomVarSelectFormik/CustomVarSelectFormik";
import CustomInputNumberFormik from "../CustomInputNumberFormik/CustomInputNumberFormik";
import ProductInput from "../ProductInput/ProductInput";
import AcceptModal from "../../modals/AcceptModal/AcceptModal";
import addOrderSchema, { yupSync } from "../../validationSchema/AddOrderSchema";
import countryptions from "../../data/countryData";
import statusData, { statusPendingData } from "../../data/statusData";
import DispatchInterface from "../../types/DispatchInterface";
import { getAllProducts } from "../../store/productSlice/productSlice";
import { getAllShips } from "../../store/shipSlice/shipSlice";
import { updateOrderProducts } from "../../store/orderSlice/orderSlice";
import styles from "./expandPendingOrders.module.scss";

const MAX_PRODUCTS = 10;
const PARTIAL = "تسليم جزئي";

type FieldKey = "name" | "phone" | "phoneT" | "city" | "address" | "ship" | "price" | "details" | "status";
const FIELD_ORDER: FieldKey[] = ["name", "phone", "phoneT", "city", "address", "ship", "price", "details", "status"];
const LABELS: Record<FieldKey, string> = {
  name: "الاسم",
  phone: "الهاتف",
  phoneT: "هاتف بديل",
  city: "المحافظة/المركز",
  address: "العنوان التفصيلي",
  ship: "مسئول الشحن",
  price: "سعر الطلب",
  details: "ملاحظات",
  status: "الحالة",
};

const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const isOut = (q: any) => q === 0 || q === "0";
const stockLabel = (name: string, q: any) => `${name}  متاح "${q}"`;

const messageOf = (e: any): string =>
  typeof e === "string" ? e : Array.isArray(e) ? e.find((x) => typeof x === "string") ?? "راجع هذا الحقل" : "راجع هذا الحقل";

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

const formatChosen = (products: any[]) =>
  products
    .filter((e) => e.value?.[0])
    .map((e) =>
      e.value.length === 2
        ? { product: e.value[0], type: e.value[1], quantity: e.quantity }
        : { product: e.value[0], quantity: e.quantity }
    );

interface Props {
  record: any;
}

const ExpandPendingOrders = ({ record }: Props) => {
  const dispatch: DispatchInterface = useDispatch();
  const formRef = useRef<FormInstance<any>>(null);

  const { token } = useSelector((state: any) => state.auth);
  const { isWaitingForUpdateOrder } = useSelector((state: any) => state.order);
  const { productsDB } = useSelector((state: any) => state.product);
  const { ships } = useSelector((state: any) => state.ship);

  // Only a pending order can have its data edited; for any other status the API only accepts a new status.
  const isPending = record.status === "معلق";
  const locked = !isPending;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const buildProducts = () =>
    (record.products ?? []).map((e: any, index: number) =>
      e.product?.type && e.product.type !== ""
        ? { value: [e.product._id, e.product.type._id], quantity: e.product.quantity, id: index }
        : { value: [e.product?._id], quantity: e.product?.quantity, id: index }
    );
  const [products, setProducts] = useState<any[]>(buildProducts);
  const snapshot = (list: any[]) => JSON.stringify(list.map((p) => [p.value, p.quantity]));
  const baseline = useRef(snapshot(products));
  const productsChanged = snapshot(products) !== baseline.current;

  useEffect(() => {
    dispatch(getAllShips({ url: "ship", token }));
  }, [dispatch, token]);

  // reload after each update so the displayed stock is fresh
  useEffect(() => {
    dispatch(getAllProducts({ url: "product", token }));
  }, [dispatch, token, isFormSubmit]);

  const shipOptions = useMemo(
    () => (ships ?? []).map(({ _id, name }: any) => ({ value: _id, label: name })),
    [ships]
  );

  // options: out of stock, or already used by another row, are disabled
  const productOptions = useMemo(
    () =>
      (productsDB ?? []).map(({ _id, type, name, quantity }: any) => {
        if (!type || type.length === 0) {
          return {
            value: _id,
            label: stockLabel(name, quantity),
            disabled:
              isOut(quantity) || products.some((p) => p.value && (p.value[0] === _id || p.value[1] === _id)),
          };
        }
        return {
          value: _id,
          label: name,
          children: type.map((t: any) => ({
            value: t._id,
            label: stockLabel(t.name, t.quantity),
            disabled: isOut(t.quantity) || products.some((p) => p.value?.length === 2 && p.value[1] === t._id),
          })),
        };
      }),
    [productsDB, products]
  );

  const deleteProduct = (id: number) => setProducts((state) => state.filter((e) => e.id !== id));

  const addProductInput = () => {
    setProducts((state) => {
      const last = state.at(-1);
      if (!last) return [{ value: [""], quantity: 1, id: 0 }];
      return [...state, { value: [""], quantity: 1, id: Number(last.id) + 1 }];
    });
  };

  const afterUpdate = () => {
    setIsFormSubmit((e) => !e);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // partial delivery: confirmed from the modal
  const handleUpdateDeliver = () => {
    const data: any = { acceptedProducts: formatChosen(products), status: PARTIAL, price };
    if (details) data.notes = details;
    dispatch(
      updateOrderProducts({
        url: `order/status/${record._id}`,
        toastMessage: "تم توصيل الطلب بنجاح",
        data,
        clear: () => {
          afterUpdate();
          setIsModalOpen(false);
        },
        token,
      })
    );
  };

  const statusOptions = record.status === "قيد التشغيل" ? statusData : statusPendingData;

  return (
    <>
      <AcceptModal
        details={details}
        setDetails={setDetails}
        price={price}
        setPrice={setPrice}
        formattedProducts={productOptions}
        setProducts={setProducts}
        deleteProduct={deleteProduct}
        products={products}
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        handleOk={handleUpdateDeliver}
      />

      <Formik
        initialValues={{
          name: record.name,
          phone: record.phone,
          phoneT: record.anotherPhone,
          address: record.address,
          city: [record.country?.split(",")],
          details: record.notes,
          price: record.price,
          ship: [record.ship?._id],
          status: [record.status],
        }}
        // a locked order only sends its status, so the other fields must not block it
        validationSchema={locked ? undefined : addOrderSchema}
        onSubmit={(values) => {
          if (values.status?.[0] === PARTIAL) {
            setIsModalOpen(true);
            return;
          }

          if (locked) {
            dispatch(
              updateOrderProducts({
                url: `order/status/${record._id}`,
                toastMessage: "تم تعديل الطلب بنجاح",
                data: { status: values.status ? values.status[0] : "" },
                clear: afterUpdate,
                token,
              })
            );
            return;
          }

          dispatch(
            updateOrderProducts({
              url: `order/order/${record._id}`,
              toastMessage: "تم تعديل الطلب بنجاح",
              data: {
                shipId: values.ship ? values.ship[0] : "",
                address: values.address,
                notes: values.details,
                country: values.city && values.city.length !== 0 ? values.city.toString() : "",
                price: values.price,
                name: values.name,
                phone: values.phone,
                anotherPhone: values.phoneT,
                products: formatChosen(products),
                status: values.status ? values.status[0] : "",
              },
              clear: afterUpdate,
              token,
            })
          );
        }}
      >
        {({ values, errors, dirty, validateForm, setTouched, submitForm }) => {
          const chosenStatus = values.status?.[0];
          const isPartial = chosenStatus === PARTIAL;
          const statusChanged = chosenStatus !== record.status;
          const hasChanges = dirty || productsChanged;
          const problems = FIELD_ORDER.filter((k) => errors[k as keyof typeof errors]);

          const attempt = async () => {
            setAttempted(true);
            if (!locked) formRef.current?.validateFields().catch(() => {});
            const errs: any = await validateForm();
            if (Object.keys(errs).length === 0) {
              submitForm();
              return;
            }
            setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])) as any, false);
            const first = FIELD_ORDER.find((k) => errs[k]);
            if (first) focusField(first);
          };

          const hint = isPartial
            ? "عند المتابعة سيُطلب منك تحديد المنتجات التي تم تسليمها."
            : !hasChanges
            ? "لم تقم بأي تغيير بعد."
            : locked && statusChanged
            ? `سيتم تغيير الحالة إلى «${chosenStatus}».`
            : "سيتم حفظ التعديلات على الطلب.";

          const statusCard = (
            <section className={cls(styles.card, styles.statusCard)}>
              <header className={styles.cardHead}>
                <div className={styles.headText}>
                  <h3 className={styles.cardTitle}>الحالة</h3>
                  <span className={styles.cardHint}>
                    الحالة الحالية: <b>{record.status}</b>
                  </span>
                </div>
              </header>
              <div id="field-status" className={styles.field}>
                <CustomVarSelectFormik
                  placeholder="الحالة"
                  label="الحالة الجديدة"
                  options={statusOptions}
                  name="status"
                />
              </div>
            </section>
          );

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
              {locked && (
                <div className={styles.notice} role="note">
                  <LockOutlined />
                  <span>
                    الطلب حالته «{record.status}»، لذلك بياناته للقراءة فقط ويمكنك تغيير الحالة فقط.
                  </span>
                </div>
              )}

              {locked && statusCard}

              <section className={styles.card}>
                <header className={styles.cardHead}>
                  <div className={styles.headText}>
                    <h3 className={styles.cardTitle}>بيانات العميل</h3>
                  </div>
                  {locked && <span className={styles.lockChip}><LockOutlined /> للقراءة فقط</span>}
                </header>
                <div className={styles.fields}>
                  <div id="field-name" className={cls(styles.field, styles.span2)}>
                    <CustomInput
                      Icon={<AiOutlineUser />}
                      label="الاسم"
                      name="name"
                      placeholder="اسم العميل"
                      validation={yupSync}
                      isReadOnly={locked}
                    />
                  </div>
                  <div id="field-phone" className={styles.field}>
                    <CustomInput
                      Icon={<AiOutlinePhone />}
                      label="الهاتف"
                      name="phone"
                      placeholder="رقم الهاتف"
                      validation={yupSync}
                      isReadOnly={locked}
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
                      isReadOnly={locked}
                    />
                  </div>
                </div>
              </section>

              <section className={styles.card}>
                <header className={styles.cardHead}>
                  <div className={styles.headText}>
                    <h3 className={styles.cardTitle}>العنوان</h3>
                  </div>
                  {locked && <span className={styles.lockChip}><LockOutlined /> للقراءة فقط</span>}
                </header>
                <div className={styles.fields}>
                  <div id="field-city" className={cls(styles.field, styles.span2)}>
                    <CustomVarSelectFormik
                      placeholder="اختر المحافظة والمركز"
                      label="المحافظة/المركز"
                      options={countryptions}
                      name="city"
                      isReadOnly={locked}
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
                      isReadOnly={locked}
                    />
                  </div>
                </div>
              </section>

              <section className={styles.card}>
                <header className={styles.cardHead}>
                  <div className={styles.headText}>
                    <h3 className={styles.cardTitle}>المنتجات</h3>
                  </div>
                  {locked && <span className={styles.lockChip}><LockOutlined /> للقراءة فقط</span>}
                </header>
                <div id="field-products" className={styles.products}>
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
                      isReadOnly={locked}
                      products={products}
                      deleteProductInput={deleteProduct}
                    />
                  ))}
                </div>
                {!locked && products.length < MAX_PRODUCTS && (
                  <Button type="dashed" block icon={<PlusOutlined />} onClick={addProductInput} className={styles.add}>
                    إضافة منتج
                  </Button>
                )}
              </section>

              <section className={styles.card}>
                <header className={styles.cardHead}>
                  <div className={styles.headText}>
                    <h3 className={styles.cardTitle}>الشحن والسعر</h3>
                  </div>
                  {locked && <span className={styles.lockChip}><LockOutlined /> للقراءة فقط</span>}
                </header>
                <div className={styles.fields}>
                  <div id="field-ship" className={styles.field}>
                    <CustomVarSelectFormik
                      options={shipOptions}
                      label="مسئول الشحن"
                      placeholder="قم باختيار مسئول الشحن"
                      name="ship"
                      isReadOnly={locked}
                    />
                  </div>
                  <div id="field-price" className={styles.field}>
                    <CustomInputNumberFormik
                      Icon={<AiOutlinePound />}
                      label="سعر الطلب"
                      placeholder="ادخل اجمالي السعر"
                      name="price"
                      validation={yupSync}
                      isReadOnly={locked}
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
                      isReadOnly={locked}
                    />
                  </div>
                </div>
              </section>

              {!locked && statusCard}

              {/* what is wrong, with a way to jump to it */}
              {attempted && problems.length > 0 && (
                <div className={styles.problems} role="alert">
                  <div className={styles.problemsHead}>
                    <ExclamationCircleFilled />
                    يوجد {problems.length} بند يحتاج إلى مراجعة
                  </div>
                  <ul>
                    {problems.map((k) => (
                      <li key={k}>
                        <button type="button" onClick={() => focusField(k)}>
                          <b>{LABELS[k]}</b>
                          <span>{messageOf(errors[k as keyof typeof errors])}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.actionBar}>
                <p className={styles.hint} aria-live="polite">
                  {hint}
                </p>
                <Button
                  type="primary"
                  className={styles.submit}
                  onClick={attempt}
                  loading={isWaitingForUpdateOrder}
                  disabled={isWaitingForUpdateOrder}
                >
                  {isPartial ? "متابعة لتحديد المنتجات المسلمة" : "تعديل الطلب"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ExpandPendingOrders;