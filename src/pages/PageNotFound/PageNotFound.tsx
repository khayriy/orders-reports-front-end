
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
const PageNotFound = () => (
   <Result
    status="404"
    title="404"
    subTitle={'هذه الصفحة غير مجودة'}
    extra={ < Link to='/'><Button type="primary">الرجوع للرئيسية</Button></Link>
    }
  />
);
export default PageNotFound;