/* eslint-disable @typescript-eslint/no-explicit-any */
import { Radio } from "antd";

const StatusFilter = ({value , setValue} : any) => {
  return (
    <Radio.Group value={value} onChange={(e)=>setValue(e.target.value)} style={{ width: "100%", display: "flex" }}>
      <Radio.Button style={{ flex: 1 }} value="">
        الكل
      </Radio.Button>
      <Radio.Button style={{ flex: 1 }} value="تم التسليم">
        تم التسليم
      </Radio.Button>
      <Radio.Button style={{ flex: 1 }} value="قيد التشغيل">
        قيد التشغيل
      </Radio.Button>
      <Radio.Button style={{ flex: 1 }} value="مرتجع">
        مرتجع
      </Radio.Button>
      <Radio.Button style={{ flex: 1 }} value="تسليم جزئي">
        تسليم جزئي
      </Radio.Button>
    </Radio.Group>
  );
};

export default StatusFilter;
