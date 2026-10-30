/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";
import { LuInbox } from "react-icons/lu";
import Statistics from "../../components/Statistics/Statistics";
import FilterTable from "../../components/FilterTable/FilterTable";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import OrderFlow from "../../components/OrderFlow";
import OrderColumn from "../../helpers/columns/order-column";
import DispatchInterface from "../../types/DispatchInterface";
import { geOrdersCount } from "../../store/orderSlice/orderSlice";
import styles from "./home.module.scss";

const Home = () => {
  const { token } = useSelector((state: any) => state.auth);
  const { counts, isWaitingForGetCount, isWaitingForGetOrdersWithFilter, filterOrders } =
    useSelector((state: any) => state.order);
  const dispatch: DispatchInterface = useDispatch();

  const [isOrderFlowModalOpen, setIsOrderFlowModalOpen] = useState(false);
  const [updatesForOneOrder, setUpdatesForOneOrder] = useState([]);

  useEffect(() => {
    dispatch(geOrdersCount({ url: "order/count", token }));
  }, [dispatch, token]);

  const results: any[] = filterOrders ?? [];

  return (
    <div className={styles.home}>
      <OrderFlow
        data={updatesForOneOrder}
        open={isOrderFlowModalOpen}
        onClose={() => setIsOrderFlowModalOpen(false)}
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>نظرة عامة</h2>
        <Statistics
          pending={counts?.pending ?? 0}
          part={counts?.part ?? 0}
          deliver={counts?.deliver ?? 0}
          back={counts?.back ?? 0}
          loading={isWaitingForGetCount}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          الطلبات
          {!isWaitingForGetOrdersWithFilter && results.length > 0 && (
            <span className={styles.count}>{results.length}</span>
          )}
        </h2>

        <FilterTable />

        {isWaitingForGetOrdersWithFilter ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : results.length > 0 ? (
          <TableWrapper
            keyTerm="shipOrders"
            key="shipOrders"
            loading={isWaitingForGetOrdersWithFilter}
            title="جميع الطلبات المتوافقة"
            columns={OrderColumn({ setIsOrderFlowModalOpen, setUpdatesForOneOrder })}
            data={results}
          />
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <LuInbox />
            </span>
            <strong className={styles.emptyTitle}>لا توجد طلبات لعرضها</strong>
            <span className={styles.emptyHint}>جرّب تغيير خيارات التصفية أعلاه.</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;