/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties } from "react";
import styles from "./permissionTableView.module.scss";

// raw permission keys -> what the admin should read
const RESOURCE_LABELS: Record<string, string> = {
  ship: "الشحن",
  order: "الطلبات",
  product: "المنتجات",
  dash: "الرئيسية",
};

interface Props {
  title: string;
  data?: string[];
  /** accent for the group (icon + chip tint) */
  color: string;
  Icon?: any;
  /** kept for backwards compatibility, no longer used */
  bgColor?: string;
}

const PermissionTableView = ({ Icon, color, data, title }: Props) => {
  const list = data ?? [];

  return (
    <div className={styles.group} style={{ "--tone": color } as CSSProperties}>
      <span className={styles.title}>
        {Icon ? <Icon className={styles.icon} /> : <span className={styles.dot} />}
        {title}
      </span>

      <div className={styles.items}>
        {list.length > 0 ? (
          list.map((key, index) => (
            <span className={styles.chip} key={`${key}-${index}`}>
              {RESOURCE_LABELS[key] ?? key}
            </span>
          ))
        ) : (
          <span className={styles.none}>—</span>
        )}
      </div>
    </div>
  );
};

export default PermissionTableView;