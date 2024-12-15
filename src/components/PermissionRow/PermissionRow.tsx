/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Col,  Divider,  Row, Typography } from "antd"

const { Text } = Typography;
const PermissionRow = ({  view , create ,   update, remove,text , permissionField , setUpdate , setView , setCreate , setRemove} : any) => {

  const addCreatePermission = (e : any)=>{
    if(e.target.checked){
      setCreate((e : any)=>{
        return [...e , `${permissionField}`]
      })
    }
    else {
      setCreate((e : any)=>{
         const filter = e.filter((e : any)=>e!==`${permissionField}`)
         return filter
      })
    }
  }

  const addUpdatePermission = (e : any)=>{
    if(e.target.checked){
      setUpdate((e : any)=>{
        return [...e , `${permissionField}`]
      })
    }
    else {
      setUpdate((e : any)=>{
         const filter = e.filter((e : any)=>e!==`${permissionField}`)
         return filter
      })
    }
  }

  const addViewPermission = (e : any)=>{
    if(e.target.checked){
      setView((e : any)=>{
        return [...e , `${permissionField}`]
      })
    }
    else {
      setView((e : any)=>{
         const filter = e.filter((e : any)=>e!==`${permissionField}`)
         return filter
      })
    }
  }

  const addRemovePermission = (e : any)=>{
    if(e.target.checked){
      setRemove((state : any)=>{
        return [...state , `${permissionField}`]
      })
    }
    else {
      setRemove((e : any)=>{
         const filter = e.filter((e : any)=>e!==`${permissionField}`)
         return filter
      })
    }
  }

  return (
    <>
    <Row style={{width : '100%'}}>
      <Col span={4}>
        <Text  code >{text}</Text>
      </Col>
      <Col span={20}>
      <Row>
      <Col span={6}>

      <Checkbox  checked={view.find((e:any)=>e=== `${permissionField}`) || false} onChange={(e)=>addViewPermission(e)}>رؤية</Checkbox>
      </Col>
      <Col span={6}>
      <Checkbox checked={create.find((e:any)=>e=== `${permissionField}`) || false} onChange={(e)=> addCreatePermission(e)}>انشاء</Checkbox>
      </Col>
      <Col span={6}>
      <Checkbox checked={update.find((e:any)=>e=== `${permissionField}`) || false} onChange={(e)=> addUpdatePermission(e)}>تعديل</Checkbox>
      </Col>
      <Col span={6}>
      <Checkbox checked={remove.find((e:any)=>e=== `${permissionField}`) || false} onChange={(e)=> addRemovePermission(e)}>حذف</Checkbox>
      </Col>
    </Row>
      </Col>
    </Row>
    <Divider />
    </>
  )
}

export default PermissionRow