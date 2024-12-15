/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal } from "antd";

const DeleteModal = (
  deletedItem: string,
  loading: boolean,
  confirmDelete: any
) => {
  Modal.error({
    title: "هل أنت متأكد من حذف هذا العنصر",
    icon: <ExclamationCircleFilled />,
    content: `"${deletedItem}"`,
    footer: [
      <Button
        style={{ float: "inline-end", margin: "0px 10px" }}
        danger
        loading={loading}
        type="dashed"
        color="red"
        onClick={() => {
          confirmDelete();
          Modal.destroyAll();
        }}
      >
        تأكيد الحذف
      </Button>,
      <Button style={{ float: "inline-end" }} onClick={Modal.destroyAll}>
        اغلاق
      </Button>,
    ],
  });
};
export default DeleteModal;
