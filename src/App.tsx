/* eslint-disable @typescript-eslint/no-explicit-any */

import "./App.css";
import Home from "./pages/Home/Home";
import MainNavigation from "./pages/MainNavigation/MainNavigation";
import {   RouterProvider, createBrowserRouter } from "react-router-dom";
import Products from "./pages/Products/Products";
import Ship from "./pages/Ship/Ship";
import BillsPage from "./pages/BillsPage/BillsPage";
import SingleShip from "./pages/SingleShip/SingleShip";
import AddNewOrder from "./components/AddNewOrder/AddNewOrder";
import RunningOrders from "./pages/RunningOrders/RunningOrders";
import SearchOrder from "./pages/SearchOrder/SearchOrder";
import Setting from "./pages/Setting/Setting";
import UpdateOrders from "./pages/UpdateOrders/UpdateOrders";
import SingleOrder from "./pages/SingleOrder/SingleOrder";
import ViewOrder from "./pages/ViewOrder/ViewOrder";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Login from "./pages/Login/Login";
import { useSelector } from "react-redux";
import WelcomeNotAdmin from "./pages/WelcomeNotAdmin/WelcomeNotAdmin";
import ScheduleOrders from "./pages/ScheduleOrders/ScheduleOrders";
import ReportsPage from "./pages/ReportsPage";

function App() {
  const { permissions } = useSelector((state: any) => state.auth);

  const routers = createBrowserRouter([
    {
      path: "/",
      element: <MainNavigation />,
      children: [
        ...(permissions && permissions.view && permissions.view.includes("dash")
          ? [
              { path: "/", element: <Home /> },
              { path: "/reports", element: <ReportsPage /> },
              { path: "/setting", element: <Setting /> },
            ]
          : [{ path: "/", element: <WelcomeNotAdmin /> }]),

        ...(permissions &&
        permissions.create &&
        permissions.create.includes("order")
          ? [{ path: "/createOrder", element: <AddNewOrder /> }]
          : []),

        ...(permissions &&
        permissions.view &&
        permissions.view.includes("order")
          ? [
              { path: "/SearchOrder", element: <SearchOrder /> },
              { path: "/viewOrder/:id", element: <ViewOrder /> },
            ]
          : []),

        ...(permissions &&
        permissions.update &&
        permissions.update.includes("order")
          ? [
              { path: "/SearchOrder", element: <SearchOrder /> },
              { path: "/viewOrder/:id", element: <ViewOrder /> },
              { path: "/orders/:id", element: <SingleOrder /> },
              { path: "/runningOrders", element: <RunningOrders /> },
              { path: "/updateOrders", element: <UpdateOrders /> },
              { path: "/pendingOrders", element: <BillsPage /> },
              { path: "/scheduleOrders", element: <ScheduleOrders /> },
            ]
          : []),

        ...(permissions &&
        permissions.view &&
        (permissions.view.includes("ship") ||
          permissions.create.includes("ship") ||
          permissions.update.includes("ship"))
          ? [
              { path: "/ship", element: <Ship /> },
              { path: "/ship/:id", element: <SingleShip /> },
            ]
          : []),

        ...(permissions &&
        permissions.view &&
        (permissions.view.includes("ship") ||
          permissions.create.includes("ship") ||
          permissions.update.includes("ship"))
          ? [{ path: "/products", element: <Products /> }]
          : []),

        { path: "*", element: <PageNotFound /> },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "login/*",
      element: <PageNotFound />,
    },
  ]);

  return <RouterProvider router={routers} />;
}

export default App;
