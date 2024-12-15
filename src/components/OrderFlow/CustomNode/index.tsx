import { LuCalendar } from "react-icons/lu";
import { Handle, Position } from "reactflow";
import FormatDate from "../../../helpers/FormatDate/FormatDate";
import statusOfInfo from "../handlers/statusOfInfo";

const CustomNode = ({ data }: any) => {
  return (
    <div
      style={{
        padding: "10px",
        margin: "10px 0px",
        boxShadow: "1px 2px 10px 1px #ddd",
        borderRadius: "10px",
        width: "200px",
        background: "#fff",
        border: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "max-content",
            borderRadius: "3px",
            padding: "3px",
            fontSize: "28px",
          }}
        >
          {statusOfInfo(data?.info)}
        </div>
      </div>
      <div
        style={{
          direction: "rtl",
          fontWeight: "bold",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {data.info !== "تم الكتابة" && ` التعديل : `}
        {`  ${data?.info}`}
      </div>
      <div
        style={{
          direction: "rtl",
          fontWeight: "bold",
          marginBottom: "5px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {FormatDate(data?.timestamp)}
        <LuCalendar />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default CustomNode;
