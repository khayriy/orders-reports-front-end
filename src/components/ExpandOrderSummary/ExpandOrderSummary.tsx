/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import FormatDate from '../../helpers/FormatDate/FormatDate';
import { Badge, Descriptions } from 'antd';

const ExpandOrderSummary = ({record} : any) => {
    
    const runningTime =
    record &&
    Object.keys(record).length > 0 &&
    record.updates.filter((e: any) => e.info === "تم التشغيل").pop();

  const deliverTime =
    record &&
    Object.keys(record).length > 0 &&
    record.updates.filter((e: any) => e.info === "تم التسليم").pop();
    const items : any = [
        {
          key: "1",
          label: "المنتجات",
          span: 3,
          children:
            record && Object.keys(record).length > 0
              ? record.products
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
            record && Object.keys(record).length > 0
              ? `${record.name}`
              : "",
        },
        {
          key: "3",
          label: "هاتف العميل",
          children:
            record && Object.keys(record).length > 0
              ? `${record.phone}`
              : "",
        },
        {
          key: "4",
          label: "عنوان العميل",
          children:
            record && Object.keys(record).length > 0
              ? `${record.country} / ${record.address}`
              : "",
        },
        {
          key: "5",
          label: "وقت الكتابة",
          children:
            record && Object.keys(record).length > 0
              ? FormatDate(record.createdAt)
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
            record && record && Object.keys(record).length > 0
              ? record.ship.name
              : "----",
        },
        {
          key: "8",
          label: "الحالة",
          children: (
            <Badge
              status="processing"
              text={
                record && Object.keys(record).length > 0
                  ? record.status
                  : "---"
              }
            />
          ),
        },
        {
          key: "9",
          label: "سعر الطلب",
          children:
            record && Object.keys(record).length > 0
              ? record.price
              : "---",
        },
    
        {
          key: "10",
          span: 3,
          label: "التعديلات",
          children: (
            <>
              {record &&
              Object.keys(record).length > 0 &&
              record.updates.length > 0 ? (
                record.updates.map((e: any) => {
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
    {record && Object.keys(record).length > 0 ? 
     <Descriptions
     style={{ margin: "10px" }}
     title="تفاصيل الطلب"
     layout="vertical"
     bordered
     items={items}
   />
   : null
    }
    </>
 )
}

export default ExpandOrderSummary