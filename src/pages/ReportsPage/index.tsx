import { Button, Col, Form, Row, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import OrderColumn from "../../helpers/columns/order-column";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByIds,
  ordersByIdsActions,
} from "../../store/ordersByIdsSlice/ordersByIdsSlice";
import DispatchInterface from "../../types/DispatchInterface";
import OrderFlow from "../../components/OrderFlow";
import PrintBills from "../../components/Bills/PrintBills";

const ReportsPage = () => {
  const [isOrderFlowModalOpen, setIsOrderFlowModalOpen] = useState(false);
  const [updatesForOneOrder, setUpdatesForOneOrder] = useState([]);
  const dispatch: DispatchInterface = useDispatch();
  const { isWaitingForGetOrders, ordersByIds } = useSelector(
    (state: any) => state.ordersByIds
  );

  const { token } = useSelector((state: any) => state.auth);
  const [orders, setOrders] = useState("");
  const [ids, setIds] = useState([""]);

  const handleTextAreaChange = (e: any) => {
    const textareaValue = e.target.value;
    setOrders(textareaValue);
    const ordersArray = textareaValue.split("\n");
    setIds(ordersArray);
  };

  const updateHandler = () => {
    if (ordersByIds?.length > 0) {
      dispatch(ordersByIdsActions.clearOrders());
    }
    dispatch(
      getAllOrdersByIds({
        url: "order/ids",
        toastMessage: "تم استرجاع الطلبات المتوافقة",
        data: {
          orders: ids,
        },
        clearForm: () => {
          setIds([""]);
        },
        token,
      })
    );
  };

  useEffect(() => {
    return () => {
      setIds([""]);
      if (ordersByIds?.length > 0) {
        dispatch(ordersByIdsActions.clearOrders());
      }
    };
  }, []);

  console.log(ordersByIds);
  return (
    <>
      <Form
        layout="vertical"
        style={{ marginTop: "15px" }}
        onSubmitCapture={updateHandler}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="أرقام الطلبات" required>
              <TextArea
                value={orders}
                onChange={(e) => handleTextAreaChange(e)}
                placeholder="اكتب ارقام الطلبات علي انا يكون كل رقم في سطر"
                autoSize={{ minRows: 5 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button
          disabled={isWaitingForGetOrders || !ids.toString()}
          loading={isWaitingForGetOrders}
          type="primary"
          htmlType="submit"
        >
          اظهار النتائج
        </Button>
      </Form>
      <>
        {isWaitingForGetOrders ? <Skeleton /> : null}
        {ordersByIds.length > 0 ? (
          <>
            {" "}
            <PrintBills data={ordersByIds} ship={""} />
            <TableWrapper
              keyTerm="shipOrders"
              key={"shipOrders"}
              title={` جميع الطلبات المتوافقة  (${ordersByIds?.length}) `}
              columns={OrderColumn({
                setIsOrderFlowModalOpen,
                setUpdatesForOneOrder,
              })}
              data={ordersByIds}
              loading={isWaitingForGetOrders}
            />
          </>
        ) : null}
      </>

      <OrderFlow
        data={updatesForOneOrder}
        open={isOrderFlowModalOpen}
        onClose={() => setIsOrderFlowModalOpen(false)}
      />
    </>
  );
};

export default ReportsPage;
