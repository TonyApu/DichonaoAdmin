import { Button, Input, notification, Result, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./campaignRevenue.css";

const CampaignRevenue = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [loadErr, setloadErr] = useState(false);
  const [reload, setReload] = useState(true);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Tên Chiến Dịch",
      dataIndex: "name",
      key: "name",

      render: (text) => <div className="name">{text}</div>,
    },
    {
      title: "Số Nông Trại Tham Gia",
      dataIndex: "farms",
      key: "farms",
      render: (text) => <div className="number">{text}</div>,
    },

    {
      title: "Số Đơn Hàng",
      dataIndex: "orders",
      key: "orders",
      render: (text) => <div className="number">{text}</div>,
    },

    {
      title: "Tổng Doanh Thu",
      dataIndex: "totalRevenues",
      key: "totalRevenues",
      render: (text) => (
        <div className="number" style={{ color: "orange" }}>
          {text.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <div className="status">
          <Link to={`/revenue/${text}`}>Xem Chi Tiết</Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await userApi
        .getStatistical()
        .then((response) => {
          let listCampaign = [];
          let index = (page - 1) * pageSize + 1;
          console.log(response)
          response.map((campaign) => {
            listCampaign.push({ index: index++, ...campaign });
          });
          setTotalRecords(response.length);
          setData(listCampaign);
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
    fetchData();
  }, []);

  return (
    <div className="campaignRevenue">
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
                setReload(!reload);
              }}
            >
              Tải lại
            </Button>,
          ]}
        ></Result>
      ) : (
        <div className="wrapper">
          <div className="productListTitleContainer">
            <h1 className="productListTitle">Doanh Thu Các Chiến Dịch</h1>
          </div>
          <Table
            loading={loading}
            columns={columns}
            dataSource={data}
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
          />
        </div>
      )}
    </div>
  );
};

export default CampaignRevenue;
