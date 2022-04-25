import "./requestList.css";
import { Button, Input, notification, Pagination, Result, Spin, Table } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import campaignsApi from "../../apis/campaignsApi";
import { Link, useParams } from "react-router-dom";

export default function RequestList() {
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(6);
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
      title: "Hình Ảnh",
      dataIndex: "image1",
      key: "image",
      render: (text) => <img className="campaignImg" src={text} />,
    },
    {
      title: "Tên Chiến Dịch",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="campaignName">{text}</div>,
    },

    {
      title: "Số Yêu Cầu",
      dataIndex: "farmApplyRequest",
      key: "farmApplyRequest",
      render: (text) => <div className="number">{text}</div>,
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Link to={`/request/${text}`}>
          <div className="icon">
            Xem Chi Tiết
          </div>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      setloadErr(false);
      setLoading(true);
      await campaignsApi
        .getAppy()
        .then((response) => {
          setTotalRecords(response.length);
          let applyList = [];
          let index = (page - 1) * pageSize + 1;
          response.map((apply) => {
            applyList.push({ index: index++, ...apply });
          });
          setRequests(applyList);
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
    fetchRequests();
  }, [page, flag]);

  return (
    <div className="requestList">
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
            <h1 className="productListTitle">Yêu Cầu Tham Gia</h1>
          </div>

          <Table
            columns={columns}
            dataSource={requests}
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
            style={{ height: 400 }}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
