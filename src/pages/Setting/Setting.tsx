/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined } from "@ant-design/icons";
import MainContainer from "../../Containers/MainContainer/MainContainer";
import AddNewUser from "../../components/AddNewUser/AddNewUser";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import DeleteModal from "../../modals/DeleteModal/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import { useEffect } from "react";
import { deleteUser, getAllUsers } from "../../store/authSlice/authSlice";
import PermissionTableView from "../../components/PermissionTableView/PermissionTableView";
import { MdOutlineCreateNewFolder } from "react-icons/md";

const Setting = () => {
  const {
    isWaitingForDeletUser,
    users,
    isWaitingForGetUsers,
    isUsersRequireRender,
  } = useSelector((state: any) => state.auth);
  const dispatch: DispatchInterface = useDispatch();

  const { token } = useSelector((state: any) => state.auth);
  useEffect(() => {
    dispatch(getAllUsers({ url: "user", token }));
  }, [isUsersRequireRender, dispatch, token]);

  const confirmDelete = (id: any) => {
    dispatch(
      deleteUser({
        token,
        url: "user",
        id: id,
        toastMessage: "تم حذف المسئول بنجاح",
      })
    );
  };
  const columns: any = [
    {
      title: "البريد الالكتروني",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "الدور",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "الصلاحيات",
      dataIndex: "",
      key: "permissions",
      render: (e: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <PermissionTableView
              bgColor="rgb(59, 216, 38 , .07)"
              color="rgb(59, 216, 38)"
              title="رؤوية"
              Icon={MdOutlineCreateNewFolder}
              data={
                e && e.permission && e.permission.view ? e.permission.view : []
              }
            />

            <PermissionTableView
              bgColor="rgb(135, 206, 235 , .07)"
              color="rgb(135, 206, 235)"
              title="انشاء"
              Icon={MdOutlineCreateNewFolder}
              data={
                e && e.permission && e.permission.create
                  ? e.permission.create
                  : []
              }
            />

            <PermissionTableView
              bgColor="rgb(255,165,0 , .08)"
              color="rgb(255,165,0)"
              title="تعديل"
              Icon={MdOutlineCreateNewFolder}
              data={
                e && e.permission && e.permission.update
                  ? e.permission.update
                  : []
              }
            />

            <PermissionTableView
              bgColor="rgb(255,0,0,.03)"
              color="rgb(255,0,0)"
              title="حذف"
              Icon={MdOutlineCreateNewFolder}
              data={
                e && e.permission && e.permission.delete
                  ? e.permission.delete
                  : []
              }
            />
          </div>
        );
      },
    },
    {
      title: "الاجرائات",
      dataIndex: "",
      key: "x",
      render: (e: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {e.email === "admin@user.com" ? null : (
            <a>
              <DeleteOutlined
                onClick={(event) => {
                  event.stopPropagation();
                  DeleteModal(e.roleName, isWaitingForDeletUser, () =>
                    confirmDelete(e._id)
                  );
                }}
              />
            </a>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      <MainContainer title="اضافة مستخدم ">
        <AddNewUser />
      </MainContainer>
      <TableWrapper
        isExpand={true}
        keyTerm="user"
        key={"user"}
        loading={isWaitingForGetUsers}
        title="جميع مسئولي النظام"
        columns={columns}
        data={users}
      />
    </>
  );
};

export default Setting;
