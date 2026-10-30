/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Layout, Menu, Button, ConfigProvider, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HourglassOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  DownOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { LuSettings, LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { TbTruckDelivery, TbReportAnalytics } from "react-icons/tb";
import { LiaWarehouseSolid } from "react-icons/lia";
import { RxUpdate } from "react-icons/rx";
import styles from "./main.module.scss";

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const SIDER_WIDTH = 240;
// 48px menu item + 12px padding on each side of the sider
const SIDER_COLLAPSED_WIDTH = 72;

const LABELS: Record<string, string> = {
  "/": "الرئيسية",
  "/reports": "التقارير",
  "/orders": "الطلبات",
  "/SearchOrder": "بحث",
  "/createOrder": "انشاء",
  "/pendingOrders": "المعلقة",
  "/scheduleOrders": "المجدولة",
  "/runningOrders": "قيد التشغيل",
  "/updateOrders": "تعديل",
  "/products": "المنتجات",
  "/ship": "الشحن",
  "/setting": "الإعدادات",
};

const ORDER_KEYS = [
  "/SearchOrder",
  "/createOrder",
  "/pendingOrders",
  "/scheduleOrders",
  "/runningOrders",
  "/updateOrders",
];

const link = (key: string) => <Link to={key}>{LABELS[key]}</Link>;

// Masar Navy dark menu. The Royal→Signal gradient on the active item lives in the SCSS.
const menuTheme = {
  components: {
    Menu: {
      darkItemBg: "transparent",
      darkSubMenuItemBg: "transparent",
      darkPopupBg: "#022865",
      darkItemColor: "rgba(255,255,255,0.62)",
      darkItemHoverColor: "#ffffff",
      darkItemHoverBg: "rgba(255,255,255,0.08)",
      darkItemSelectedColor: "#ffffff",
      darkItemSelectedBg: "transparent",
      itemHeight: 48,
      itemBorderRadius: 14,
      itemMarginInline: 0,
      itemMarginBlock: 5,
      iconSize: 20,
      collapsedIconSize: 20,
      activeBarBorderWidth: 0,
    },
  },
};

const collectKeys = (items: any[]): string[] =>
  items.flatMap((item) =>
    item ? [item.key, ...(item.children ? collectKeys(item.children) : [])] : []
  );

const group = (key: string, label: string, children: (MenuItem | false)[]): MenuItem | false => {
  const visible = children.filter(Boolean) as MenuItem[];
  return visible.length > 0 && ({ type: "group", key, label, children: visible } as MenuItem);
};

const MainNavigation = () => {
  const auth = useSelector((state: any) => state.auth);
  const { isUserLogIn, permissions } = auth;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  if (!isUserLogIn) return <Navigate to="/login" replace />;

  const can = (action: "view" | "create" | "update", resource: string) =>
    Boolean(permissions?.[action]?.includes(resource));
  const canAny = (resource: string) =>
    can("view", resource) || can("create", resource) || can("update", resource);

  // ---- current user (adjust field names to match your auth slice) ----
  const user = auth.user ?? auth.userData ?? auth;
  const userName: string =
    user?.name ?? user?.fullName ?? user?.username ?? user?.userName ?? "المستخدم";
  const userRole: string = user?.role ?? user?.roleName ?? "";
  const initial = userName.trim().charAt(0).toUpperCase();

  // TODO: replace with your real logout action, e.g. dispatch(authActions.logout())
  const handleLogout = () => dispatch({ type: "auth/logout" });

  // ---- menu ----
  const orderChildren = [
    can("view", "order") && { key: "/SearchOrder", icon: <SearchOutlined />, label: link("/SearchOrder") },
    can("create", "order") && { key: "/createOrder", icon: <PlusCircleOutlined />, label: link("/createOrder") },
    can("update", "order") && { key: "/pendingOrders", icon: <HourglassOutlined />, label: link("/pendingOrders") },
    can("update", "order") && { key: "/scheduleOrders", icon: <ClockCircleOutlined />, label: link("/scheduleOrders") },
    can("update", "order") && { key: "/runningOrders", icon: <ShoppingCartOutlined />, label: link("/runningOrders") },
    can("update", "order") && { key: "/updateOrders", icon: <RxUpdate />, label: link("/updateOrders") },
  ].filter(Boolean) as MenuItem[];

  const items = [
    group("g-main", "عام", [
      can("view", "dash") && { key: "/", icon: <LuLayoutDashboard />, label: link("/") },
      can("view", "dash") && { key: "/reports", icon: <TbReportAnalytics />, label: link("/reports") },
    ]),
    group("g-ops", "العمليات", [
      canAny("order") && {
        key: "/orders",
        icon: <TfiShoppingCartFull />,
        label: LABELS["/orders"],
        children: orderChildren,
      },
      canAny("product") && { key: "/products", icon: <TbTruckDelivery />, label: link("/products") },
      canAny("ship") && { key: "/ship", icon: <LiaWarehouseSolid />, label: link("/ship") },
    ]),
    group("g-system", "النظام", [
      can("view", "dash") && { key: "/setting", icon: <LuSettings />, label: link("/setting") },
    ]),
  ].filter(Boolean) as MenuItem[];

  // most specific matching route wins (so /products/12 still lights up "products")
  const selectedKey = collectKeys(items)
    .filter((k) => (k === "/" ? pathname === "/" : pathname === k || pathname.startsWith(`${k}/`)))
    .sort((a, b) => b.length - a.length)[0];

  const ordersOpen = ORDER_KEYS.includes(selectedKey);

  const pageTitle = ORDER_KEYS.includes(selectedKey)
    ? `${LABELS["/orders"]} – ${LABELS[selectedKey]}`
    : LABELS[selectedKey] ?? "";

  const today = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const userMenu: MenuProps = {
    items: [
      ...(can("view", "dash")
        ? ([
            { key: "settings", icon: <LuSettings />, label: link("/setting") },
            { type: "divider" },
          ] as MenuItem[])
        : []),
      { key: "logout", icon: <LuLogOut />, danger: true, label: "تسجيل الخروج", onClick: handleLogout },
    ],
  };

  return (
    <Layout
      className={styles.shell}
      data-collapsed={collapsed}
      style={{ direction: "rtl", minHeight: "100dvh" }}
    >
      <Sider
        className={styles.sider}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <div className={styles.brand}>
          <div className={styles.brandFull}>
            <img src="/logo.png" alt="logo" />
          </div>
          <div className={styles.brandMark} aria-hidden>
            م
          </div>
        </div>

        <div className={styles.menuWrap}>
          <ConfigProvider theme={menuTheme}>
            <Menu
              className={styles.menu}
              theme="dark"
              mode="inline"
              items={items}
              selectedKeys={selectedKey ? [selectedKey] : []}
              defaultOpenKeys={ordersOpen ? ["/orders"] : []}
            />
          </ConfigProvider>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.logout} onClick={handleLogout} title="تسجيل الخروج">
            <LuLogOut />
            <span className={styles.logoutLabel}>تسجيل الخروج</span>
          </button>
        </div>
      </Sider>

      <Layout className={styles.main}>
        <Header className={styles.header}>
          <Button
            className={styles.toggle}
            type="text"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((c) => !c)}
          />

          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{pageTitle}</h1>
            <span className={styles.subtitle}>{today}</span>
          </div>

          <div className={styles.actions}>
            {can("create", "order") && (
              <Button
                type="primary"
                className={styles.cta}
                icon={<PlusOutlined />}
                onClick={() => navigate("/createOrder")}
              >
                <span className={styles.ctaText}>طلب جديد</span>
              </Button>
            )}

            <span className={styles.vr} />

            <Dropdown
              menu={userMenu}
              trigger={["click"]}
              placement="bottomLeft"
              overlayClassName={styles.dropdown}
            >
              <button type="button" className={styles.user}>
                <span className={styles.avatar}>{initial}</span>
                <span className={styles.userText}>
                  <b>{userName}</b>
                  {userRole && <small>{userRole}</small>}
                </span>
                <DownOutlined className={styles.caret} />
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content className={styles.content}>
          <div className={styles.page}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainNavigation;