/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Cascader, Col, DatePicker, Row } from "antd";
const { RangePicker } = DatePicker;

import StatusFilter from "../StatusFilter/StatusFilter";
import countryptions from "../../data/countryData";
import { useState } from "react";
import { getAllOrdersWithFilter } from "../../store/orderSlice/orderSlice";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
const CollapseChildren = () => {
  
  const {token} = useSelector((state : any)=>state.auth)
  
  const dispatch: DispatchInterface = useDispatch();
  const { isWaitingForGetOrdersWithFilter } = useSelector(
    (state: any) => state.order
  );

  const [status, setStatus] = useState("");
  const [startOrderDate, setStartDate] = useState("");
  const [endOrderDate, setEndOrderDate] = useState("");
  const [startDeliverDate, setStartDeliverDate] = useState("");
  const [endDeliverDate, setEndDeliverDate] = useState("");
  const [address, setAddress] = useState<any>(undefined);

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    setStartDate(dateStrings[0]);
    setEndOrderDate(dateStrings[1]);
  };

  const handleDeliverDateChange = (_: any, dateStrings: [string, string]) => {
    setStartDeliverDate(dateStrings[0]);
    setEndDeliverDate(dateStrings[1]);
  };
  // you get address as array

  const getAllMatchingOrders = () => {
    
    const data = {
      startOrderDate,
      endOrderDate,
      startDeliverDate,
      endDeliverDate,
      country: address && address[0] ? encodeURIComponent(address.toString())  : "",
      status,
    };
    const existDataObject = Object.entries(data);
    const arr = existDataObject.filter((e) => e[1] !== "");
    const search = new URLSearchParams(arr);
    
    dispatch(
      getAllOrdersWithFilter({
        url: `order/filter?${search}`, token 
      })
    );
  };

  return (
    <Row gutter={16}>
      <Col
        className="gutter-row"
        span={12}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <p>تاريخ الطلب </p>
        <RangePicker onChange={handleDeliverDateChange} />
      </Col>
      <Col
        className="gutter-row"
        span={12}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <p>تاريخ التوصيل</p>
        <RangePicker onChange={handleDateChange} />
      </Col>

      <Col className="gutter-row" span={12}>
        <p>الحالة</p>
        <StatusFilter value={status} setValue={setStatus} />
      </Col>
      <Col className="gutter-row" span={12}>
        <p>العنوان</p>
        <Cascader
          onChange={(e: any) => setAddress(e)}
          showSearch
          value={address}
          style={{ width: "100%" }}
          placeholder="اختر المحافظة والمركز"
          options={countryptions}
        />
      </Col>
      <Col
        className="gutter-row"
        span={24}
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          disabled={isWaitingForGetOrdersWithFilter}
          loading={isWaitingForGetOrdersWithFilter}
          onClick={getAllMatchingOrders}
          type="primary"
        >
          اظهار النتائج
        </Button>
      </Col>
    </Row>
  );
};

export default CollapseChildren;
