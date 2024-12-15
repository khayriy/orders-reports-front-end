import {  Row } from 'antd'
import SingleStatistic from '../SingleStatistic/SingleStatistic'
import {MdDone} from 'react-icons/md'
import {AiOutlineClose} from 'react-icons/ai'
import {BsStopwatch} from 'react-icons/bs'

interface StatisticsInterface { 
  loading : boolean , 
  pending : string , 
  part : string , 
  deliver : string , 
  back : string 
}
const Statistics = ({loading , pending , part , deliver , back } : StatisticsInterface) => {
  return (
    <>
    <Row style={{ justifyContent : 'space-around' , marginTop : '15px'}}>
     <SingleStatistic loading={loading} title='الطلبات المسلمة'  value={deliver} color='#39e75f' Icon={MdDone}/>
    <SingleStatistic loading={loading} title='الطلبات قيد التشغيل'  color='#FFA500' value={pending} Icon={BsStopwatch}/>
    <SingleStatistic loading={loading} title='الطلبات المرتجعة'  color='rgb(255,0,0)' value={back} Icon={AiOutlineClose}/>
    <SingleStatistic loading={loading} title='الطلبات التسليم الجزئي'  value={part} color='#39e75f' Icon={MdDone}/>
  </Row>
  
  </>
  )
}

export default Statistics