/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import PrintBills from "../../components/Bills/PrintBills";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePendingOrder,
  getAllPendingOrders,
  updateOrdersToRun,
} from "../../store/orderSlice/orderSlice";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import { Button, Select } from "antd";
import LoadingPage from "../LoadingPage/LoadingPage";
import OrderColumn from "../../helpers/columns/order-column";
import OrderFlow from "../../components/OrderFlow";


const BillsPage = () => {

  const [isOrderFlowModalOpen , setIsOrderFlowModalOpen] = useState(false) 
    const [updatesForOneOrder , setUpdatesForOneOrder] = useState([])
  const { token } = useSelector((state: any) => state.auth);

  const {
    isWaitingForRunOrders,
    isPendingOrdersRequireRender,
    pendingOrders,
    isWaitingForGetPendingOrders,
    isWaitingForDeleteOrder,
  } = useSelector((state: any) => state.order);
  const dispatch: DispatchInterface = useDispatch();
  // state for mange all ships and filter them
  const [ships, setShips]: any = useState([]);
  const [selectedShip, setSelectedShip] = useState("الكل");
  const [selectedShipOrders, setSelectedShipOrders] = useState([]);

  // set ships when orders come to display list for each ship responsible
  //useEffect to rest select ship when ever ships change
  useEffect(() => {
    if (!pendingOrders || pendingOrders.length === 0) return;
    {
      const format = pendingOrders.map(({ ship }: any) => {
        return { label: ship.name, value: ship._id, phone: ship.phone };
      });
      const uniqueSet = new Set(format.map(JSON.stringify));

      // Convert the set back to an array
      const uniqueArray = Array.from(uniqueSet).map((item) =>
        JSON.parse(item as string)
      );
      setShips(() => {
        return [{ value: "الكل", label: "الكل" }, ...uniqueArray];
      });
      setSelectedShip("الكل");
    }
  }, [pendingOrders]);

  useEffect(() => {
    dispatch(getAllPendingOrders({ url: "order/pending", token }));
  }, [isPendingOrdersRequireRender, dispatch]);

  useEffect(() => {
    if (!pendingOrders) return;

    setSelectedShipOrders(pendingOrders);
  }, [pendingOrders]);

  const confirmDelete = (id: string) => {
    dispatch(
      deletePendingOrder({
        url: `order/order/${id}`,

        toastMessage: "تم جذف الطلب بنجاح",
        token,
      })
    );
  };


  // handle change ship to dispalay just his order
  const changeShipHandler = (e: any) => {
    setSelectedShip(e);
    if (e === "الكل") {
      setSelectedShipOrders(pendingOrders);
    } else {
      const shipOrdersFromPending = pendingOrders.filter(
        (order: { ship: { _id: any } }) => order.ship?._id == e
      );

      setSelectedShipOrders(shipOrdersFromPending);
    }
  };

  const runOrdersHandler = () => {
    const ids =
      pendingOrders &&
      pendingOrders.map(({ _id }: any) => {
        return _id;
      });

    dispatch(
      updateOrdersToRun({
        toastMessage:
          "تم تغير حالة الطلبات لقيد التشغيل يمكنك الان المتابعة مع مسئولي الشحن",
        data: { orders: ids },

        url: "/order/run",
        token,
      })
    );
  };

  return (
    <>
      <OrderFlow data={updatesForOneOrder} open={isOrderFlowModalOpen} onClose={()=>setIsOrderFlowModalOpen(false)}/>

      {isWaitingForRunOrders ? <LoadingPage /> : null}

      {pendingOrders && pendingOrders.length > 0 ? (
        <div
          style={{
            margin: "5px 0px",
            display: "flex",
            width: "100%",
            gap: "4px",
          }}
        >
          <Select
            defaultValue="الكل"
            style={{ width: 200 }}
            options={ships}
            value={selectedShip}
            onChange={(e) => changeShipHandler(e)}
          />
          {selectedShip === "الكل" ? null : (
            <PrintBills
              data={selectedShipOrders}
              ship={
                ships.length > 0
                  ? ships.find((e: any) => e.value == selectedShip)
                  : ""
              }
            />
          )}

          <Button
            onClick={runOrdersHandler}
            style={{ marginInlineStart: "auto" }}
            type="link"
          >
            تشغيل طلبات
          </Button>
        </div>
      ) : null}

      <TableWrapper
        keyTerm="pending"
        key={"pending"}
        loading={isWaitingForGetPendingOrders}
        title="جميع الطلبات المعلقة"
        columns={OrderColumn({setIsOrderFlowModalOpen , setUpdatesForOneOrder  , deleteAble : true , isWaitingForDeleteOrder , confirmDelete})}
        data={selectedShipOrders}
      />
    </>
  );
};
export default BillsPage;
