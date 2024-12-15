/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Badge,  Descriptions, Input, Typography } from "antd";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrdersByName,
  getOrdersByPhone,
  getSingleOrder,
  orderActions,
} from "../../store/orderSlice/orderSlice";
import type { DescriptionsProps } from "antd";
import FormatDate from "../../helpers/FormatDate/FormatDate";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import { Link } from "react-router-dom";
const { Search } = Input;
const SearchOrder = () => {
 
  const dispatch: DispatchInterface = useDispatch();
  const {
    singleOrder,
    isWaitingForGetSingleOrder,
    ordersByName,
    ordersByPhone,
    issWaitingForGetOrdersByPhone,
    issWaitingForGetOrdersByName,
  } = useSelector((state: any) => state.order);

  const { token } = useSelector((state: any) => state.auth);

  const searchHandler = (searchTerm: string) => {
    dispatch(getSingleOrder({ url: "order/order", id: searchTerm, token }));
  };

  const searchHandlerByPhone = (searchTerm: string) => {
    dispatch(
      getOrdersByPhone({ url: "order/order/phone", id: searchTerm, token })
    );
  };

  const searchHandlerByName = (searchTerm: string) => {
    dispatch(
      getOrdersByName({ url: "order/order/name", id: searchTerm, token })
    );
  };
  const runningTime =
    singleOrder &&
    Object.keys(singleOrder).length > 0 &&
    singleOrder.updates.filter((e: any) => e.info === "تم التشغيل").pop();

  const deliverTime =
    singleOrder &&
    Object.keys(singleOrder).length > 0 &&
    singleOrder.updates.filter((e: any) => e.info === "تم التسليم").pop();

  console.log(singleOrder);
  const items: DescriptionsProps["items"] = [
    {
      key: "link",
      label: "رقم الطلب",
      span: 3,
      children:
        singleOrder && Object.keys(singleOrder).length > 0 ? (
          <div style={{display : 'flex' , alignItems : 'center' , gap : '10px'}}>
            <Link
              to={`/orders/${singleOrder?.id}`}
            >{`اذهب للطلب رقم ${singleOrder?.id}`}</Link>
          
          </div>
        ) : (
          ""
        ),
    },
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
      children:
        singleOrder && Object.keys(singleOrder).length > 0
          ? `${singleOrder.name}`
          : "",
    },
    {
      key: "3",
      label: "هاتف العميل",
      children:
        singleOrder && Object.keys(singleOrder).length > 0
          ? `${singleOrder.phone}`
          : "",
    },
    {
      key: "4",
      label: "عنوان العميل",
      children:
        singleOrder && Object.keys(singleOrder).length > 0
          ? `${singleOrder.country} / ${singleOrder.address}`
          : "",
    },
    {
      key: "5",
      label: "وقت الكتابة",
      children:
        singleOrder && Object.keys(singleOrder).length > 0
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
        singleOrder && singleOrder && Object.keys(singleOrder).length > 0
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
            singleOrder && Object.keys(singleOrder).length > 0
              ? singleOrder.status
              : "---"
          }
        />
      ),
    },
    {
      key: "9",
      label: "سعر الطلب",
      children:
        singleOrder && Object.keys(singleOrder).length > 0
          ? singleOrder.price
          : "---",
    },

    {
      key: "10",
      span: 3,
      label: "التعديلات",
      children: (
        <>
          {singleOrder &&
          Object.keys(singleOrder).length > 0 &&
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
  const columns: any = [
    {
      title: "رقم الطلب",
      dataIndex: "id",
      key: "id",
      search: true,
    },
    {
      title: "اسم العميل",
      dataIndex: "name",
      key: "name",
      search: true,
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "رقم الهاتف",
      dataIndex: "",
      key: "",
      render: (e: any) => (
        <Typography>
          {e.anotherPhone ? `${e.phone} / ${e.anotherPhone} ` : `${e.phone} `}
        </Typography>
      ),
    },
    {
      title: "سعر الطلب",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "وقت الكتابة",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (e: any) => FormatDate(e),
    },
    {
      title: "وقت التشغيل",
      dataIndex: "updates",
      key: "updates",
      render: (e: any) => {
        const time = e && e.filter((e: any) => e.info === "تم التشغيل");

        if (time) {
          const lastUpdate = time.pop();

          if (lastUpdate) {
            return FormatDate(lastUpdate.timestamp);
          } else return "---";
        }
      },
    },
    {
      title: "المحافظة",
      dataIndex: "country",
      key: "country",
      search: true,
    },
    {
      title: "العنوان",
      dataIndex: "address",
      key: "address",
    },
  ];
  useEffect(() => {
    return () => {
      dispatch(orderActions.clearOrderSearch());
    };
  }, [dispatch]);
  return (
    <>

     
      <div style={{ display: "flex", gap: "8px", direction: "rtl" }}>
        <Search
          key={"searchByOrder"}
          onSearch={(e) => searchHandler(e)}
          loading={isWaitingForGetSingleOrder}
          placeholder="اكتب رقم الطلب"
          enterButton="بحث"
          size="large"
        />

        <Search
          key={"searchByPhone"}
          onSearch={(e) => searchHandlerByPhone(e)}
          loading={issWaitingForGetOrdersByPhone}
          placeholder="اكتب رقم هاتف العميل"
          enterButton="بحث بالهاتف"
          size="large"
        />
        <Search
          key={"searchByName"}
          onSearch={(e) => searchHandlerByName(e)}
          loading={issWaitingForGetOrdersByName}
          placeholder="اكتب اسم العميل"
          enterButton="بحث بالاسم"
          size="large"
        />
      </div>

      {singleOrder && Object.keys(singleOrder).length > 0 ? (
        <>
          <Descriptions
            style={{ margin: "10px" }}
            title="تفاصيل الطلب"
            layout="vertical"
            bordered
            items={items}
          />
        </>
      ) : ordersByPhone && ordersByPhone.length > 0 ? (
        <TableWrapper
          keyTerm="orderByPhone"
          key={"orderByPhone"}
          loading={isWaitingForGetSingleOrder}
          title="جميع الطلبات التي تحتوي علي رقم الهاتف المكتوب"
          columns={columns}
          data={ordersByPhone}
          isExpand={true}
        />
      ) : ordersByName && ordersByName.length > 0 ? (
        <TableWrapper
          keyTerm="orderByName"
          key={"orderByName"}
          loading={isWaitingForGetSingleOrder}
          title="جميع الطلبات التي تحتوي علي اسم العميل المكتوب"
          columns={columns}
          data={ordersByName}
          isExpand={true}
        />
      ) : (
        <h3 style={{ textAlign: "center" }}>لا يوجد طلبات لاظهارها</h3>
      )}
    </>
  );
};
export default SearchOrder;
