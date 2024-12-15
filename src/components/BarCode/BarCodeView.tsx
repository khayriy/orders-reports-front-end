/* eslint-disable @typescript-eslint/no-explicit-any */
import Barcode from 'react-jsbarcode';
const BarCodeView = ({value} : any) => {
 
  return (
    <>
   <div className="div" style={{display : 'flex' , flexDirection : 'column' , alignItems : 'center' , margin : '0px'}}>
   <Barcode style={{margin : '0px'}} value={`senorita${value}`}  options={{ format: 'code128' , height : 40 }}  />
   </div>
    </>
  )
}
export default BarCodeView