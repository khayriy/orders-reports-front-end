/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, Col } from "antd";
import { useState } from "react";
import Chart from "react-apexcharts";

const DountChart = () => {
  const [series] = useState([40, 50]);

  const [options] = useState<any>({
    chart: {
      type: "donut",
    },
    legend: { floating: true },
   
    labels: ["A", "B"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "",
              formatter: () => "200",
            },
          },
        },
      },
    },
  });

  return (
    <Col
      xs={{ span: 24 }}
      lg={{ span: 12 }}
      style={{ padding: "20px", borderRadius: "20px", position: "relative" }}
    >
      <Card bordered={false} title="احصائية المخزن" style={{ height: "400px" }}>
        <Chart options={options} series={series} type="donut" height={200} />
      </Card>
    </Col>
  );
};

export default DountChart;
