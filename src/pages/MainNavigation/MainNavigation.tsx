/* eslint-disable @typescript-eslint/no-explicit-any */
import  {  useEffect, useState } from "react";

import { Layout, Menu, Button } from "antd";
import styles from "./main.module.scss";
const { Header, Sider, Content } = Layout;
import { LuSettings, LuLayoutDashboard } from "react-icons/lu";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { TbTruckDelivery } from "react-icons/tb";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HourglassOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { LiaWarehouseSolid } from "react-icons/lia";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import { useSelector } from "react-redux";

const MainNavigation  = () => {
  const { isUserLogIn } = useSelector((state: any) => state.auth);

  const { permissions } = useSelector((state: any) => state.auth);

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  //or simply use const [current, setCurrent] = useState(location.pathname)

  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(location.pathname);
      }
    }
  }, [location, current]);

  function handleClick(e: any) {
    setCurrent(e.key);
  }

  if (!isUserLogIn) return <Navigate to="/login" replace={true} />;
  return (
    <Layout style={{ direction: "rtl", minHeight: "100dvh" }}>
      <Sider
        className={styles.sider}
        trigger={null}
        collapsedWidth={70}
        collapsible
        collapsed={collapsed}
      >
        <Menu
          className={styles.menu}
          mode="inline"
          onClick={handleClick}
          selectedKeys={[current]}
          items={[
            permissions && permissions.view &&
            permissions.view.includes("dash") 
            ?
            
            {
              key: "/",
              icon: <LuLayoutDashboard />,
              label: <Link to="/">الرئيسية</Link>,
            } 
            : null ,
            permissions && permissions.view &&
            permissions.view.includes("dash") 
            ?
            
            {
              key: "/reports",
              icon: <LuLayoutDashboard />,
              label: <Link to="/reports">التقارير</Link>,
            } 
            : null
            , 
            permissions &&
            permissions.update &&
            (permissions.update.includes("order")
            || permissions.create.includes("order")
            || permissions.view.includes("order")
            )?
            {
              key: "/orders",
              icon: <TfiShoppingCartFull />,
              label: "الطلبات",
              children: [
                permissions &&
                permissions.view &&
                permissions.view.includes("order") ? 
                {
                  key: "/SearchOrder",
                  label: <Link to="/SearchOrder">بحث </Link>,
                  icon: <PlusCircleOutlined />,
                } : null ,
                permissions &&
        permissions.create &&
        permissions.create.includes("order") ? 
                {
                  key: "/createOrder",
                  label: <Link to="/createOrder">انشاء </Link>,
                  icon: <PlusCircleOutlined />,
                } : null,
                permissions &&
                permissions.update &&
                permissions.update.includes("order") ?
               
                {
                  key: "/pendingOrders",
                  label: <Link to="/pendingOrders"> المعلقة</Link>,
                  icon: <HourglassOutlined />,
                } : null , 
                permissions &&
                permissions.update &&
                permissions.update.includes("order") ?
               
                {
                  key: "/scheduleOrders",
                  label: <Link to="/scheduleOrders"> المجدولة</Link>,
                  icon: <HourglassOutlined />,
                } : null , 
                permissions &&
                permissions.update &&
                permissions.update.includes("order") ?
                {
                  key: "/runningOrders",
                  label: <Link to="/runningOrders"> قيد التشغيل</Link>,
                  icon: <ShoppingCartOutlined />,
                } : null,
                permissions &&
                permissions.update &&
                permissions.update.includes("order") ?
                {
                  key: "/updateOrders",
                  label: <Link to="/updateOrders">تعديل</Link>,
                  icon: <RxUpdate />,
                } : null ,
              ],
            } : null,
            
            permissions &&
            permissions.update &&
            (permissions.update.includes("product")
            || permissions.create.includes("product")
            || permissions.view.includes("product")
            )?
            {
              key: "/products",
              icon: <TbTruckDelivery />,
              label: <Link to="/products">المنتجات</Link>,
            } : null,
            permissions &&
            permissions.update &&
            (permissions.update.includes("ship")
            || permissions.create.includes("ship")
            || permissions.view.includes("ship")
            )?
            {
              key: "/ship",
              icon: <LiaWarehouseSolid />,
              label: <Link to="/ship">الشحن</Link>,
            } : null,
            permissions && permissions.view &&
            permissions.view.includes("dash") 
            ?
            {
             
              key: "/setting",
              icon: <LuSettings />,
              label: <Link to="/setting">الإعدادات</Link>,
            }
            : null
          ]}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <img
            style={{ alignSelf: "end", marginInlineEnd: "20px", width: "15%" }}
            src="/logo.png"
          />
        </Header>
        <Content
          style={{
            margin: "0px 16px",
            marginTop: "3rem",
            padding: 24,
            minHeight: 280,
            height: "100%",
          }}
        >
          <div
            style={{
              marginInlineStart: collapsed ? "5rem" : "12rem",
              transition: "all 0.3s,background 0s",
            }}
          >
            <Outlet />
           
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainNavigation;
