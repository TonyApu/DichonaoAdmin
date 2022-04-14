import "./customerList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Select, Table } from "antd";
import userApi from "../../apis/userApi";

const CustomerList = () => {
  const [page, setPage] = useState(1);
  const [customer, setCustomers] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [role, setRole] = useState("customer")
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState(null);
  const [flag, setFlag] = useState(true);
  
  const { Search } = Input;
  const { Option } = Select;

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="name">{text}</div>,
    },

    {
      title: "Giới Tính",
      dataIndex: "gender",
      key: "gender",
      render: (text) => <div className="number">{text}</div>,
    },
    {
      title: "Ngày Sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => <div className="date">{hanleFormatDate(text)}</div>,
    },

    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phone",
      render: (text) => <div className="number">{text}</div>,
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => <div className="number">{text}</div>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "active",
      key: "active",
      render: (text, record) => (
        <>
          {record.active === true ? (
            <div className="status" style={{ color: "green" }}>
              Đang hoạt động
            </div>
          ) : (
            <div className="status" style={{ color: "red" }}>
              Tạm khóa
            </div>
          )}
        </>
      ),
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <div className="status">
          <Link to={`/user/${role}/${text}`}>Xem Chi Tiết</Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const params = {
      page: page,
      size: pageSize,
      role: role,
      active: status,
      name: searchValue
    };
    console.log(params);
    const fetchRequests = async () => {
      setLoading(true);
      const response = await userApi.getAccount(params);
      if (response) {
        let listCustomer = [];
        let index = (page - 1) * pageSize + 1;
        setTotalRecords(response.metadata.total);
        response.data.map((user) => {
          listCustomer.push({index: index++, ...user})
        })
        setCustomers(listCustomer);
        setLoading(false);
      }
      console.log(response);
    };
    fetchRequests();
  }, [page, flag]);

  const hanleFormatDate = (props) => {
    const date = new Date(props);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return dd + "-" + mm + "-" + yyyy;
  };

  const onSearch = (e) => {
    setSearchValue(e);
    setFlag(!flag);
  };

  const onStatusChange = (e) => {
    if (e === "true") {
      setStatus(true);
    } else if (e === "false") {
      setStatus(false)
    } else {
      setStatus(null);
    }
    setFlag(!flag);
  }
  return (
    <div className="customerList">
      <div className="wrapper">
        <div className="productListTitleContainer">
          <h1 className="productListTitle">Danh Sách Khách Hàng</h1>
        </div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <Search
            placeholder="Tìm khách hàng"
            style={{ width: 200 }}
            onSearch={onSearch}
          />
          <Select style={{ width: 150}} placeholder="Trạng thái" onChange={onStatusChange}>
            <Option value=""></Option>
            <Option value="true">Đang hoạt động</Option>
            <Option value="false">Tạm khóa</Option>
          </Select>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={customer}
          pagination={{
            position: ["bottomCenter"],
            current: page,
            pageSize: pageSize,
            total: totalRecord,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          style={{ minHeight: 400, marginTop: 10 }}
        />
      </div>
      {/* {renderPagination()} */}
    </div>
  );
};

export default CustomerList;
