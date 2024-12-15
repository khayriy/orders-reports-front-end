/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import BillOfLading from "../BillOfLading/BillOfLading";
import style from "./bills.module.scss";
const Bills = React.forwardRef(
  ({ data }: any, ref: React.ForwardedRef<HTMLDivElement>) => {
    
    return (
      <>
        <div ref={ref} className={style.billContainer}>
          {data && data.length > 0 ? (
            <>
             
              {data.map((e: any, index: number) => {
                return <BillOfLading order={e} key={index} />;
              })}
             
            </>
          ) : null}
        </div>
      </>
    );
  }
);
export default Bills;
