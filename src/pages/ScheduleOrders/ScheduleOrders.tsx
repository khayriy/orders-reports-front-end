/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteScheduleOrder,
  getAllScheduleOrders,
} from "../../store/orderSlice/orderSlice";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import LoadingPage from "../LoadingPage/LoadingPage";

import OrderColumn from "../../helpers/columns/order-column";
import OrderFlow from "../../components/OrderFlow";


const ScheduleOrders = () => {
  const { token } = useSelector((state: any) => state.auth);

  const [isOrderFlowModalOpen, setIsOrderFlowModalOpen] = useState(false);
  const [updatesForOneOrder, setUpdatesForOneOrder] = useState([]);
  const {
    isWaitingForDeleteScheduleOrder,
    isScheduleOrdersRequireRender,
    isWaitingForScheduleOrders,
    scheduleOrdersDB,
  } = useSelector((state: any) => state.order);
  const dispatch: DispatchInterface = useDispatch();
  // state for mange all ships and filter them

  // set ships when orders come to display list for each ship responsible
  //useEffect to rest select ship when ever ships change

  useEffect(() => {
    dispatch(getAllScheduleOrders({ url: "order/scheduling", token }));
  }, [isScheduleOrdersRequireRender, dispatch, token]);

  const confirmDelete = (id: string) => {
    dispatch(
      deleteScheduleOrder({
        url: `order/order/${id}`,

        toastMessage: "تم جذف الطلب بنجاح",
        token,
      })
    );
  };

 

  return (
    <>
      <OrderFlow
        data={updatesForOneOrder}
        open={isOrderFlowModalOpen}
        onClose={() => setIsOrderFlowModalOpen(false)}
      />

      {isWaitingForScheduleOrders ? <LoadingPage /> : null}
      <TableWrapper
        keyTerm="pending"
        key={"pending"}
        loading={isWaitingForScheduleOrders}
        title="جميع الطلبات المجدولة"
        columns={OrderColumn({
          setIsOrderFlowModalOpen,
          setUpdatesForOneOrder,
          deleteAble: true,
          isWaitingForDeleteOrder: isWaitingForDeleteScheduleOrder,
          confirmDelete,
        })}
        data={scheduleOrdersDB}
      />
    </>
  );
};
export default ScheduleOrders;
