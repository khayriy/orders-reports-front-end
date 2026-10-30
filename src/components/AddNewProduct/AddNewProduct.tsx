import { useState } from "react";
import { AppstoreOutlined, BarsOutlined, CheckOutlined } from "@ant-design/icons";
import AddProductWithType from "../AddProductWithType/AddProductWithType";
import AddProductWithName from "../AddProductWithName/AddProductWithName";
import styles from "./addNewProduct.module.scss";

type Kind = "without" | "with";

const OPTIONS = [
  {
    value: "without" as Kind,
    title: "منتج بسيط",
    hint: "لا يحتوي على أنواع داخلية",
    Icon: BarsOutlined,
  },
  {
    value: "with" as Kind,
    title: "منتج بأنواع",
    hint: "يحتوي على أنواع داخلية، ولكل نوع كمية",
    Icon: AppstoreOutlined,
  },
];

const AddNewProduct = () => {
  const [kind, setKind] = useState<Kind>("without");

  return (
    <section className={styles.panel}>
      <header className={styles.head}>
        <h2 className={styles.title}>إضافة منتج جديد</h2>
        <span className={styles.hint}>اختر نوع المنتج أولًا، ثم أكمل بياناته</span>
      </header>

      <div className={styles.kinds} role="radiogroup" aria-label="نوع المنتج">
        {OPTIONS.map(({ value, title, hint, Icon }) => {
          const selected = kind === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={styles.kind}
              data-selected={selected}
              onClick={() => setKind(value)}
            >
              <span className={styles.kindIcon}>
                <Icon />
              </span>
              <span className={styles.kindText}>
                <b>{title}</b>
                <small>{hint}</small>
              </span>
              <span className={styles.radio} aria-hidden>
                {selected && <CheckOutlined />}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.form}>
        {kind === "without" ? <AddProductWithName /> : <AddProductWithType />}
      </div>
    </section>
  );
};

export default AddNewProduct;