import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  IssuesCloseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

const statusToIcon = (status: any) => {
  if(new Date() < new Date(status?.createdAt)) 
    return (
      <Tag icon={<ClockCircleOutlined />} color="pink">
        مجدول
      </Tag>
    );
  switch (status.status) {
    case "معلق":
      return (
        <Tag icon={<ClockCircleOutlined />} color="default">
          {status.status}
        </Tag>
      );
    case "قيد التشغيل":
      return (
        <Tag icon={<PlayCircleOutlined />} color="processing">
          {status.status}
        </Tag>
      );
    case "تم التسليم":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {status.status}
        </Tag>
      );
    case "مرتجع":
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          {status.status}
        </Tag>
      );
    case "تسليم جزئي":
      return (
        <Tag icon={<IssuesCloseOutlined />} color="success">
          {status.status}
        </Tag>
      );
    default:
      return (
        <Tag icon={<ClockCircleOutlined />} color="default">
          ------
        </Tag>
      );
  }
};

export default statusToIcon;
