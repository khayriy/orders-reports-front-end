/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Badge, Button, Descriptions } from "antd";
import { Skeleton } from "antd";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleOrder,
  orderActions,
} from "../../store/orderSlice/orderSlice";
import type { DescriptionsProps } from "antd";
import FormatDate from "../../helpers/FormatDate/FormatDate";
import { useParams } from "react-router-dom";
import ExpandPendingOrders from "../../components/ExpandPendingOrders/ExpandPendingOrders";
const SingleOrder = () => {
  
  const {token} = useSelector((state : any)=>state.auth)
  const { id } = useParams();
  const [isUpdate, setIsUpdate] = useState(false);
  const dispatch: DispatchInterface = useDispatch();
  const { singleOrder, isWaitingForGetSingleOrder , isSingleOrderRequireRender } = useSelector(
    (state: any) => state.order
  );

  useEffect(() => {
    dispatch(getSingleOrder({ url: "order/order", id: id , token }));
  }, [id , isSingleOrderRequireRender , dispatch]);
  const runningTime =
    singleOrder &&
    Object.keys(singleOrder).length > 0 &&
    singleOrder.updates.filter((e: any) => e.info === "تم التشغيل").pop();

  const deliverTime =
    singleOrder &&
    Object.keys(singleOrder).length > 0 &&
    singleOrder.updates.filter((e: any) => e.info === "تم التسليم").pop();

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "المنتجات",
      span: 3,
      children:
        singleOrder && Object.keys(singleOrder).length > 0
          ? singleOrder.products
              .map((pro: any) => {
                if (pro.product.type) {
                  return `${pro.product.quantity} - ${pro.product.name} / ${pro.product.type.name}`;
                } else {
                  return `${pro.product.quantity} - ${pro.product.name} `;
                }
              })
              .toString()
          : "",
    },
    {
      key: "2",
      label: "اسم العميل",
      children: Object.keys(singleOrder).length > 0 ? `${singleOrder.name}` : "",
    },
    {
      key: "3",
      label: "هاتف العميل",
      children: `${Object.keys(singleOrder).length > 0 ? singleOrder.phone : ""}`,
    },
    {
      key: "4",
      label: "عنوان العميل",
      children: Object.keys(singleOrder).length > 0 ? ` ${singleOrder.country} / ${singleOrder.address}` : ""
      
    },
    {
      key: "5",
      label: "وقت الكتابة",
      children:
        Object.keys(singleOrder).length > 0
          ? FormatDate(singleOrder.createdAt)
          : "----",
    },
    {
      key: "6",
      label: "وقت التشغيل",
      children: runningTime ? FormatDate(runningTime.timestamp) : "----",
    },
    {
      key: "6",
      label: "وقت التسليم",
      children: deliverTime ? FormatDate(deliverTime.timestamp) : "----",
    },
    {
      key: "7",
      label: "مسئول الشحن",
      children:
        singleOrder && Object.keys(singleOrder).length > 0
          ? singleOrder.ship.name
          : "----",
    },
    {
      key: "8",
      label: "الحالة",
      children: (
        <Badge
          status="processing"
          text={
            Object.keys(singleOrder).length > 0 ? singleOrder.status : "---"
          }
        />
      ),
    },
    {
      key: "9",
      label: "سعر الطلب",
      children: Object.keys(singleOrder).length > 0 ? singleOrder.price : "---",
    },

    {
      key: "10",
      span: 3,
      label: "التعديلات",
      children: (
        <>
          {Object.keys(singleOrder).length > 0 &&
          singleOrder.updates.length > 0 ? (
            singleOrder.updates.map((e: any) => {
              return (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <p>{e.info ? e.info : "-----"}</p>
                  <p>{FormatDate(e.timestamp)}</p>
                </div>
              );
            })
          ) : (
            <h3>لا يوجد تعديلات</h3>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    return () => {
      dispatch(orderActions.clearOrderSearch());
    };
  }, [dispatch]);
  return (
    <>
      {isWaitingForGetSingleOrder ? (
        <Skeleton />
      ) : singleOrder && Object.keys(singleOrder).length > 0 ? (
        <>
          <Descriptions
            style={{ margin: "10px" }}
            title="تفاصيل الطلب"
            layout="vertical"
            bordered
            items={items}
          />
          <Button
            onClick={() => setIsUpdate((e: boolean) => !e)}
            type="primary"
            style={{ margin: "20px" }}
          >
            تعديل
          </Button>

          {isUpdate ? <ExpandPendingOrders record={singleOrder} /> : null}
        </>
      ) : 
      <h3>لا يوجد طلب متوافق</h3>
      }
    </>
  );
};
export default SingleOrder;
