/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { TbPackage, TbPackages, TbPackageOff } from "react-icons/tb";
import { LuInbox } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import AddNewProduct from "../../components/AddNewProduct/AddNewProduct";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import SingleStatistic from "../../components/SingleStatistic/SingleStatistic";
import statStyles from "../../components/SingleStatistic/staistic.module.scss";
import DispatchInterface from "../../types/DispatchInterface";
import { getAllProducts } from "../../store/productSlice/productSlice";
import styles from "./products.module.scss";

const isOut = (q: any) => q === 0 || q === "0";
const MAX_CHIPS = 4;

const Products = () => {
  const dispatch: DispatchInterface = useDispatch();
  const { permissions, token } = useSelector((state: any) => state.auth);
  const { isProductsRequireRender, productsDB, isWaitingForGetProducts } = useSelector(
    (state: any) => state.product
  );

  const [isAddOpen, setIsAddOpen] = useState(false);

  const canCreate = Boolean(permissions?.create?.includes("product"));
  const canUpdate = Boolean(permissions?.update?.includes("product"));

  useEffect(() => {
    dispatch(getAllProducts({ url: "product", token }));
  }, [dispatch, token, isProductsRequireRender]);

  const products: any[] = productsDB ?? [];

  const stats = useMemo(
    () => ({
      total: products.length,
      withTypes: products.filter((p) => p.type && p.type.length > 0).length,
      outOfStock: products.filter((p) => isOut(p.quantity)).length,
      units: products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0),
    }),
    [products]
  );

  const columns: ColumnsType<any> = [
    {
      title: "اسم المنتج",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <strong className={styles.name}>{name}</strong>,
    },
    {
      title: "عدد الانواع",
      dataIndex: "type",
      key: "typeCount",
      render: (types?: any[]) =>
        !types || types.length === 0 ? (
          <span className={styles.muted}>—</span>
        ) : (
          <span className={styles.countChip}>{types.length}</span>
        ),
    },
    {
      title: "الانواع",
      dataIndex: "type",
      key: "types",
      render: (types?: any[]) =>
        !types || types.length === 0 ? (
          <span className={styles.muted}>لا يوجد انواع داخلية</span>
        ) : (
          <div className={styles.chips}>
            {types.slice(0, MAX_CHIPS).map((item: any, index: number) => (
              <span className={styles.chip} key={index}>
                {item.name}
              </span>
            ))}
            {types.length > MAX_CHIPS && (
              <span className={cls(styles.chip, styles.more)}>+{types.length - MAX_CHIPS}</span>
            )}
          </div>
        ),
    },
    {
      title: "اجمالي المخزن",
      dataIndex: "quantity",
      key: "quantity",
      render: (q: any) =>
        isOut(q) ? (
          <span className={styles.stock}>
            <span className={styles.qty}>0</span>
            <span className={styles.out}>نفد</span>
          </span>
        ) : (
          <span className={styles.qty}>{q}</span>
        ),
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>نظرة عامة</h2>
        <div className={statStyles.grid}>
          <SingleStatistic
            loading={isWaitingForGetProducts}
            title="عدد المنتجات"
            value={stats.total}
            color="#0a84ff"
            Icon={TbPackage}
          />
          <SingleStatistic
            loading={isWaitingForGetProducts}
            title="منتجات بأنواع داخلية"
            value={stats.withTypes}
            total={stats.total}
            color="#0143a0"
            Icon={TbPackages}
          />
          <SingleStatistic
            loading={isWaitingForGetProducts}
            title="منتجات نفد مخزونها"
            value={stats.outOfStock}
            total={stats.total}
            color="#e5484d"
            Icon={TbPackageOff}
          />
          <SingleStatistic
            loading={isWaitingForGetProducts}
            title="إجمالي الوحدات في المخزن"
            value={stats.units}
            color="#12a150"
            Icon={TbPackage}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.head}>
          <h2 className={styles.sectionTitle}>
            المنتجات داخل المخزن
            {!isWaitingForGetProducts && products.length > 0 && (
              <span className={styles.count}>{products.length}</span>
            )}
          </h2>

          {canCreate && (
            <Button
              type="primary"
              className={styles.addBtn}
              icon={isAddOpen ? <CloseOutlined /> : <PlusOutlined />}
              onClick={() => setIsAddOpen((v) => !v)}
              aria-expanded={isAddOpen}
            >
              {isAddOpen ? "إغلاق" : "منتج جديد"}
            </Button>
          )}
        </div>

        {canCreate && isAddOpen && (
          <div className={styles.reveal}>
            <AddNewProduct />
          </div>
        )}

        {!isWaitingForGetProducts && products.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <LuInbox />
            </span>
            <strong className={styles.emptyTitle}>لا توجد منتجات في المخزن</strong>
            <span className={styles.emptyHint}>
              {canCreate ? "ابدأ بإضافة أول منتج من الزر «منتج جديد»." : "لم تتم إضافة منتجات بعد."}
            </span>
          </div>
        ) : (
          <TableWrapper
            isExpand={canUpdate}
            keyTerm="product"
            key="products"
            loading={isWaitingForGetProducts}
            title="المنتجات داخل المخزن"
            columns={columns}
            data={products}
          />
        )}
      </section>
    </div>
  );
};

const cls = (...c: string[]) => c.join(" ");

export default Products;