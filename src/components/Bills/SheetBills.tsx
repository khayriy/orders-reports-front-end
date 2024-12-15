/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import BillOfLading from "../BillOfLading/BillOfLading";
import style from "./bills.module.scss";
import FormatDate from "../../helpers/FormatDate/FormatDate";
import Endorsement from "../Endorsement/Endorsement";
const SheetBills = React.forwardRef(
  ({ data, ship }: any, ref: React.ForwardedRef<HTMLDivElement>) => {
    const price =
    data && data.length > 0
      ? data.reduce((a: any, b: any) => a + b.price, 0)
      : 0;
    return (
      <>
      <div ref={ref} className={style.billContainer}>
        {data && data.length > 0 ? (
          <>
            <div style={{direction : 'rtl'}}>
              <span style={{ marginLeft: "8px" }}>
                {ship && ship.label ? ship.label : ""}
              </span>
              <span>{ship && ship.phone ? ship.phone : ""}</span>
              <br />
              <span style={{ marginLeft: "8px" }}>التاريخ</span>
              <span>{FormatDate(Date.now())}</span>
              <br />
              <span style={{ marginLeft: "8px" }}>عدد الشحنات</span>
              <span>{data.length}</span>
              <br />
              <span style={{ marginLeft: "8px" }}>اجمالي المطلوب</span>
              <span>{price}</span>
            </div>
            {data.map((e: any, index: number) => {
              return <BillOfLading order={e} key={index} isSheet={true}/>;
            })}
            {ship && ship.label && ship.phone ? (
              <Endorsement
                name={ship.label}
                phone={ship.phone}
                num={`${data.length}`}
                price={price}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </>
    );
  }
);
export default SheetBills;
