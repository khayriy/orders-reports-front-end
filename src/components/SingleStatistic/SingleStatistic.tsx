import type { CSSProperties } from "react";
import { Skeleton } from "antd";
import type { IconType } from "react-icons";
import styles from "./staistic.module.scss";

interface Props {
  title: string;
  color: string;
  value: string | number;
  Icon: IconType;
  loading: boolean;
  /** When given, shows this card's share of the total as a thin bar */
  total?: number;
}

const SingleStatistic = ({ Icon, title, color, value, loading, total }: Props) => {
  const n = Number(value);
  const display = Number.isNaN(n) ? String(value) : n.toLocaleString("en-US");
  const pct = total && total > 0 && !Number.isNaN(n) ? Math.round((n / total) * 100) : null;

  return (
    <article className={styles.card} style={{ "--tone": color } as CSSProperties}>
      {loading ? (
        <Skeleton active title={false} avatar={{ shape: "square" }} paragraph={{ rows: 1 }} />
      ) : (
        <>
          <header className={styles.top}>
            <span className={styles.title}>{title}</span>
            <span className={styles.icon} aria-hidden>
              <Icon />
            </span>
          </header>

          <strong className={styles.value}>{display}</strong>

          {pct !== null && (
            <div className={styles.share}>
              <div
                className={styles.track}
                role="progressbar"
                aria-label={title}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <span className={styles.fill} style={{ width: `${pct}%` }} />
              </div>
              <span className={styles.pct}>{pct}% من الإجمالي</span>
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default SingleStatistic;