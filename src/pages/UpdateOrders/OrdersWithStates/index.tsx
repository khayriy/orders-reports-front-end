import { Card, Timeline } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { orderActions } from '../../../store/orderSlice/orderSlice'

const OrdersWithStates = () => {
    const {ordersWithStates} = useSelector((state:any)=>state.order)
    const dispatch = useDispatch() 
    useEffect(()=>{
            
        return ()=> {
            
            dispatch(orderActions.clearOrdersWithStates())
        }
    }
     , [])
   
  return (
    ordersWithStates.length > 0 ? 
    <Card
    title={`راجع هذه الطلبات اولا (${ordersWithStates.length})`}
    bordered={false}
    style={{
      maxHeight : 200 ,
      height : 200 , 
      overflow : 'auto'
    }}
  >
 <Timeline 
   items={ordersWithStates?.map((e : any)=> {
    
    return {
        color : 'red' , 
        children : <Link to= { e?.status === 'غير مسجل' ? '#' :  `/orders/${e?.id ?? ""}`}>{`${e?.id ?? ""}  الحالة : ${e?.status ?? ""} ${e?.message ?? ""}`}</Link> 
    }
})}
  />
   </Card>
   : 
   null
  )
}

export default OrdersWithStates