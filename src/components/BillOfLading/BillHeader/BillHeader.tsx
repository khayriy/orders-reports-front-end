/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "../styles.module.scss";

const BillHeader = ({ order, isSheet }: any) => {
  return (
    <header className={styles.header}>
      <address className={styles.address} style={{ padding: "1.5px" }}>
        <p> رقم الراسل والواتس :</p>
        <p> 01080268846 </p>
      </address>
      <address className={styles.address} style={{ padding: "1.5px" }}>
        {isSheet ? (
          <p>خاص بالمندوب</p>
        ) : (
          <>
            <p> مسئول الشحن :</p>
            <p>{order && order.ship ? order.ship.name : ""}</p>
          </>
        )}
      </address>
      <span style={{ margin: 0 }}>
        <img
          alt="MAHESH"
          src="/logo.png"
          className="rounded float-right align-top"
        />
      </span>
    </header>
  );
};

export default BillHeader;
