/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input, Segmented, Skeleton, Typography } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuInbox, LuSearch } from "react-icons/lu";
import DispatchInterface from "../../types/DispatchInterface";
import {
  getOrdersByName,
  getOrdersByPhone,
  getSingleOrder,
  orderActions,
} from "../../store/orderSlice/orderSlice";
import FormatDate from "../../helpers/FormatDate/FormatDate";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import styles from "./searchOrder.module.scss";

const { Search } = Input;

type Mode = "order" | "phone" | "name";

const has = (o: any) => Boolean(o) && Object.keys(o).length > 0;
const dash = "—";

// ---------------------------------------------------------------
// Single order details
// ---------------------------------------------------------------
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className={styles.field}>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

const OrderDetails = ({ order }: { order: any }) => {
  const updates: any[] = order.updates ?? [];
  const lastOf = (info: string) => [...updates].reverse().find((u) => u.info === info);
  const running = lastOf("تم التشغيل");
  const delivered = lastOf("تم التسليم");

  const products: any[] = order.products ?? [];
  const address = [order.country, order.address].filter(Boolean).join(" / ");

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

        <Link to={`/orders/${order.id}`} className={styles.open}>
          فتح الطلب
        </Link>
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

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------
const columns: any = [
  { title: "رقم الطلب", dataIndex: "id", key: "id", search: true },
  { title: "اسم العميل", dataIndex: "name", key: "name", search: true },
  { title: "الحالة", dataIndex: "status", key: "status" },
  {
    title: "رقم الهاتف",
    dataIndex: "",
    key: "phone",
    render: (e: any) => (
      <Typography>{e.anotherPhone ? `${e.phone} / ${e.anotherPhone} ` : `${e.phone} `}</Typography>
    ),
  },
  { title: "سعر الطلب", dataIndex: "price", key: "price" },
  {
    title: "وقت الكتابة",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (e: any) => FormatDate(e),
  },
  {
    title: "وقت التشغيل",
    dataIndex: "updates",
    key: "updates",
    render: (e: any) => {
      const last = e && e.filter((u: any) => u.info === "تم التشغيل").pop();
      return last ? FormatDate(last.timestamp) : "---";
    },
  },
  { title: "المحافظة", dataIndex: "country", key: "country", search: true },
  { title: "العنوان", dataIndex: "address", key: "address" },
];

const SearchOrder = () => {
  const dispatch: DispatchInterface = useDispatch();
  const {
    singleOrder,
    isWaitingForGetSingleOrder,
    ordersByName,
    ordersByPhone,
    issWaitingForGetOrdersByPhone,
    issWaitingForGetOrdersByName,
  } = useSelector((state: any) => state.order);
  const { token } = useSelector((state: any) => state.auth);

  const [mode, setMode] = useState<Mode>("order");
  const [searched, setSearched] = useState(false);

  const modes: Record<Mode, { label: string; placeholder: string; loading: boolean; run: (v: string) => void }> = {
    order: {
      label: "رقم الطلب",
      placeholder: "اكتب رقم الطلب",
      loading: isWaitingForGetSingleOrder,
      run: (v) => dispatch(getSingleOrder({ url: "order/order", id: v, token })),
    },
    phone: {
      label: "رقم الهاتف",
      placeholder: "اكتب رقم هاتف العميل",
      loading: issWaitingForGetOrdersByPhone,
      run: (v) => dispatch(getOrdersByPhone({ url: "order/order/phone", id: v, token })),
    },
    name: {
      label: "اسم العميل",
      placeholder: "اكتب اسم العميل",
      loading: issWaitingForGetOrdersByName,
      run: (v) => dispatch(getOrdersByName({ url: "order/order/name", id: v, token })),
    },
  };
  const current = modes[mode];
  const isLoading = Object.values(modes).some((m) => m.loading);

  const searchHandler = (value: string) => {
    const term = value.trim();
    if (!term) return;
    dispatch(orderActions.clearOrderSearch()); // so results of an earlier search type never linger
    setSearched(true);
    current.run(term);
  };

  useEffect(() => {
    return () => {
      dispatch(orderActions.clearOrderSearch());
    };
  }, [dispatch]);

  const hasSingle = has(singleOrder);
  const hasPhone = ordersByPhone && ordersByPhone.length > 0;
  const hasName = ordersByName && ordersByName.length > 0;

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>البحث عن طلب</h2>

        <div className={styles.panel}>
          <Segmented
            className={styles.modes}
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            options={(Object.keys(modes) as Mode[]).map((key) => ({
              label: modes[key].label,
              value: key,
            }))}
          />
          <Search
            key={mode}
            className={styles.search}
            size="large"
            allowClear
            enterButton="بحث"
            placeholder={current.placeholder}
            loading={current.loading}
            onSearch={searchHandler}
          />
        </div>
      </section>

      <section className={styles.section}>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : hasSingle ? (
          <>
            <h2 className={styles.sectionTitle}>تفاصيل الطلب</h2>
            <OrderDetails order={singleOrder} />
          </>
        ) : hasPhone ? (
          <>
            <h2 className={styles.sectionTitle}>
              النتائج<span className={styles.count}>{ordersByPhone.length}</span>
            </h2>
            <TableWrapper
              keyTerm="orderByPhone"
              key="orderByPhone"
              loading={issWaitingForGetOrdersByPhone}
              title="جميع الطلبات التي تحتوي علي رقم الهاتف المكتوب"
              columns={columns}
              data={ordersByPhone}
              isExpand={true}
            />
          </>
        ) : hasName ? (
          <>
            <h2 className={styles.sectionTitle}>
              النتائج<span className={styles.count}>{ordersByName.length}</span>
            </h2>
            <TableWrapper
              keyTerm="orderByName"
              key="orderByName"
              loading={issWaitingForGetOrdersByName}
              title="جميع الطلبات التي تحتوي علي اسم العميل المكتوب"
              columns={columns}
              data={ordersByName}
              isExpand={true}
            />
          </>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>{searched ? <LuInbox /> : <LuSearch />}</span>
            <strong className={styles.emptyTitle}>
              {searched ? "لا توجد طلبات مطابقة" : "ابدأ بالبحث عن طلب"}
            </strong>
            <span className={styles.emptyHint}>
              {searched
                ? "تأكد من القيمة التي كتبتها أو جرّب نوع بحث آخر."
                : "اختر نوع البحث ثم اكتب القيمة واضغط «بحث»."}
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchOrder;