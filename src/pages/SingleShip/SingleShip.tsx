/* eslint-disable @typescript-eslint/no-explicit-any */
import {  useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DispatchInterface from "../../types/DispatchInterface";
import { getSingleShip, getSingleShipOrdersByDate } from "../../store/shipSlice/shipSlice";
import { useDispatch, useSelector } from "react-redux";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import { DatePicker, DatePickerProps, Select, Skeleton } from "antd";
import OrderColumn from "../../helpers/columns/order-column";
import OrderFlow from "../../components/OrderFlow";
import PrintBills from "../../components/Bills/PrintBills";

const statusOptions = [
  { value: "الكل", label: "الكل" },
  { value: "معلق", label: "معلق" },
  { value: "قيد التشغيل", label: "قيد التشغيل" },
];
const SingleShip = () => {
  const { id } = useParams();
  const dispatch: DispatchInterface = useDispatch();
  const [isOrderFlowModalOpen, setIsOrderFlowModalOpen] = useState(false);
  const [updatesForOneOrder, setUpdatesForOneOrder] = useState([]);

  const {isWaitingForGetOrdersByDate , ordersByDate} = useSelector((state: any) => state.ship)

  console.log(ordersByDate , 'hi from news')
  const [choosenDate , setChoosenDate] = useState('')
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setChoosenDate(dateString)
  };

  useEffect(()=>{
    if(!choosenDate) return 
    dispatch(getSingleShipOrdersByDate({ url: `ship/date`, id: id , date : choosenDate , token}));
  } ,[choosenDate])

  const {token} = useSelector((state : any)=>state.auth)

  const [selectedShipOrders, setSelectedShipOrders] = useState([]);

  const { isWaitingForGetShip, ship } = useSelector((state: any) => state.ship);
  const { isPendingOrdersRequireRender } = useSelector(
    (state: any) => state.order
  );
  const [selectedStatus, setSelectedStatus] = useState("الكل");

  useEffect(() => {
    dispatch(getSingleShip({ url: `ship`, id: id ,   token}));
  }, [isPendingOrdersRequireRender, dispatch ,id , choosenDate]);

  useEffect(() => {
    if (!ship || !ship.orders || ship.orders.length === 0) return;
    setSelectedStatus("الكل");
   
    setSelectedShipOrders(ship.orders);
  }, [ship]);


  // when change state to display pending or running
  const changeShipHandler = (e: any) => {
    setSelectedStatus(e);
    if (e === "الكل") {
     
      setSelectedShipOrders(ship.orders);
    } else {
      const shipOrdersFromPending = ship.orders.filter(
        (order: any) => order.status == e
      );

      
      setSelectedShipOrders(shipOrdersFromPending);
    }
  };

  console.log(ordersByDate?.orders)
  return (
    <>
     
     <OrderFlow
        data={updatesForOneOrder}
        open={isOrderFlowModalOpen}
        onClose={() => setIsOrderFlowModalOpen(false)}
      />
      
      <>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h1 style={{ marginInlineStart: "20px" }}>
            {ship && ship.ship ? ship.ship.name : ""}
          </h1>
          <h3>{ship && ship.ship ? ship.ship.phone : ""}</h3>
        </div>

        {ship && ship.orders && ship.orders.length > 0 ? (
          <Select
            defaultValue="الكل"
            style={{ width: 200 }}
            options={statusOptions}
            value={selectedStatus}
            onChange={(e) => changeShipHandler(e)}
          />
        ) : null}

        {ship && ship.orders ? (
          <>
            <TableWrapper
              keyTerm="shipOrders"
              key={"shipOrders"}
              loading={isWaitingForGetShip}
              title={`جميع طلبات ${ship.ship.name}`}
              columns={OrderColumn({
                setIsOrderFlowModalOpen,
                setUpdatesForOneOrder,
              })}
              data={selectedShipOrders}
             
            />
          </>
        ) : null}
      </>
      <p>اختر التاريخ لعرض الطلبات في هذا اليوم</p> 
      <DatePicker style={{width : '100%'}} onChange={onChange} />
      {choosenDate && ordersByDate?.orders?.length > 0 ? (
          <>
          <PrintBills data={ordersByDate?.orders} ship={{label : ship?.ship?.name , phone : ship?.ship?.phone}} />
            <TableWrapper
              keyTerm="shipOrders"
              key={"shipOrdersByDate"}
              loading={isWaitingForGetOrdersByDate}
              title={`جميع طلبات ${ship?.ship?.name} في يوم ${choosenDate}` }
              columns={OrderColumn({
                setIsOrderFlowModalOpen,
                setUpdatesForOneOrder,
              })}
              data={ordersByDate?.orders}
             
            />
          </>
        ) : 
        isWaitingForGetOrdersByDate ? <Skeleton /> 
        :
        <p>لا يوجد طلبات في هذا اليوم</p>
        }
    </>
  );
};

export default SingleShip;
