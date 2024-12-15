/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import { getAllRunningOrders } from "../../store/orderSlice/orderSlice";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import LoadingPage from "../LoadingPage/LoadingPage";
import OrderFlow from "../../components/OrderFlow";
import OrderColumn from "../../helpers/columns/order-column";

const RunningOrders = () => {
  const [isOrderFlowModalOpen, setIsOrderFlowModalOpen] = useState(false);
  const [updatesForOneOrder, setUpdatesForOneOrder] = useState([]);
  const {
    isWaitingForRunOrders,
    isPendingOrdersRequireRender,
    runningOrders,
    isWaitingForGetPendingOrders,
  } = useSelector((state: any) => state.order);
  const dispatch: DispatchInterface = useDispatch();

  const {token} = useSelector((state : any)=>state.auth)

  useEffect(() => {
    dispatch(getAllRunningOrders({ url: "order/running" , token }));
  }, [isPendingOrdersRequireRender, dispatch]);

 
  return (
    <>
     <OrderFlow
        data={updatesForOneOrder}
        open={isOrderFlowModalOpen}
        onClose={() => setIsOrderFlowModalOpen(false)}
      />
      {isWaitingForRunOrders ? <LoadingPage /> : null}
      <TableWrapper
        keyTerm="shipOrders"
        key={"shipOrders"}
        loading={isWaitingForGetPendingOrders}
        title="جميع الطلبات قيد التشغيل"
        columns={OrderColumn({
          setIsOrderFlowModalOpen,
          setUpdatesForOneOrder,
        })}
        data={runningOrders}
      />
    </>
  );
};
export default RunningOrders;
