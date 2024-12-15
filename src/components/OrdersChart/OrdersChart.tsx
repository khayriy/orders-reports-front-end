/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, Col } from "antd";
import { useState } from "react";

import Chart from "react-apexcharts";

const OrdersChart = () => {
  const [series] = useState([
    {
      name: "كل الطلبات",
      data: [44],
    },
    {
      name: "الطلبات المسلمة",
      data: [76],
    },
    {
      name: "الطلبات قيد التشغيل",
      data: [35],
    },
    {
      name: "الطلبات المرتجعة",
      data: [35],
    },
  ]);

  const [options] = useState<any>({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["22/10/25 - 25/10/2018"],
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: string) {
          return "$ " + val + " thousands";
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
      <Card
        bordered={false}
        title="احصائية الطلبات"
        style={{ height: "450px" }}
      >
        <Chart options={options} series={series} type="bar" height={300} />
      </Card>
    </Col>
  );
};
export default OrdersChart;
