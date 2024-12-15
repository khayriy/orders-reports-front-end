import { LuCalendar } from "react-icons/lu"
import { CiDeliveryTruck } from "react-icons/ci";
import { FaInfo } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { CiStopwatch } from "react-icons/ci";
import { IoIosDoneAll } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";

const statusOfInfo = (info : string) => {
  switch(info) {
    case 'تم الكتابة' : return <TfiWrite  style={{color : '#964B00'}}/> 
    case 'تم التسليم' : return <IoIosDoneAll style={{color : '#0D6EFD'}}/> 
    case 'تم التشغيل' : return <CiPlay1   style={{color : '#5cb85c'}}/> 
    case 'تم التعليق' : return <CiStopwatch  style={{color : 'orange'}}/>
    case 'تم تعديل معلومات الطلب' : return  <FaInfo  style={{color : 'yellow'}}/> 
    case 'تم تغيير مسئول الشحن': return  <CiDeliveryTruck   style={{color : 'blue'}}/>
    default : return <LuCalendar /> 
  }
}

export default statusOfInfo