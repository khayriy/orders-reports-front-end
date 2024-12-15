
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;
import styles from './date.module.scss'
const DatePickerComponent = () => {
  return (
    <div className={styles.dateMain}>
    <h2>اختر تاريخ البداية والنهاية</h2>
    <RangePicker style={{marginInlineStart : '20px' }}/>
    </div>
    
  )
}

export default DatePickerComponent