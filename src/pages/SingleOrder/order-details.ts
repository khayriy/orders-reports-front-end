/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import FormatDate from "../../helpers/FormatDate/FormatDate";
import styles from "./orderDetails.module.scss";

const dash = "—";

interface Action {
  label: string;
  icon?: ReactNode;
  /** renders a link */
  to?: string;
  /** renders a button */
  onClick?: () => void;
  /** secondary look, e.g. while an edit panel is open */
  active?: boolean;
}

interface Props {
  order: any;
  /** the one main action for this order (open it, edit it...) */
  action?: Action;
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className={styles.field}>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

const OrderDetails = ({ order, action }: Props) => {
  const updates: any[] = order.updates ?? [];
  const lastOf = (info: string) => [...updates].reverse().find((u) => u.info === info);
  const running = lastOf("تم التشغيل");
  const delivered = lastOf("تم التسليم");

  const products: any[] = order.products ?? [];
  const address = [order.country, order.address].filter(Boolean).join(" / ");

  const actionContent = action && (
    <>
      {action.icon}
      {action.label}
    </>
  );

  return (
    <div className={styles.details}>
      <div className={styles.summary}>
        <div className={styles.summaryMain}>
          <span className={styles.summaryLabel}>رقم الطلب</span>
          <strong className={styles.orderId}>{order.id}</strong>
        </div>

        <span className={styles.status}>{order.status || dash}</span>

        <div className={styles.summaryPrice}>
          <span className={styles.summaryLabel}>سعر الطلب</span>
          <strong className={styles.price}>{order.price ?? dash}</strong>
        </div>

        {action &&
          (action.to ? (
            <Link to={action.to} className={styles.action} data-variant={action.active ? "ghost" : "primary"}>
              {actionContent}
            </Link>
          ) : (
            <button
              type="button"
              className={styles.action}
              data-variant={action.active ? "ghost" : "primary"}
              aria-expanded={action.active}
              onClick={action.onClick}
            >
              {actionContent}
            </button>
          ))}
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>بيانات العميل</h3>
          <dl className={styles.list}>
            <Field label="اسم العميل">{order.name || dash}</Field>
            <Field label="هاتف العميل">
              {order.phone || dash}
              {order.anotherPhone ? ` / ${order.anotherPhone}` : ""}
            </Field>
            <Field label="عنوان العميل">{address || dash}</Field>
          </dl>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>الشحن والتوقيت</h3>
          <dl className={styles.list}>
            <Field label="مسئول الشحن">{order.ship?.name || dash}</Field>
            <Field label="وقت الكتابة">{order.createdAt ? FormatDate(order.createdAt) : dash}</Field>
            <Field label="وقت التشغيل">{running ? FormatDate(running.timestamp) : dash}</Field>
            <Field label="وقت التسليم">{delivered ? FormatDate(delivered.timestamp) : dash}</Field>
          </dl>
        </section>
      </div>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>المنتجات</h3>
        {products.length > 0 ? (
          <ul className={styles.products}>
            {products.map((p: any, i: number) => (
              <li key={i}>
                <span className={styles.qty}>{p.product?.quantity}</span>
                <span>
                  {p.product?.name}
                  {p.product?.type ? ` / ${p.product.type.name}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <span className={styles.muted}>لا توجد منتجات</span>
        )}
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>التعديلات</h3>
        {updates.length > 0 ? (
          <ol className={styles.timeline}>
            {updates.map((u: any, i: number) => (
              <li key={i}>
                <strong>{u.info || dash}</strong>
                <time>{FormatDate(u.timestamp)}</time>
              </li>
            ))}
          </ol>
        ) : (
          <span className={styles.muted}>لا يوجد تعديلات</span>
        )}
      </section>
    </div>
  );
};

export default OrderDetails;