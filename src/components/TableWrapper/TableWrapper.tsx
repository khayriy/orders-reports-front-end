/* eslint-disable @typescript-eslint/no-explicit-any */
import MainContainer from "../../Containers/MainContainer/MainContainer";
import { FloatButton } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExpandProductList from "../ExpandProductList/ExpandProductList";
import ExpandShip from "../ExpandShip/ExpandShip";
import { SearchOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import ExpandOrderSummary from "../ExpandOrderSummary/ExpandOrderSummary";
import ExpandUser from "../ExpandUser/ExpandUser";
import FormatDate from "../../helpers/FormatDate/FormatDate";
interface TableWrapperInterface {
  data: any;
  columns: any;
  title: string;
  loading: boolean;
  keyTerm: string;
  isExpand?: boolean;
}
const TableWrapper = ({
  data,
  columns,
  title,
  loading,
  keyTerm,
  isExpand,
}: TableWrapperInterface) => {

 

 
  const exportToExcel = () => {
    // Check if data is empty or undefined
    if (!data || data.length === 0) {
      alert("Data array is empty or undefined.");
      return;
    }
  
    // Create a new workbook and add the data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row: any) => {
        // Create a new object to hold the filtered data for the row
        const filteredRow: any = {};
  
        // Map all necessary fields from the original row to the filteredRow
        filteredRow["رقم الطلب"] = row.id ?? "";
        filteredRow["اسم العميل"] = row.name ?? "";
        filteredRow["رقم الهاتف"] = row.phone ?? "";
        if (row.anotherPhone) {
          filteredRow["رقم هاتف اخر"] = row.anotherPhone;
        }
        filteredRow["السعر"] = row.price ?? "";
        filteredRow["وقت الكتابة"] = row.createdAt ? FormatDate(row.createdAt) : "";
        
        if (row.updates) {
          const time = row.updates.filter((e: any) => e.info === "تم التشغيل");
          if (time.length > 0) {
            const lastUpdate = time.pop();
            if (lastUpdate) {
              filteredRow["وقت التشغيل"] = FormatDate(lastUpdate.timestamp);
            }
          } else {
            filteredRow["وقت التشغيل"] = "---";
          }
        } else {
          filteredRow["وقت التشغيل"] = "---";
        }
  
        if (row.ship) {
          filteredRow["الشحن"] = row.ship.name ?? "";
          filteredRow["رقم هاتف مسئول الشحن"] = row.ship.phone ?? "";
        }
  
        filteredRow["الحالة"] = row.status ?? "";
  
        // Extract and format products information
        if ("products" in row && Array.isArray(row["products"])) {
          const productsInfo = row["products"].map((product: any) => {
            console.log(product)
            
            let productInfo = `${product?.product?.name} - الكمية: ${product?.product?.quantity}`;
            if ("type" in product?.product) {
              productInfo += ` / النوع: ${product?.product?.type?.name}`;
            }
            return productInfo;
          });
          console.log(productsInfo)
          filteredRow["المنتجات"] = productsInfo?.toString();
        }
        
        filteredRow["المدينة"] = row.country ?? "";
        if ("country" in row) {
          const country = row["country"];
          const commaIndex = country.indexOf(",");
          if (commaIndex !== -1) {
            const citizen = country.substring(0, commaIndex).trim();
            filteredRow["المحافظة"] = citizen;
          }
        }
  
        filteredRow["العنوان"] = row.address ?? "";
  
       
  
        return filteredRow;
      })
    );
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Generate the Excel file and download it
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, "data-export.xlsx");
  };
  
  

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any
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
    dataIndex: any,
    title: string
  ): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`بحث ب ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />

        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
          >
            بحث
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch(selectedKeys as string[], confirm, dataIndex);
              close();
            }}
            size="small"
            style={{ width: 90 }}
          >
            إعادة ضبط
          </Button>
        </Space>
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

  const formattedColumns = columns.map((e: any) => {
    if (e && e.search && e.search == true) {
      return { ...e, ...getColumnSearchProps(e.dataIndex, e.title) };
    } else {
      return e;
    }
  });
  return (
    <MainContainer title={title}>
      <FloatButton
        type="primary"
        onClick={exportToExcel}
        style={{
          boxShadow: "none",
          position: "absolute",
          left: "5px",
          top: "5px",
         
        }}
        tooltip={<div>تنزيل ملف الاكسيل</div>}
      />
      
      <Table
        loading={loading}
        rowKey={(e) => e._id}
        expandable={
          isExpand
            ? {
                expandRowByClick: true,

                expandedRowRender: (record, index) => {
                  if (keyTerm === "product") {
                    return <ExpandProductList product={record} key={index} />;
                  } else if (keyTerm === "ship") {
                    return <ExpandShip record={record} key={index} />;
                  } else if (
                    keyTerm === "orderByPhone" ||
                    keyTerm === "orderByName"
                  ) {
                    return <ExpandOrderSummary record={record} key={index} />;
                  } else if (keyTerm === "user") {
                    return <ExpandUser record={record} key={index} />;
                  }

                  return null;
                },
                rowExpandable: (record) => record._id,
              }
            : undefined
        }
        columns={formattedColumns}
        dataSource={data}
        style={{ direction: "rtl"  }}
        id="my-table"
        scroll={{ x: "max-content"}} 
        bordered
        pagination={{
         
          showSizeChanger: true,
          pageSizeOptions: [ '20', '50', '100' , '200'],
        }}
      />
      
      
    </MainContainer>
  );
};
export default TableWrapper;
