/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Badge, Descriptions } from "antd";
import { Skeleton } from "antd";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import { getSingleOrderView } from "../../store/orderSlice/orderSlice";
import type { DescriptionsProps } from "antd";
import FormatDate from "../../helpers/FormatDate/FormatDate";
import { useParams } from "react-router-dom";
const ViewOrder = () => {
  const { id } = useParams();

  const {token} = useSelector((state : any)=> state.auth)

  const dispatch: DispatchInterface = useDispatch();
  const { singleOrderView, isWaitingForGetSingleOrderView } = useSelector(
    (state: any) => state.order
  );

  useEffect(() => {
    dispatch(getSingleOrderView({ url: "order/order", id: id , token }));
  }, [id, dispatch]);
  const runningTime =
    singleOrderView &&
    Object.keys(singleOrderView).length > 0 &&
    singleOrderView.updates.filter((e: any) => e.info === "تم التشغيل").pop();

  const deliverTime =
    singleOrderView &&
    Object.keys(singleOrderView).length > 0 &&
    singleOrderView.updates.filter((e: any) => e.info === "تم التسليم").pop();

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "المنتجات",
      span: 3,
      children:
        singleOrderView && Object.keys(singleOrderView).length > 0
          ? singleOrderView.products
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
      children: `${singleOrderView.name}`,
    },
    {
      key: "3",
      label: "هاتف العميل",
      children: `${singleOrderView.phone}`,
    },
    {
      key: "4",
      label: "عنوان العميل",
      children: `${singleOrderView.country} / ${singleOrderView.address}`,
    },
    {
      key: "5",
      label: "وقت الكتابة",
      children:
        Object.keys(singleOrderView).length > 0
          ? FormatDate(singleOrderView.createdAt)
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
        singleOrderView && Object.keys(singleOrderView).length > 0
          ? singleOrderView.ship.name
          : "----",
    },
    {
      key: "8",
      label: "الحالة",
      children: (
        <Badge
          status="processing"
          text={
            Object.keys(singleOrderView).length > 0
              ? singleOrderView.status
              : "---"
          }
        />
      ),
    },
    {
      key: "9",
      label: "سعر الطلب",
      children:
        Object.keys(singleOrderView).length > 0 ? singleOrderView.price : "---",
    },

    {
      key: "10",
      span: 3,
      label: "التعديلات",
      children: (
        <>
          {Object.keys(singleOrderView).length > 0 &&
          singleOrderView.updates.length > 0 ? (
            singleOrderView.updates.map((e: any) => {
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

  return (
    <>
      {isWaitingForGetSingleOrderView ? (
        <Skeleton />
      ) : singleOrderView && Object.keys(singleOrderView).length > 0 ? (
        <>
          <Descriptions
            style={{ margin: "10px" }}
            title="تفاصيل الطلب"
            layout="vertical"
            bordered
            items={items}
          />
        </>
      ) : null}
    </>
  );
};
export default ViewOrder;
