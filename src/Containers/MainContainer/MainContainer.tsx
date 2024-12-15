import { Col, Card, Collapse } from "antd";
import { ReactNode } from "react";

interface formContainerProps {
  children: ReactNode;
  title: string;
  isCollapse?: boolean;
}
const MainContainer = ({ children, title, isCollapse }: formContainerProps) => {
  return (
    <Col xs={{ span: 24 }} lg={{ span: 24 }} style={{position : 'relative'}}>
      {isCollapse ? (
        <Collapse
          size="large"
          style={{ border: "", marginBottom: "10px" }}
          items={[{ key: "1", label: title, children: children }]}
        />
      ) : (
        <Card title={title}>{children}</Card>
      )}
    </Col>
  );
};

export default MainContainer;
