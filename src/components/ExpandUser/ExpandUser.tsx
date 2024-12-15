/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Form, Button, Descriptions, Input } from "antd";
import { useState } from "react";
import PermissionRow from "../PermissionRow/PermissionRow";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import DispatchInterface from "../../types/DispatchInterface";
import { updateUser } from "../../store/authSlice/authSlice";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ExpandUser = ({ record }: any) => {
  const dispatch: DispatchInterface = useDispatch();
  const { token, isWaitingForUpdateUser } = useSelector(
    (state: any) => state.auth
  );

  const [roleName, setRoleName] = useState(record.roleName);
  const [email, setEmail] = useState(record.email);
  const [view, setView] = useState(record.permission.view);
  const [create, setCreate] = useState(record.permission.create);
  const [update, setUpdate] = useState(record.permission.update);
  const [remove, setRemove] = useState(record.permission.delete);
  const [password, setPassword] = useState("");
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const updateUserHandler = () => {
    if (!password || password == "") {
      dispatch(
        updateUser({
          url: `user/${record._id}`,
          token,
          toastMessage: "تم تعديل المستخدم بنجاح",

          data: {
            email,
            roleName,
            permission: {
              view,
              create,
              update,
              remove,
            },
          },
        })
      );
    } else {
      dispatch(
        updateUser({
          url: `user/${record._id}`,
          token,
          toastMessage: "تم تعديل المستخدم بنجاح",
          id: record._id,
          data: {
            email,
            password,
            roleName,
            permission: {
              view,
              create,
              update,
              remove,
            },
          },
        })
      );
    }
  };

  const items: any = [
    {
      key: "50",
      label: "الرؤية",

      children:
        record && Object.keys(record).length > 0
          ? record.permission.view.length > 0
            ? record.permission.view
                .map((pro: any) => {
                  return pro;
                })
                .toString()
            : "----------"
          : "",
    },
    {
      key: "49",
      label: "الانشاء",
      children:
        record && Object.keys(record).length > 0
          ? record.permission.create.length > 0
            ? record.permission.create.map((pro: any) => {
                return pro;
              })
            : "----------".toString()
          : "",
    },
    {
      key: "48",
      label: "التعديل",

      children:
        record && Object.keys(record).length > 0
          ? record.permission.update.length > 0
            ? record.permission.update
                .map((pro: any) => {
                  return pro;
                })
                .toString()
            : "-----"
          : "",
    },
    {
      key: "45",
      label: "الحذف",

      children:
        record && Object.keys(record).length > 0
          ? record.permission.delete.length > 0
            ? record.permission.delete
                .map((pro: any) => {
                  return pro;
                })
                .toString()
            : "------"
          : "",
    },
    {
      key: "2",
      label: "اسم الدور",
      children:
        record && Object.keys(record).length > 0 ? `${record.roleName}` : "",
    },
    {
      key: "3",
      label: "البريد الالكتروني",
      children:
        record && Object.keys(record).length > 0 ? `${record.email}` : "",
    },
  ];
  return (
    <>
      {record && Object.keys(record).length > 0 ? (
        <>
          <Descriptions
            style={{ margin: "10px" }}
            title={
              record.roleName
                ? `تفاصيل المستخدم "${record.roleName}"`
                : "تفاصيل المستخدم"
            }
            layout="vertical"
            bordered
            items={items}
          />
          <Button
            onClick={() => setIsUpdateOpen((e: boolean) => !e)}
            type="primary"
            style={{ margin: "20px" }}
          >
            تعديل
          </Button>
          {isUpdateOpen ? (
            <Form layout="vertical" onSubmitCapture={() => updateUserHandler()}>
              {record.email === "admin@user.com" ? (
                <Form.Item
                  hasFeedback
                  validateTrigger="onBlur"
                  label={"كلمة المرور"}
                  rules={[
                    {
                      validator: async () => {
                        if (!password || password === "") {
                          return Promise.reject(
                            new Error("لابد من توافر المرور ")
                          );
                        }
                        if (password.length < 8) {
                          return Promise.reject(
                            new Error("كلمة المرور علي الاقل 8")
                          );
                        }
                      },
                    },
                  ]}
                  required={true}
                  tooltip={"  مطلوب"}
                >
                  <Input
                    size="large"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={"كلمة مرور المستخدم"}
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    hasFeedback
                    validateTrigger="onBlur"
                    label={"البريد الالكتروني"}
                    rules={[
                      {
                        validator: async () => {
                          if (!email || email === "") {
                            return Promise.reject(
                              new Error("لابد من توافر البريد ")
                            );
                          }
                          if (emailRegex.test(email) === false) {
                            return Promise.reject(
                              new Error("لابد من ادخال بريد الكتروني صالح")
                            );
                          }
                        },
                      },
                    ]}
                    required={true}
                    tooltip={"  مطلوب"}
                  >
                    <Input
                      size="large"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={"البريد الاكتروني للمستخدم"}
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    hasFeedback
                    validateTrigger="onBlur"
                    label={"اسم الدور"}
                    rules={[
                      {
                        validator: async () => {
                          if (!roleName || roleName === "") {
                            return Promise.reject(
                              new Error("لابد من توافر اسم الدور ")
                            );
                          }
                        },
                      },
                    ]}
                    required={true}
                    tooltip={"مطلوب"}
                  >
                    <Input
                      size="large"
                      value={roleName}
                      onChange={(e: any) => setRoleName(e.target.value)}
                      placeholder={"اسم الدور للمستخدم"}
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                  <Form.Item required label={"الصلاحيات"}>
                    <PermissionRow
                      view={view}
                      setView={setView}
                      create={create}
                      setCreate={setCreate}
                      update={update}
                      setUpdate={setUpdate}
                      remove={remove}
                      setRemove={setRemove}
                      text={"الشحن"}
                      permissionField="ship"
                    />

                    <PermissionRow
                      view={view}
                      setView={setView}
                      create={create}
                      setCreate={setCreate}
                      update={update}
                      setUpdate={setUpdate}
                      remove={remove}
                      setRemove={setRemove}
                      text={"الطلبات"}
                      permissionField="order"
                    />
                    <PermissionRow
                      view={view}
                      setView={setView}
                      create={create}
                      setCreate={setCreate}
                      update={update}
                      setUpdate={setUpdate}
                      remove={remove}
                      setRemove={setRemove}
                      text={"المنتجات"}
                      permissionField="product"
                    />
                  </Form.Item>

                  <Form.Item
                    hasFeedback
                    validateTrigger="onBlur"
                    label={"كلمة المرور"}
                    rules={[
                      {
                        validator: async () => {
                          if (!password || password === "") {
                            return Promise.reject(
                              new Error("لابد من توافر المرور ")
                            );
                          }
                          if (password.length < 8) {
                            return Promise.reject(
                              new Error("كلمة المرور علي الاقل 8")
                            );
                          }
                        },
                      },
                    ]}
                    required={true}
                    tooltip={"  مطلوب"}
                  >
                    <Input
                      size="large"
                      value={password}
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={"كلمة مرور المستخدم"}
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </>
              )}

              <Button
                type="primary"
                disabled={isWaitingForUpdateUser}
                htmlType="submit"
                loading={isWaitingForUpdateUser}
                style={{ width: "100%", marginTop: "1rem" }}
              >
                تعديل المستخدم
              </Button>
            </Form>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default ExpandUser;
