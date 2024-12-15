/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input, Form, Cascader, Button, Row, Col, Tabs } from "antd";
import { statusUpdateData } from "../../data/statusData";
import { updateOrders, updateOrdersShip } from "../../store/orderSlice/orderSlice";
import { useDispatch , useSelector} from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import OrdersWithStates from "./OrdersWithStates";
import { CarOutlined, NodeIndexOutlined } from "@ant-design/icons";
import { getAllShips } from "../../store/shipSlice/shipSlice";
const { TextArea } = Input;

const UpdateOrders = () => {
  const {  ships ,isWaitingForShips  } = useSelector((state : any)=>state.ship)

  const {token} = useSelector((state : any)=>state.auth)
  const [activeTab , setActiveTab] = useState('1')
  const {isWaitingForUpdateManyOrders} = useSelector((state:any)=>state.order)
  const [orders, setOrders] = useState("");
  const [state, setState] = useState(undefined);
  const [shipId , setShipId] = useState(undefined)
  const [formattedShips , setFormattedShips] = useState([])
  const [notes, setNotes] = useState("");
  const [ids, setIds] = useState([""]);
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch: DispatchInterface = useDispatch();
  const handleTextAreaChange = (e: any) => {
    const textareaValue = e.target.value;
    setOrders(textareaValue);
    const ordersArray = textareaValue.split("\n");
    setIds(ordersArray);
  };
  // useEffect to check is form valid or note
  useEffect(() => {
    
    if (orders == "") {
      setIsFormValid(false);
      return
    }
    else if(activeTab==='1'){
      if(!state) {
        setIsFormValid(false);
        return
      } 
    }
    else {
      if(!shipId) {
        setIsFormValid(false);
        return
      } 
    }
    
    setIsFormValid(true)
  }, [orders, state, ids.length , shipId , activeTab]);

  const updateHandler = () => {
    if(activeTab === '1') {
      if (notes !== "") {
        dispatch(
          updateOrders({
            url: "order/updateMany",
            toastMessage: "تم تعديل الطلبات بنجاح",
            data: {
              orders: ids,
              status: state ? state[0] : "" ,
              notes,
            },
            clearForm: () => {
              setNotes("");
              setOrders("");
              setIsFormValid(false);
            },
            token
          })
        );
      } else {
        dispatch(
          updateOrders({
            url: "order/updateMany",
            toastMessage: "تم تعديل الطلبات بنجاح",
            data: {
              orders: ids,
              status : state ? state[0] : ""
            },
            clearForm: () => {
              setOrders("");
              setIsFormValid(false);
            },
            token
          })
        );
      }
    }
    else {
      dispatch(
        updateOrdersShip({
          url: "order/updateShip",
          toastMessage: "تم تعديل الطلبات بنجاح",
          data: {
            orders: ids,
            ship_id : shipId ? shipId[0] : ""
          },
          clearForm: () => {
            setOrders("");
            setIsFormValid(false);
            setShipId(undefined)
          },
          token
        })
      );
    }
   
  };


  useEffect(()=>{
    if(activeTab === '1') return 
    if(ships?.length > 0) return
    dispatch(getAllShips({url : 'ship' , token}))

  } ,[activeTab])

  useEffect(()=>{
    if(!ships || ships.length ===0) return 
    const data = ships? ships.map(({ _id , name} : any)=>{
      return {value : _id , label : name}
    }) : []
    setFormattedShips(data)
  } , [ships])

 
  return (
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
    <Col span={16} >
    <OrdersWithStates />
    </Col>
      </Row>
      
     <Tabs 
     defaultActiveKey={activeTab}
     onChange={(key) => setActiveTab(key)}

     items={[
      {
      key : '1' , 
      label:( <>
      تعديل الحالة<NodeIndexOutlined/>
      </>
      ),
      
      children : <Form.Item
      style={{ direction: "rtl" }}
      label="الحالة"
      required
    >
      <Cascader
        style={{ width: "100%" }}
        size="large"
        options={statusUpdateData}
        value={state}
        onChange={(e : any) => setState(e)}
        placeholder="اختر الحالة المراد التحويل لها"
      />
    </Form.Item>
     }  ,
     {
      key : '2' , 
      label: (
        <div style={{marginInlineStart : '10px'}}>
       تعديل الشحن<CarOutlined />
        </div>
      ),
      children : <Form.Item
      style={{ direction: "rtl" }}
      label="الشحن"
      required
    >
      <Cascader
        style={{ width: "100%" }}
        size="large"
        options={formattedShips}
        value={shipId}
        loading={isWaitingForShips}
        onChange={(e : any) => setShipId(e)}
        placeholder="اختر مسئول الشحن المراد التحويل له"
      />
    </Form.Item>
     }]}
     />

     
     
     {activeTab == '1' &&
      <Form.Item label="ملاحظات" required>
      <TextArea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="ملاحظات علي هذه الطلبات"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </Form.Item>
     }

     
      <Button
        disabled={!isFormValid || isWaitingForUpdateManyOrders}
        loading={isWaitingForUpdateManyOrders}
        type="primary"
        htmlType="submit"
        style={{ width: "100%" }}
      >
        تأكيد التعديل
      </Button>
    </Form>
  );
};

export default UpdateOrders;
