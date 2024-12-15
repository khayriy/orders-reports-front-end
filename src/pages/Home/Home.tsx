/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import Statistics from "../../components/Statistics/Statistics";
import { useEffect, useState } from "react";
import DispatchInterface from "../../types/DispatchInterface";
import { geOrdersCount } from "../../store/orderSlice/orderSlice";
import FilterTable from "../../components/FilterTable/FilterTable";
import { Skeleton } from "antd";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import OrderColumn from "../../helpers/columns/order-column";
import OrderFlow from "../../components/OrderFlow";
const Home = () => {
  const { permissions, roleName, isUserLogIn, token } = useSelector(
    (state: any) => state.auth
  );

  console.log(permissions, roleName, isUserLogIn, token);
  const { counts, isWaitingForGetCount } = useSelector(
    (state: any) => state.order
  );
  const dispatch: DispatchInterface = useDispatch();

  useEffect(() => {
    dispatch(geOrdersCount({ url: "order/count", token }));
  }, [dispatch]);

  const { isWaitingForGetOrdersWithFilter, filterOrders } = useSelector(
    (state: any) => state.order
  );

  const [isOrderFlowModalOpen, setIsOrderFlowModalOpen] = useState(false);
  const [updatesForOneOrder, setUpdatesForOneOrder] = useState([]);

  return (
    <>
      <OrderFlow
        data={updatesForOneOrder}
        open={isOrderFlowModalOpen}
        onClose={() => setIsOrderFlowModalOpen(false)}
      />

      <Statistics
        pending={counts && counts.pending ? counts.pending : 0}
        part={counts && counts.part ? counts.part : 0}
        deliver={counts && counts.deliver ? counts.deliver : 0}
        back={counts && counts.back ? counts.back : 0}
        loading={isWaitingForGetCount}
      />
      <FilterTable />
      {isWaitingForGetOrdersWithFilter ? (
        <Skeleton />
      ) : filterOrders.length > 0 ? (
        <TableWrapper
          keyTerm="shipOrders"
          key={"shipOrders"}
          loading={isWaitingForGetOrdersWithFilter}
          title="جميع الطلبات المتوافقة"
          columns={OrderColumn({
            setIsOrderFlowModalOpen,
            setUpdatesForOneOrder,
          })}
          data={filterOrders}
        />
      ) : (
        <h3 style={{ textAlign: "center", marginTop: "20px" }}>
          لايوجد طلبات لعرضها
        </h3>
      )}
    </>
  );
};
export default Home;
