/* eslint-disable @typescript-eslint/no-explicit-any */

import BillHeader from "./BillHeader/BillHeader";
import BillBody from "./BillBody/BillBody";

const BillOfLading = ({ order, isSheet }: any) => {
  return (
    <div
      style={{
        border: ".5px solid black",
        display: "block",
        pageBreakInside: "avoid",
        margin: "8px 0px",
      }}
    >
      <BillHeader order={order} isSheet={isSheet} />
      <BillBody order={order} isSheet={isSheet} />
    </div>
  );
};

export default BillOfLading;
