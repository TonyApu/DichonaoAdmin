import "./wareHouseList.css";
import {
  Pagination,
  Table,
  Modal,
  message,
  Button,
  Input,
  notification,
  Result,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import wareHouseApi from "../../apis/wareHouseApi";
import { Link } from "react-router-dom";

export default function WareHouseList() {
  const [page, setPage] = useState(1);
  const [wareHouses, setWareHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecord, setTotalRecords] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Tên Kho",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="name">{text}</div>,
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => <div className="address">{text}</div>,
    },
    {
      title: "Người Quản Lý",
      dataIndex: "warehouseManagerName",
      key: "warehouseManagerName",
      render: (text) => (
        <>{text === null ? <div>Chưa có</div> : <div>{text}</div>}</>
      ),
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <div className="icon">
          <Link to={`/wareHouse/detail/${text}`}>Xem Chi Tiết</Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      setloadErr(false);
      setLoading(true);
      await wareHouseApi
        .getAll()
        .then((response) => {
          let warehouseList = [];
          let index = 1;
          response.map((warehouse) => {
            warehouseList.push({ index: index++, ...warehouse });
          });
          setWareHouses(warehouseList);
          setTotalRecords(response.length);
          setLoading(false);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            notification.error({
              duration: 2,
              message: "Mất kết nối mạng!",
              style: { fontSize: 16 },
            });
          } else if (err.message === "timeout") {
            notification.error({
              duration: 2,
              message: "Server mất thời gian quá lâu để phản hồi!",
              style: { fontSize: 16 },
            });
          } else if (err.response.status === 400) {
            notification.error({
              duration: 2,
              message: "Đã có lỗi xảy ra!",
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
    fetchCampaigns();
  }, [page, flag]);

  return (
    <div className="wareHouseList">
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
        <div className="wrapper">
          <div className="productListTitleContainer">
            <h1 className="productListTitle">Danh Sách Kho</h1>
            <Link to="/newWareHouse">
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: 150,
                  height: 40,
                  borderRadius: 5,
                }}
              >
                Tạo Mới
              </Button>
            </Link>
          </div>
          <Table
            columns={columns}
            dataSource={wareHouses}
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
            style={{ minHeight: 400 }}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
