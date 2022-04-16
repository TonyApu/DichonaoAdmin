import "./customerList.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, notification, Pagination, Result, Select, Table } from "antd";
import userApi from "../../apis/userApi";

const CustomerList = () => {
  const [page, setPage] = useState(1);
  const [customer, setCustomers] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [role, setRole] = useState("customer");
  const [searchValue, setSearchValue] = useState("");
  const [loadErr, setloadErr] = useState(false);
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
      render: (text) => (
        <>
          {text !== null ? (
            <div className="date">{hanleFormatDate(text)}</div>
          ) : (
            ""
          )}
        </>
      ),
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
      name: searchValue,
    };
    console.log(params);
    const fetchRequests = async () => {
      setLoading(true);
      setloadErr(false);
      await userApi
        .getAccount(params)
        .then((response) => {
          let listCustomer = [];
          let index = (page - 1) * pageSize + 1;
          setTotalRecords(response.metadata.total);
          response.data.map((user) => {
            listCustomer.push({ index: index++, ...user });
          });
          setCustomers(listCustomer);
          setLoading(false);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            notification.error({
              duration: 2,
              message: "Mất kết nối mạng!",
              style: { fontSize: 16 },
            });
          } else {
            notification.error({
              duration: 2,
              message: "Có lỗi xảy ra trong quá trình xử lý!",
              style: { fontSize: 16 },
            });
          }
          setloadErr(true);
        });
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
    setPage(1);
    setFlag(!flag);
  };

  const onStatusChange = (e) => {
    if (e === "true") {
      setStatus(true);
    } else if (e === "false") {
      setStatus(false);
    } else {
      setStatus(null);
    }
    setPage(1);
    setFlag(!flag);
  };
  return (
    <div className="customerList">
      {loadErr ? (
        <Result
          status="error"
          title="Đã có lỗi xảy ra!"
          subTitle="Rất tiếc đã có lỗi xảy ra trong quá trình tải dữ liệu, vui lòng kiểm tra lại kết nối mạng và thử lại."
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setFlag(!flag);
              }}
            >
              Tải lại
            </Button>,
          ]}
        ></Result>
      ) : (
        <>
          <div className="wrapper">
            <div className="productListTitleContainer">
              <h1 className="productListTitle">Danh Sách Khách Hàng</h1>
            </div>
            <div>
              <Search
                placeholder="Nhập tên"
                style={{ width: 200 }}
                onSearch={onSearch}
              />
              <Select
                style={{ width: 150, marginLeft: 10 }}
                placeholder="Trạng thái"
                onChange={onStatusChange}
              >
                <Option value="">Tất cả</Option>
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
        </>
      )}
    </div>
  );
};

export default CustomerList;
