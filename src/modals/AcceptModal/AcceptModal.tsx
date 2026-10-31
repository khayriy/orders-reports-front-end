/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { DollarOutlined, ExclamationCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import ProductInput from "../../components/ProductInput/ProductInput";
import styles from "./acceptModal.module.scss";

interface AcceptModalInterface {
  products: any;
  isModalOpen: boolean;
  handleCancel: any;
  handleOk: any;
  deleteProduct: any;
  setProducts: any;
  formattedProducts: any;
  price: any;
  setPrice: any;
  details: any;
  setDetails: any;
}

const AcceptModal = ({
  formattedProducts,
  products,
  deleteProduct,
  setProducts,
  isModalOpen,
  handleCancel,
  handleOk,
  price,
  setPrice,
  details,
  setDetails,
}: AcceptModalInterface) => {
  const [attempted, setAttempted] = useState(false);
  const priceRef = useRef<any>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const acceptedCount = products.filter((p: any) => p.value?.[0]).length;
  const hasProducts = acceptedCount > 0;
  const hasPrice = price !== "" && price !== null && price !== undefined;

  const missing = [!hasProducts && "المنتجات", !hasPrice && "السعر الجديد"].filter(Boolean) as string[];

  const close = () => {
    setAttempted(false);
    handleCancel();
  };

  // always clickable: if something is missing it says what and moves there
  const confirm = () => {
    setAttempted(true);
    if (!hasProducts) {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!hasPrice) {
      priceRef.current?.focus?.();
      return;
    }
    handleOk();
  };

  return (
    <Modal
      open={isModalOpen}
      centered
      width={880}
      wrapClassName={styles.modal}
      onCancel={close}
      title={
        <div className={styles.title}>
          <span>تسليم جزئي</span>
          <small>حدد ما تم تسليمه فعليًا للعميل</small>
        </div>
      }
      footer={
        <div className={styles.footer}>
          <p className={styles.summary} data-state={attempted && missing.length ? "error" : "ok"} aria-live="polite">
            {attempted && missing.length > 0 ? (
              <>
                <ExclamationCircleFilled /> يرجى مراجعة: {missing.join("، ")}
              </>
            ) : (
              <>
                <b>{acceptedCount}</b> منتج مسلّم
                {hasPrice && (
                  <>
                    {" · "}السعر الجديد <b>{Number(price).toLocaleString("en-US")}</b>
                  </>
                )}
              </>
            )}
          </p>
          <div className={styles.actions}>
            <Button className={styles.cancel} onClick={close}>
              غلق
            </Button>
            <Button type="primary" className={styles.confirm} onClick={confirm}>
              تاكيد الاستلام الجزئي
            </Button>
          </div>
        </div>
      }
    >
      <Form layout="vertical" className={styles.form} onSubmitCapture={(e) => e.preventDefault()}>
        <div className={styles.notice} role="note">
          <InfoCircleOutlined />
          <span>
            أبقِ المنتجات التي تم تسليمها فقط وعدّل كمياتها، واحذف ما لم يتم تسليمه. ثم أدخل السعر الجديد بعد التسليم.
          </span>
        </div>

        <section className={styles.card} data-invalid={attempted && !hasProducts}>
          <header className={styles.cardHead}>
            <h3 className={styles.cardTitle}>
              المنتجات المسلمة
              <span className={styles.count}>{acceptedCount}</span>
            </h3>
          </header>

          <div ref={productsRef} className={styles.products}>
            {products.map((e: any, index: number) => (
              <ProductInput
                isProductDisable={true}
                options={formattedProducts}
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

          {attempted && !hasProducts && <p className={styles.error}>اترك منتجًا واحدًا على الأقل ضمن المنتجات المسلمة.</p>}
        </section>

        <section className={styles.card}>
          <header className={styles.cardHead}>
            <h3 className={styles.cardTitle}>بيانات التسليم</h3>
          </header>

          <div className={styles.fields}>
            <Form.Item
              label="السعر الجديد"
              required
              validateStatus={attempted && !hasPrice ? "error" : undefined}
              help={attempted && !hasPrice ? "أدخل السعر الجديد بعد التسليم" : undefined}
            >
              <InputNumber
                ref={priceRef}
                style={{ width: "100%" }}
                size="large"
                min={0}
                precision={0}
                placeholder="ادخل السعر الجديد بعد التسليم"
                prefix={<DollarOutlined />}
                value={price === "" ? null : price}
                onChange={(value) => setPrice(value ?? "")}
              />
            </Form.Item>

            <Form.Item label="ملاحظات التسليم الجزئي (اختياري)">
              <Input.TextArea
                size="large"
                rows={2}
                placeholder="بعض ملاحظات التسليم الجزئي"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Form.Item>
          </div>
        </section>
      </Form>
    </Modal>
  );
};

export default AcceptModal;