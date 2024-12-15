/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import MainContainer from "../../Containers/MainContainer/MainContainer";
import AddNewShip from "../../components/AddNewShip/AddNewShip";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import { useEffect } from "react";
import DispatchInterface from "../../types/DispatchInterface";
import {  getAllShips } from "../../store/shipSlice/shipSlice";
import {  EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const Ship = () => {
  const { permissions } = useSelector((state: any) => state.auth);
 
  const isHaveAuthToCreate = permissions &&permissions.create&& permissions.create.includes('ship') ? true : false
  const isHaveAuthToUpdate = permissions && permissions.update && permissions.update.includes('ship') ? true : false
  const isHaveAuthToView = permissions && permissions.view && permissions.view.includes('ship') ? true : false
  const {
    isWaitingForShips,
    ships,
    
    isShipsRequireRender,
  } = useSelector((state: any) => state.ship);
  const dispatch: DispatchInterface = useDispatch();

  const {token} = useSelector((state : any)=>state.auth)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllShips({ url: "ship" , token }));
  }, [isShipsRequireRender, dispatch]);

  const columns: any = [
    {
      title: "اسم المسئول",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phone",
      key: "phone",
    },
    isHaveAuthToView ?
    {
      title: "الاجرائات",
      dataIndex: "",
      key: "x",
      render: (e : any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* <a>
            <DeleteOutlined
              onClick={(event) => {
                event.stopPropagation();
                DeleteModal(e.name, isWaitingForDeleteShip, () =>confirmDelete(e._id) )
                
              }}
            />
          </a> */}
          <a>
            <EyeOutlined onClick={() => navigate(`/ship/${e._id}`)} />
          </a>
        </div>
      ),
    } 
    : null ,
  ];
  // const confirmDelete = (id: any) => {
  //   // delete function
  //   dispatch(
  //     deleteShip({
  //       url: "ship",
  //       id: id,
  //       token ,
  //       toastMessage: "تم حذف  مسئول الشحن بنجاح",
  //     })
  //   );
  // };
  return (
    <>
    {isHaveAuthToCreate
    ?
    <MainContainer title="اضافة مسئول شحن" isCollapse={true}>
    <AddNewShip />
  </MainContainer>
: null
    }
      <TableWrapper
        isExpand={isHaveAuthToUpdate}
        keyTerm="ship"
        key={"ships"}
        loading={isWaitingForShips}
        title="جميع مسئولي الشحن"
        columns={columns}
        data={ships}
      />
    </>
  );
};
export default Ship;
