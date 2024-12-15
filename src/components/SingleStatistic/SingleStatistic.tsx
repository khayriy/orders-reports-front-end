import { Statistic, Col, Card, Skeleton } from "antd";
import styles from "./staistic.module.scss";
import { IconType } from "react-icons";
interface Props {
  title: string;
  color: string;
  value: string;
  Icon: IconType;
  loading: boolean;
}
const SingleStatistic = ({ Icon, title, color, value, loading }: Props) => {
  return (
    <Col
      xs={{ span: 24 }}
      lg={{ span: 6 }}
      style={{ padding: "20px", borderRadius: "20px", position: "relative" }}
    >
      <Card bordered={false}>
        {loading ? (
          <Skeleton avatar paragraph={{ rows: 0 }} />
        ) : (
          <Statistic
            title={title}
            value={value}
            valueStyle={{ color: color }}
          />
        )}
      </Card>
      <div className={styles.icon}>
        <Icon style={{ color: color }} />
      </div>
    </Col>
  );
};

export default SingleStatistic;
