
import {Row} from 'antd'
import OrdersChart from '../OrdersChart/OrdersChart'
import DountChart from '../DountChart/DountChart'
const Charts = () => {
  return (
    <Row style={{ justifyContent : 'space-around' , marginTop : '15px'}}>
     <OrdersChart />
     <DountChart />
  </Row>
  )
}

export default Charts