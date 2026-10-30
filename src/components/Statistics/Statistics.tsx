import { MdDone } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { BsStopwatch } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import SingleStatistic from "../SingleStatistic/SingleStatistic";
import styles from "../SingleStatistic/staistic.module.scss";

type Count = number | string;

interface StatisticsInterface {
  loading: boolean;
  pending: Count;
  part: Count;
  deliver: Count;
  back: Count;
}

// Status colours: Signal for in-progress, Amber for the one that needs attention,
// plus plain success / danger tones so states stay readable at a glance.
const TONES = {
  deliver: "#12a150",
  pending: "#0a84ff",
  back: "#e5484d",
  part: "#ffb020",
};

const Statistics = ({ loading, pending, part, deliver, back }: StatisticsInterface) => {
  const total = [pending, part, deliver, back].reduce<number>((sum, v) => sum + (Number(v) || 0), 0);

  return (
    <div className={styles.grid}>
      <SingleStatistic loading={loading} total={total} title="الطلبات المسلمة" value={deliver} color={TONES.deliver} Icon={MdDone} />
      <SingleStatistic loading={loading} total={total} title="الطلبات قيد التشغيل" value={pending} color={TONES.pending} Icon={BsStopwatch} />
      <SingleStatistic loading={loading} total={total} title="الطلبات المرتجعة" value={back} color={TONES.back} Icon={AiOutlineClose} />
      <SingleStatistic loading={loading} total={total} title="الطلبات التسليم الجزئي" value={part} color={TONES.part} Icon={TbTruckDelivery} />
    </div>
  );
};

export default Statistics;