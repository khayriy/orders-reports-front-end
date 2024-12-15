/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import MainContainer from "../../Containers/MainContainer/MainContainer";
import AddNewProduct from "../../components/AddNewProduct/AddNewProduct";
import { ColumnsType } from "antd/es/table";
import TableWrapper from "../../components/TableWrapper/TableWrapper";
import DispatchInterface from "../../types/DispatchInterface";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  
  getAllProducts,
} from "../../store/productSlice/productSlice";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  
} from "@ant-design/icons";

interface DataType {
  id: React.Key;
  name: string;
  subName: string;
  stock: string;
  type?: [{ name: string; quantity: number }];
}
const Products = () => {
  const { permissions } = useSelector((state: any) => state.auth);
  
  const dispatch: DispatchInterface = useDispatch();
  const {
    isProductsRequireRender,
    productsDB,
    isWaitingForGetProducts,
    
  } = useSelector((state: any) => state.product);

  const {token} = useSelector((state : any)=>state.auth)

  const isHaveAuthToCreate = permissions && permissions.create.includes('product') ? true : false
  const isHaveAuthToUpdate = permissions && permissions.update.includes('product') ? true : false
  useEffect(() => {
    dispatch(getAllProducts({ url: "product" , token}));
  }, [dispatch, isProductsRequireRender]);

  // const confirmDelete = (id: any) => {
  //   // delete function
  //   dispatch(
  //     deleteProduct({
  //       url: "product",
  //       id: id,
  //       toastMessage: "تم حذف المنتج بنجاح",
  //     })
  //   );
  // };

  const columns: ColumnsType<DataType> = [
    {
      title: "اسم المنتج",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "عدد الانواع",
      dataIndex: "type",
      key: "type",
      render: (e) => {
        if (e.length === 0 || !e) {
          return (
            <Tag color="volcano" icon={<CloseCircleOutlined />}>
              ----
            </Tag>
          );
        }
        if (e) {
          return <Tag icon={<CheckCircleOutlined />}>{e.length}</Tag>;
        }
      },
    },
    {
      title: " الانواع",
      dataIndex: "type",
      key: "type",
      render: (e) => {
        if (e.length === 0 || !e) {
          return <Tag color="volcano">لايوجد انواع داخلية</Tag>;
        }
        if (e) {
          return (
            <div style={{ display: "flex" }}>
              {e.map((item: any, index: number) => {
                return (
                  <Tag color="geekblue" key={index}>
                    {item.name}
                  </Tag>
                );
              })}
            </div>
          );
        }
      },
    },
    {
      title: "اجمالي المخزن",
      dataIndex: "quantity",
      key: "quantity",
    },
    // {
    //   title: "الاجرائات",
    //   dataIndex: "",
    //   key: "x",
    //   render: (e) => (
    //     <a>
    //       <DeleteOutlined
    //         onClick={(event) => {
    //          event.stopPropagation()
    //           DeleteModal(e.name, isWaitingForDeleteProduct, () =>
    //           confirmDelete(e._id)
    //         )
    //         }
             
    //         }
    //       />
    //     </a>
    //   ),
    // },
  ];
  return (
    <>
      {isHaveAuthToCreate ?  
      <MainContainer title="اضافة منتج جديد" isCollapse={true}>
       <AddNewProduct />
      </MainContainer>
      : null
      }
      <TableWrapper
        isExpand={isHaveAuthToUpdate}
        keyTerm="product"
        key={"products"}
        loading={isWaitingForGetProducts}
        title="المتجات داخل المخزن"
        columns={columns}
        data={productsDB}
      />
    </>
  );
};

export default Products;
