/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, Tooltip } from "antd";
import { Link } from "react-router-dom";
import FormatDate from "../../FormatDate/FormatDate";
import { FullscreenOutlined , EyeOutlined, ClockCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import statusToIcon from "../../statusToIcon";
import DeleteModal from "../../../modals/DeleteModal/DeleteModal";

interface OrderColumnInterface {
  setIsOrderFlowModalOpen : React.Dispatch<React.SetStateAction<boolean>>
  setUpdatesForOneOrder : any , 
  deleteAble ? : boolean , 
  isWaitingForDeleteOrder ? : boolean , 
  confirmDelete ? : any
}
const OrderColumn = ({setIsOrderFlowModalOpen , setUpdatesForOneOrder , deleteAble , isWaitingForDeleteOrder , confirmDelete} : OrderColumnInterface)=> {
  return [
    {
      title: "رقم الطلب",
      dataIndex: "id",
      key: "id",
      search: true,
     
     
    },
    {
      title: "اسم العميل",
      dataIndex: "name",
      key: "name",
      search: true,
     
    },
    {
      title: "رقم الهاتف",
      dataIndex: "",
      key: "",
      
      render: (e: any) =>  <Tooltip title={e?.anotherPhone ? `الرقم التاني للعميل ${e?.anotherPhone}` : 'لا يوجد رقم اخر للعميل'}>
      <span>{e?.phone ?? ""}</span>
    </Tooltip>
    },
    {
      title: "السعر",
      dataIndex: "price",
      key: "price",
     
    },
    {
      title: "وقت الكتابة",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (e: any) => <Tag icon={<ClockCircleOutlined />} color="default">
    
      {FormatDate(e)}
       </Tag>
    
    },
    {
      title: "وقت التشغيل",
      dataIndex: "updates",
      key: "updates",
    
      render: (e: any) => {
        const time = e && e.filter((e: any) => e.info === "تم التشغيل");
        if (time) {
          const lastUpdate = time.pop();

          if (lastUpdate) {
            return  <Tag icon={<ClockCircleOutlined />} color="processing">
           {FormatDate(lastUpdate.timestamp)}
            </Tag>
            
            
          } else return "---";
        }
      },
    },
    {
      title: "الشحن",
      dataIndex: "ship",
      key: "ship",
    
      render: (e: any) =>  <Tooltip title={`رقم هاتف مسئول الشحن  ${e?.phone ?? ""}`}>
       {e?.name ?  <Tag color="success">
      {e?.name ?? ""}
      </Tag>
     : null  
    }
     
    </Tooltip>
    },
    {
      title: "الحالة",
      dataIndex: "",
      key: "status",
     
      render: (e: any) => (statusToIcon(e))
        
          
      
       
      
    },
    {
      title: "المحافظة",
      dataIndex: "country",
      key: "country",
      search: true,
     
      
      
    },
    {
      title: "العنوان",
      dataIndex: "address",
      key: "address",
      
    },
    {
      title: "الاجرائات",
      dataIndex: "",
      key: "",
      
      
     
      render: (e: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {deleteAble ? 
         <a>
         <DeleteOutlined
           onClick={() =>
             DeleteModal(`"طلب مازال معلق"`, isWaitingForDeleteOrder || false, () =>
               confirmDelete(e._id)
             )
           }
         />
       </a>
        : null}
        {  new Date() > new Date(e?.createdAt)
        ? 
        <>
        <a onClick={()=> {

          setUpdatesForOneOrder(()=>{
            return [ {info : 'تم الكتابة' , timestamp : e?.createdAt} , ...e?.updates]
          })
          
          setIsOrderFlowModalOpen(true)
         
          } }>
            <FullscreenOutlined/>
          </a>
          <Link to={`/orders/${e.id}`}>
            <EyeOutlined />
          </Link>
          </>
        : 

        null
        }
      
        </div>
      ),
    },
  ]
}

;

  export default OrderColumn