/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { LuInbox, LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import OrderFlow from "../../components/OrderFlow";
import PrintBills from "../../components/Bills/PrintBills";
import OrderColumn from "../../helpers/columns/order-column";
import DispatchInterface from "../../types/DispatchInterface";
import {
  getAllOrdersByIds,
  ordersByIdsActions,
} from "../../store/ordersByIdsSlice/ordersByIdsSlice";
import styles from "./reports.module.scss";

const ReportsPage = () => {
  const dispatch: DispatchInterface = useDispatch();
  const { isWaitingForGetOrders, ordersByIds } = useSelector((state: any) => state.ordersByIds);
  const { token } = useSelector((state: any) => state.auth);

  const [isOrderFlowModalOpen, setIsOrderFlowModalOpen] = useState(false);
  const [updatesForOneOrder, setUpdatesForOneOrder] = useState([]);
  const [orders, setOrders] = useState("");
  const [searched, setSearched] = useState(false);

  const results: any[] = ordersByIds ?? [];

  // one id per line: trimmed, no blanks, no repeats
  const { ids, duplicates } = useMemo(() => {
    const lines = orders
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(lines));
    return { ids: unique, duplicates: lines.length - unique.length };
  }, [orders]);

  const updateHandler = () => {
    if (results.length > 0) dispatch(ordersByIdsActions.clearOrders());
    setSearched(true);
    dispatch(
      getAllOrdersByIds({
        url: "order/ids",
        toastMessage: "تم استرجاع الطلبات المتوافقة",
        data: { orders: ids },
        clearForm: () => {}, // keep the list visible next to its results
        token,
      })
    );
  };

  const resetHandler = () => {
    setOrders("");
    setSearched(false);
    dispatch(ordersByIdsActions.clearOrders());
  };

  useEffect(() => {
    return () => {
      dispatch(ordersByIdsActions.clearOrders());
    };
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>البحث بأرقام الطلبات</h2>

        <Form layout="vertical" className={styles.panel} onFinish={updateHandler}>
          <div className={styles.input}>
            <Form.Item label="أرقام الطلبات" required className={styles.field}>
              <Input.TextArea
                value={orders}
                onChange={(e) => setOrders(e.target.value)}
                placeholder="اكتب ارقام الطلبات على ان يكون كل رقم في سطر"
                autoSize={{ minRows: 6, maxRows: 14 }}
              />
            </Form.Item>
          </div>

          <aside className={styles.side}>
            <div className={styles.summary}>
              <strong className={styles.number}>{ids.length.toLocaleString("en-US")}</strong>
              <span className={styles.numberLabel}>رقم طلب سيتم البحث عنه</span>
              {duplicates > 0 && (
                <span className={styles.note}>
                  تم تجاهل {duplicates.toLocaleString("en-US")} رقم مكرر
                </span>
              )}
            </div>

            <div className={styles.actions}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                disabled={isWaitingForGetOrders || ids.length === 0}
                loading={isWaitingForGetOrders}
                className={styles.submit}
              >
                اظهار النتائج
              </Button>
              <Button
                onClick={resetHandler}
                disabled={isWaitingForGetOrders || (!orders && results.length === 0)}
                className={styles.reset}
              >
                مسح
              </Button>
            </div>
          </aside>
        </Form>
      </section>

      <section className={styles.section}>
        <div className={styles.head}>
          <h2 className={styles.sectionTitle}>
            النتائج
            {!isWaitingForGetOrders && results.length > 0 && (
              <span className={styles.count}>{results.length}</span>
            )}
          </h2>
          {!isWaitingForGetOrders && results.length > 0 && (
            <PrintBills data={results} ship={""} />
          )}
        </div>

        {isWaitingForGetOrders ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : results.length > 0 ? (
          <TableWrapper
            keyTerm="shipOrders"
            key="shipOrders"
            title={`جميع الطلبات المتوافقة (${results.length})`}
            columns={OrderColumn({ setIsOrderFlowModalOpen, setUpdatesForOneOrder })}
            data={results}
            loading={isWaitingForGetOrders}
          />
        ) : searched ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <LuInbox />
            </span>
            <strong className={styles.emptyTitle}>لا توجد طلبات مطابقة</strong>
            <span className={styles.emptyHint}>تأكد من الأرقام التي أدخلتها ثم حاول مرة أخرى.</span>
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <LuSearch />
            </span>
            <strong className={styles.emptyTitle}>ستظهر النتائج هنا</strong>
            <span className={styles.emptyHint}>أدخل أرقام الطلبات ثم اضغط «اظهار النتائج».</span>
          </div>
        )}
      </section>

      <OrderFlow
        data={updatesForOneOrder}
        open={isOrderFlowModalOpen}
        onClose={() => setIsOrderFlowModalOpen(false)}
      />
    </div>
  );
};

export default ReportsPage;