/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "antd";
import { CloseOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { LuInbox } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddNewShip from "../../components/AddNewShip/AddNewShip";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import DispatchInterface from "../../types/DispatchInterface";
import { getAllShips } from "../../store/shipSlice/shipSlice";
import styles from "./ship.module.scss";

const Ship = () => {
  const dispatch: DispatchInterface = useDispatch();
  const { permissions, token } = useSelector((state: any) => state.auth);
  const { isWaitingForShips, ships, isShipsRequireRender } = useSelector((state: any) => state.ship);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const canCreate = Boolean(permissions?.create?.includes("ship"));
  const canUpdate = Boolean(permissions?.update?.includes("ship"));
  const canView = Boolean(permissions?.view?.includes("ship"));

  useEffect(() => {
    dispatch(getAllShips({ url: "ship", token }));
  }, [dispatch, token, isShipsRequireRender]);

  const list: any[] = ships ?? [];

  const columns: any = [
    {
      title: "اسم المسئول",
      dataIndex: "name",
      key: "name",
      search: true,
      render: (name: string) => (
        <span className={styles.person}>
          <span className={styles.avatar} aria-hidden>
            {String(name ?? "").trim().charAt(0)}
          </span>
          <strong className={styles.name}>{name}</strong>
        </span>
      ),
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phone",
      key: "phone",
      search: true,
      render: (phone: string) => (
        <span dir="ltr" className={styles.phone}>
          {phone}
        </span>
      ),
    },
    ...(canView
      ? [
          {
            title: "الاجرائات",
            dataIndex: "",
            key: "x",
            render: (e: any) => (
              <Link
                to={`/ship/${e._id}`}
                className={styles.view}
                onClick={(event) => event.stopPropagation()}
              >
                <EyeOutlined />
                عرض
              </Link>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.head}>
          <h2 className={styles.sectionTitle}>
            مسئولو الشحن
            {!isWaitingForShips && list.length > 0 && <span className={styles.count}>{list.length}</span>}
          </h2>

          {canCreate && (
            <Button
              type="primary"
              className={styles.addBtn}
              icon={isAddOpen ? <CloseOutlined /> : <PlusOutlined />}
              onClick={() => setIsAddOpen((v) => !v)}
              aria-expanded={isAddOpen}
            >
              {isAddOpen ? "إغلاق" : "مسئول شحن جديد"}
            </Button>
          )}
        </div>

        {canCreate && isAddOpen && (
          <div className={styles.reveal}>
            <AddNewShip onSuccess={() => setIsAddOpen(false)} />
          </div>
        )}

        {!isWaitingForShips && list.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <LuInbox />
            </span>
            <strong className={styles.emptyTitle}>لا يوجد مسئولو شحن</strong>
            <span className={styles.emptyHint}>
              {canCreate ? "ابدأ بإضافة أول مسئول من الزر «مسئول شحن جديد»." : "لم تتم إضافة مسئولين بعد."}
            </span>
          </div>
        ) : (
          <TableWrapper
            isExpand={canUpdate}
            keyTerm="ship"
            key="ships"
            loading={isWaitingForShips}
            title="جميع مسئولي الشحن"
            columns={columns}
            data={list}
          />
        )}
      </section>
    </div>
  );
};

export default Ship;