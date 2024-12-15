/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FormatDate from "../../../helpers/FormatDate/FormatDate";
import BarCodeView from "../../BarCode/BarCodeView";
import styles from "../styles.module.scss";
const BillBody = ({ order, isSheet }: any) => {
  const orderProducts =
    order && !isSheet && order.products.length > 0
      ? order.products.map((e: any) => {
          if (e.product.type) {
            return `-${e.product.quantity} ${e.product.name} / ${e.product.type.name}`;
          } else {
            return `${e.product.quantity} ${e.product.name}`;
          }
        })
      : [];

  return (
    <div
      className={styles.main}
      style={{ fontSize: isSheet ? "12px" : "13.5px" }}
    >
      <article className={styles.article}>
        <address className={styles.address} style={{ display: "flex" }}>
          <BarCodeView value={order.id} />
          <br/>
          {isSheet ? (
            <div
              style={{
                width: "2cm",
                height: "1cm",
                border: "1px solid black",
              }}
            ></div>
          ) : null}
        </address>

        <table className={`${styles.firstTable} ${styles.table}`}>
          <tbody>
            <tr>
              <th className={styles.th}>
                <span>تاريخ الطلب</span>
              </th>
              <td className={styles.td}>
                <span>{FormatDate(order.createdAt)}</span>
              </td>
            </tr>
            <tr>
              <th className={styles.th}>
                <span>اسم العميل</span>
              </th>
              <td className={styles.td}>
                <span>{order && order.name ? order.name : ""}</span>
              </td>
            </tr>
            <tr>
              <th className={styles.th}>
                <span>العنوان</span>
              </th>
              <td className={styles.td}>
                <span>
                  {order && order.country
                    ? `${order.country} / ${order.address}`
                    : ""}
                </span>
              </td>
            </tr>

            <tr>
              <th className={styles.th}>
                <span>رقم هاتف</span>
              </th>
              <td className={styles.td}>
                <span>
                  {order && order.phone && order.anotherPhone
                    ? `${order.phone} / ${order.anotherPhone}`
                    : order.phone && !order.anotherPhone
                    ? order.phone
                    : ""}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {!isSheet ? (
          <table className={`${styles.secondTable}  ${styles.table}`}>
            <thead>
              <tr>
                <th className={styles.th}>
                  <span>المنتجات</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {" "}
              {/* Add tbody here */}
              <tr>
                <td style={{ width: "80%" }} className={styles.td}>
                  <a className="cut"></a>
                  <span>{orderProducts.join("/")}</span>
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}

        <table className={`${styles.second}  ${styles.table}`}>
          <tbody>
            <tr>
              <th className={styles.th}>
                <span>اجمالي المطلوب</span>
              </th>
              <td className={styles.td}>
                <span data-prefix>LE </span>
                <span style={{ fontWeight: "900" }}>
                  {order && order.price ? order.price : ""}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      {order && order.notes ? (
        <aside style={{ borderTop: ".5px solid black", padding: "0px 5px" }}>
          <p style={{ margin: "0px" }}>{order.notes}</p>
        </aside>
      ) : null}
    </div>
  );
};
export default BillBody;
