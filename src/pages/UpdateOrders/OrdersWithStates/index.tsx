/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CloseOutlined, ExclamationOutlined, LeftOutlined } from "@ant-design/icons";
import { orderActions } from "../../../store/orderSlice/orderSlice";
import styles from "./ordersWithStates.module.scss";

const NOT_REGISTERED = "غير مسجل";

const OrdersWithStates = () => {
  const { ordersWithStates } = useSelector((state: any) => state.order);
  const dispatch = useDispatch();
  const ref = useRef<HTMLElement>(null);
  const list: any[] = ordersWithStates ?? [];

  useEffect(() => {
    return () => {
      dispatch(orderActions.clearOrdersWithStates());
    };
  }, [dispatch]);

  // bring the panel into view when results arrive after submitting
  useEffect(() => {
    if (list.length > 0) ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [list.length]);

  if (list.length === 0) return null;

  return (
    <section ref={ref} className={styles.panel} role="alert">
      <header className={styles.head}>
        <span className={styles.icon} aria-hidden>
          <ExclamationOutlined />
        </span>
        <div className={styles.text}>
          <h2 className={styles.title}>
            راجع هذه الطلبات أولا
            <span className={styles.count}>{list.length}</span>
          </h2>
          <span className={styles.hint}>افتح الطلب للاطلاع على حالته الحالية.</span>
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label="إخفاء"
          onClick={() => dispatch(orderActions.clearOrdersWithStates())}
        >
          <CloseOutlined />
        </button>
      </header>

      <ul className={styles.list}>
        {list.map((e: any, i: number) => {
          const content = (
            <>
              <strong className={styles.id}>{e?.id ?? ""}</strong>
              {e?.status && <span className={styles.status}>{e.status}</span>}
              {e?.message && <span className={styles.message}>{e.message}</span>}
            </>
          );
          return (
            <li key={`${e?.id}-${i}`}>
              {e?.status === NOT_REGISTERED ? (
                <div className={styles.row}>{content}</div>
              ) : (
                <Link to={`/orders/${e?.id ?? ""}`} className={cls(styles.row, styles.link)}>
                  {content}
                  <LeftOutlined className={styles.arrow} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const cls = (...c: string[]) => c.join(" ");

export default OrdersWithStates;