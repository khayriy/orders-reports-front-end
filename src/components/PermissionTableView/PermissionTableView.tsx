/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "antd";

const PermissionTableView = ({ Icon, bgColor, color, data , title }: any) => {
  
  
    return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
      }}
    >
      <Badge
        style={{
          backgroundColor: bgColor,
          fontSize: "20px",
          padding: "3px 20px",
          borderRadius: "20px",
        }}
        count={
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <Icon style={{ color: color }} />
            <span style={{ fontSize: "11px", color: color }}>{title}</span>
          </div>
        }
      ></Badge>
      {data && data.length > 0 ? (
        <div style={{display:'flex'}}>
         {data.map((e: any, index: number) => {
         return <Badge style={{fontSize :'10px', color : 'black' , backgroundColor : 'rgba(250 , 250 ,250)' }} key={index} count={e} />;
        })}
        </div>
       
      ) : (
        <Badge style={{fontSize :'10px', color : 'black' , backgroundColor : 'rgba(250 , 250 ,250)' }} count="------" />
      )}
    </div>
  );
};

export default PermissionTableView;
