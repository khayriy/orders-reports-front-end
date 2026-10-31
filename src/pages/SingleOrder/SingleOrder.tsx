/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Skeleton } from "antd";
import { ArrowRightOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { LuInbox } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import { getSingleOrder, orderActions } from "../../store/orderSlice/orderSlice";
import FormatDate from "../../helpers/FormatDate/FormatDate";
import ExpandPendingOrders from "../../components/ExpandPendingOrders/ExpandPendingOrders";
import styles from "./singleOrder.module.scss";

const dash = "—";
const has = (o: any) => Boolean(o) && Object.keys(o).length > 0;

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className={styles.field}>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

const SingleOrder = () => {
  const dispatch: DispatchInterface = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useSelector((state: any) => state.auth);
  const { singleOrder, isWaitingForGetSingleOrder, isSingleOrderRequireRender } = useSelector(
    (state: any) => state.order
  );

  const [isUpdate, setIsUpdate] = useState(false);
  const editRef = useRef<HTMLElement>(null);

  useEffect(() => {
    dispatch(getSingleOrder({ url: "order/order", id: id, token }));
  }, [id, isSingleOrderRequireRender, dispatch, token]);

  useEffect(() => {
    return () => {
      dispatch(orderActions.clearOrderSearch());
    };
  }, [dispatch]);

  // bring the edit panel into view when it opens
  useEffect(() => {
    if (isUpdate) editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isUpdate]);

  // ---- values shown below ----
  const updates: any[] = singleOrder?.updates ?? [];
  const lastOf = (info: string) => [...updates].reverse().find((u) => u.info === info);
  const runningTime = lastOf("تم التشغيل");
  const deliverTime = lastOf("تم التسليم");
  const products: any[] = singleOrder?.products ?? [];
  const address = [singleOrder?.country, singleOrder?.address].filter(Boolean).join(" / ");

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>
        <ArrowRightOutlined />
        رجوع
      </button>

      {isWaitingForGetSingleOrder ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : has(singleOrder) ? (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>تفاصيل الطلب</h2>

            <div className={styles.details}>
              {/* summary strip: number, status, price, edit */}
              <div className={styles.summary}>
                <div className={styles.summaryMain}>
                  <span className={styles.summaryLabel}>رقم الطلب</span>
                  <strong className={styles.orderId}>{singleOrder.id}</strong>
                </div>

                <span className={styles.status}>{singleOrder.status || dash}</span>

                <div className={styles.summaryPrice}>
                  <span className={styles.summaryLabel}>سعر الطلب</span>
                  <strong className={styles.price}>{singleOrder.price ?? dash}</strong>
                </div>

                <button
                  type="button"
                  className={styles.action}
                  data-variant={isUpdate ? "ghost" : "primary"}
                  aria-expanded={isUpdate}
                  onClick={() => setIsUpdate((e: boolean) => !e)}
                >
                  {isUpdate ? <CloseOutlined /> : <EditOutlined />}
                  {isUpdate ? "إغلاق التعديل" : "تعديل"}
                </button>
              </div>

              <div className={styles.grid}>
                <section className={styles.card}>
                  <h3 className={styles.cardTitle}>بيانات العميل</h3>
                  <dl className={styles.list}>
                    <Field label="اسم العميل">{singleOrder.name || dash}</Field>
                    <Field label="هاتف العميل">
                      {singleOrder.phone || dash}
                      {singleOrder.anotherPhone ? ` / ${singleOrder.anotherPhone}` : ""}
                    </Field>
                    <Field label="عنوان العميل">{address || dash}</Field>
                  </dl>
                </section>

                <section className={styles.card}>
                  <h3 className={styles.cardTitle}>الشحن والتوقيت</h3>
                  <dl className={styles.list}>
                    <Field label="مسئول الشحن">{singleOrder.ship?.name || dash}</Field>
                    <Field label="وقت الكتابة">
                      {singleOrder.createdAt ? FormatDate(singleOrder.createdAt) : dash}
                    </Field>
                    <Field label="وقت التشغيل">{runningTime ? FormatDate(runningTime.timestamp) : dash}</Field>
                    <Field label="وقت التسليم">{deliverTime ? FormatDate(deliverTime.timestamp) : dash}</Field>
                  </dl>
                </section>
              </div>

              <section className={styles.card}>
                <h3 className={styles.cardTitle}>المنتجات</h3>
                {products.length > 0 ? (
                  <ul className={styles.products}>
                    {products.map((pro: any, i: number) => (
                      <li key={i}>
                        <span className={styles.qty}>{pro.product?.quantity}</span>
                        <span>
                          {pro.product?.name}
                          {pro.product?.type ? ` / ${pro.product.type.name}` : ""}
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
                    {updates.map((e: any, i: number) => (
                      <li key={i}>
                        <strong>{e.info ? e.info : dash}</strong>
                        <time>{FormatDate(e.timestamp)}</time>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <span className={styles.muted}>لا يوجد تعديلات</span>
                )}
              </section>
            </div>
          </section>

          {isUpdate && (
            <section ref={editRef} className={styles.section}>
              <h2 className={styles.sectionTitle}>تعديل الطلب</h2>
              <div className={styles.edit}>
                <ExpandPendingOrders record={singleOrder} />
              </div>
            </section>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <LuInbox />
          </span>
          <strong className={styles.emptyTitle}>لا يوجد طلب متوافق</strong>
          <span className={styles.emptyHint}>تأكد من رقم الطلب في الرابط أو ارجع وحاول مرة أخرى.</span>
        </div>
      )}
    </div>
  );
};

export default SingleOrder;