/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { LuInbox } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import AddNewUser from "../../components/AddNewUser/AddNewUser";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import PermissionTableView from "../../components/PermissionTableView/PermissionTableView";
import DeleteModal from "../../modals/DeleteModal/DeleteModal";
import DispatchInterface from "../../types/DispatchInterface";
import { deleteUser, getAllUsers } from "../../store/authSlice/authSlice";
import styles from "./setting.module.scss";

const PROTECTED_EMAIL = "admin@user.com";

const Setting = () => {
  const dispatch: DispatchInterface = useDispatch();
  const { isWaitingForDeletUser, users, isWaitingForGetUsers, isUsersRequireRender, token } = useSelector(
    (state: any) => state.auth
  );

  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers({ url: "user", token }));
  }, [dispatch, token, isUsersRequireRender]);

  const list: any[] = users ?? [];

  const confirmDelete = (id: any) => {
    dispatch(
      deleteUser({
        token,
        url: "user",
        id,
        toastMessage: "تم حذف المسئول بنجاح",
      })
    );
  };

  const columns: any = [
    {
      title: "البريد الالكتروني",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <span className={styles.person}>
          <span className={styles.avatar} aria-hidden>
            {String(email ?? "").charAt(0).toUpperCase()}
          </span>
          <span dir="ltr" className={styles.email}>
            {email}
          </span>
          {email === PROTECTED_EMAIL && <span className={styles.primary}>أساسي</span>}
        </span>
      ),
    },
    {
      title: "الدور",
      dataIndex: "roleName",
      key: "roleName",
      render: (role: string) => <span className={styles.role}>{role}</span>,
    },
    {
      title: "الصلاحيات",
      dataIndex: "",
      key: "permissions",
      render: (e: any) => {
        const p = e?.permission ?? {};
        return (
          <div className={styles.perms}>
            <PermissionTableView title="رؤية" color="#12a150" Icon={EyeOutlined} data={p.view} />
            <PermissionTableView title="انشاء" color="#0a84ff" Icon={PlusOutlined} data={p.create} />
            <PermissionTableView title="تعديل" color="#ffb020" Icon={EditOutlined} data={p.update} />
            <PermissionTableView title="حذف" color="#e5484d" Icon={DeleteOutlined} data={p.delete} />
          </div>
        );
      },
    },
    {
      title: "الاجرائات",
      dataIndex: "",
      key: "x",
      render: (e: any) =>
        e.email === PROTECTED_EMAIL ? null : (
          <button
            type="button"
            className={styles.delete}
            aria-label={`حذف ${e.roleName ?? ""}`}
            onClick={(event) => {
              event.stopPropagation();
              DeleteModal(e.roleName, isWaitingForDeletUser, () => confirmDelete(e._id));
            }}
          >
            <DeleteOutlined />
          </button>
        ),
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.head}>
          <h2 className={styles.sectionTitle}>
            مسئولو النظام
            {!isWaitingForGetUsers && list.length > 0 && <span className={styles.count}>{list.length}</span>}
          </h2>

          <Button
            type="primary"
            className={styles.addBtn}
            icon={isAddOpen ? <CloseOutlined /> : <PlusOutlined />}
            onClick={() => setIsAddOpen((v) => !v)}
            aria-expanded={isAddOpen}
          >
            {isAddOpen ? "إغلاق" : "مستخدم جديد"}
          </Button>
        </div>

        {isAddOpen && (
          <div className={styles.reveal}>
            <AddNewUser onSuccess={() => setIsAddOpen(false)} />
          </div>
        )}

        {!isWaitingForGetUsers && list.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <LuInbox />
            </span>
            <strong className={styles.emptyTitle}>لا يوجد مسئولون</strong>
            <span className={styles.emptyHint}>ابدأ بإضافة أول مستخدم من الزر «مستخدم جديد».</span>
          </div>
        ) : (
          <TableWrapper
            isExpand={true}
            keyTerm="user"
            key="user"
            loading={isWaitingForGetUsers}
            title="جميع مسئولي النظام"
            columns={columns}
            data={list}
          />
        )}
      </section>
    </div>
  );
};

export default Setting;