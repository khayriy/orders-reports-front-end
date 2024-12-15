import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { Modal } from 'antd';



const nodeTypes = {
  custom: CustomNode,
};

interface orderFlowInterface {
    open : boolean , 
    onClose : ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined , 
    data : any
}
const OrderFlow = ({open , onClose , data} : orderFlowInterface) => {
  


  const fn = (arr : any)=> {
    let first = 0
    let second = 0
    const newArr =  arr.map((e: any , index: number)=>{
        
         if(index % 2 === 0 && index !== 0) {
            first = first + 1
            second = 0
            
         }
         else if(index !== 0){
            second = second + 1
         }
       
            
            return {
               id : `${index}`  , position : {x : first * 280 , y : index ===0 ? 0 : 150 * second}, data : e , type : 'custom' 
            }
         
        
        
     })
     return newArr
 }
  const initialNodes = fn(data)




   const initialEdges = data.map((_ : any, index : any) => {
    return {
        id : `${index}` , source: `${index}` , target: `${index+1}` ,  animated: true, style: { stroke: '#A97104' }
    }
   })

 

  return (
    <Modal onCancel={onClose} destroyOnClose title="تتبع الطلب" open={open}  width={1000} footer={null}>

<div style={{ width: '100%', height: '60vh' , paddingInlineStart : '20px'}}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          style={{ width: '100%', height: '100%' , maxWidth : '100%' , padding : '10px 0px'  }}
        />
     
      </div>
      </Modal>
  );
};

export default OrderFlow;
