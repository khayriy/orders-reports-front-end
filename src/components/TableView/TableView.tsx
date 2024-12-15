import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import type { InputRef } from "antd";
import { Button, FloatButton, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import StatusFilter from "../StatusFilter/StatusFilter";
import FilterTable from "../FilterTable/FilterTable";
import MainContainer from "../../Containers/MainContainer/MainContainer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
interface DataType {
  key: string;
  name: string;
  address: string;
  order_date: string;
  price: string;
  status: string;
  order_id: string;
  order_deliver_date: string;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    key: "1",
    price: "50",
    status: "تم التسليم",
    order_date: "20/7/2021",
    order_id: "25555852",
    name: " محمد صلاح",
    order_deliver_date: "20/5/2021",

    address: "الجيزة / الجيزة",
  },
  {
    key: "2",
    price: "50",
    status: "تم التسليم",
    order_date: "20/7/2021",
    order_id: "25555852",
    name: " محمد صلاح",
    order_deliver_date: "20/5/2021",

    address: "الجيزة / الجيزة",
  },
  {
    key: "3",
    price: "50",
    status: "تم التسليم",
    order_date: "20/7/2021",
    order_id: "25555852",
    name: " محمد صلاح",
    order_deliver_date: "20/5/2021",

    address: "الجيزة / الجيزة",
  },
  {
    key: "4",
    price: "50",
    status: "تم التسليم",
    order_date: "20/7/2021",
    order_id: "25555852",
    name: " احمد صلاح",
    order_deliver_date: "20/5/2021",
    address: "الجيزة / الجيزة",
  },
];

const TableView: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const exportToExcel = () => {
    // Get the table data
    const table = document.getElementById("my-table");
    const tableData = XLSX.utils.table_to_sheet(table);

    // Create a new workbook and add the table data
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, tableData, "Sheet1");

    // Generate the Excel file and download it
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "table-data.xlsx");
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    title: string
  ): ColumnType<DataType> => ({
    filterDropdown: ({ selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {dataIndex === "status" ? (
          <StatusFilter />
        ) : (
          <>
            <Input
              ref={searchInput}
              placeholder={`بحث ب ${title}`}
              value={selectedKeys[0]}
              onChange={() => {}}
              onPressEnter={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              style={{ marginBottom: 8, display: "block" }}
            />

            <Space>
              <Button
                type="primary"
                // onClick={() =>
                //   handleSearch(selectedKeys as string[], confirm, dataIndex)
                // }
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                بحث
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                إعادة ضبط
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });

                  setSearchedColumn(dataIndex);
                }}
              >
                فلتر
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                غلق
              </Button>
            </Space>
          </>
        )}
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "رقم الطلب",
      dataIndex: "order_id",
      key: "order_id",

      ...getColumnSearchProps("order_id", "رقم الطلب"),
    },
    {
      title: "تاريخ الطلب",
      dataIndex: "order_date",
      key: "order_date",
    },
    {
      title: "تاريخ التوصيل",
      dataIndex: "order_deliver_date",
      key: "order_deliver_date",
    },
    {
      title: "اسم العميل",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "سعر الطلب",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "العنوان",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <MainContainer title="الطلبات">
      {/* <TableTabs /> */}
      <FloatButton
        type="primary"
        onClick={exportToExcel}
        style={{
          boxShadow: "none",
          position: "absolute",
          left: "5px",
          top: "5px",
          alignSelf: "center",
        }}
        tooltip={<div>تنزيل ملف الاكسيل</div>}
      />
      <FilterTable />
      <Table
        columns={columns}
        dataSource={data}
        style={{ direction: "rtl", overflowY: "auto" }}
        id="my-table"
      />
    </MainContainer>
  );
};

export default TableView;
