interface EndorsementInterface {
  name: string;
  phone: string;
  num: string;
  price: string;
}
const Endorsement = ({ name, phone, num, price }: EndorsementInterface) => {
  return (
    <div style={{pageBreakInside: 'avoid' , border : '1.5px solid black' , fontWeight : '800' , padding : '2px'}}>
      <h3 style={{ borderBottom: "1px solid black", textAlign: "center" }}>
        اقرار استلام
      </h3>
      <p style={{ textAlign: "right" }}>
        {`استلمت انا / ${name} / مندوب تسليم مرتجعات رقم هاتف / ${phone} الشحنات الموضحة عالية بالجدول المرفق وعددها / ${num} شحنات / وقيمتها ${price} جنيه مصري لاغير . وأتعهد بالمحافظة عليها بالحالة التي تسلمتها عليها الي الشركة وفي حالة التلف او الفقد دون مصوغ قانوني أكون متحملا المسئولية المدنية والجنائية قبل الشركة وهذا اقرار مني بالاستلام .`}
      </p>
      <div className="div" style={{ textAlign: "center", direction: "rtl" }}>
        <span>الاســــم / </span>
        <br />
        <span>التـوقيـع / </span>
        <br />
        <span>التــاريـخ / </span>
      </div>
    </div>
  );
};

export default Endorsement;
