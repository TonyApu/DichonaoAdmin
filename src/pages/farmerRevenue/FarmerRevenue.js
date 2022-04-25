import { Button, DatePicker, Table, notification, Result } from "antd";
import React, { useEffect, useState } from "react";
import farmOrderApi from "../../apis/farmOrderApi";
import "./farmerRevenue.css";

const FarmerRevenue = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [totalRecord, setTotalRecords] = useState(1);
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [farmerRevenue, setFarmerRevenue] = useState(null);
  const [loadErr, setloadErr] = useState(false);
  const [reload, setReload] = useState(true);
  const [validateMsg, setValidateMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setloadErr(false);
      const params = {
        from: startAt,
        to: endAt,
      };
      await farmOrderApi
        .getRevenue(params)
        .then((response) => {
          let index = 1;
          let farmers = [];
          response.map((farmer) => {
            farmers.push({ index: index++, ...farmer });
          });
          setFarmerRevenue(farmers);
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
  }, [reload]);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Tên Chủ Nông Trại",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="farmName">{text}</div>,
    },
    {
      title: "Số Đơn Hàng",
      dataIndex: "countFarmOrder",
      key: "countFarmOrder",
      render: (text) => <div className="farmName">{text}</div>,
    },

    {
      title: "Doanh Thu",
      dataIndex: "totalRevenues",
      key: "totalRevenues",
      render: (text) => (
        <div className="address">{text.toLocaleString() + " VNĐ"}</div>
      ),
    },
  ];

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
    return yyyy + "-" + mm + "-" + dd;
  };

  const handleStartAtChange = (value) => {
    console.log(`${value}`);
    let date = new Date(value);
    setStartAt(date);
  };

  const handleEndAtChange = (value) => {
    console.log(`${value}`);
    let date = new Date(value);
    setEndAt(date);
  };

  const validateAll = () => {
    const msg = {};
    if (startAt === null) {
      msg.startAt = "Vui lòng chọn ngày bắt đầu.";
    }
    if (endAt === null) {
      msg.endAt = "Vui lòng chọn ngày kết thúc.";
    }
    if (endAt < startAt) {
      msg.endAt = "Ngày kết thúc phải diễn ra sau ngày bắt đầu.";
    }

    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const handleCheck = async () => {
    const isValid = validateAll();

    if (isValid) {
      setLoading(true);
      const params = {
        "time-from": hanleFormatDate(startAt),
        "time-to": hanleFormatDate(endAt),
      };
      const response = await farmOrderApi.getRevenue(params);
      if (response) {
        let index = 1;
        let farmers = [];
        console.log(response);
        response.map((farmer) => {
          farmers.push({ index: index++, ...farmer });
        });
        console.log(farmers);
        setFarmerRevenue(farmers);
        setLoading(false);
      }
    }
  };
  return (
    <div className="farmRevenue">
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
        <div className="farmRevenueWrapper">
          <div className="farmRevenueCampaignName">
            <span>Thống Kê Doanh Thu</span>
          </div>

          <div className="">
            <div style={{ display: "inline-block" }}>
              <span>Từ: </span>
              <DatePicker
                format="DD-MM-YYYY"
                onChange={handleStartAtChange}
                style={{ width: 200, marginLeft: 10 }}
                placeholder="Chọn ngày bắt đầu"
              />
              <br />
              <span className="newCampaignLabel" style={{ color: "red" }}>
                {validateMsg.startAt}
              </span>
            </div>

            <div style={{ display: "inline-block" }}>
              <span style={{ marginLeft: 20, marginRight: 20 }}> {"  "} </span>
              <br />
              <span
                className="productDetailLabel"
                style={{ color: "red", width: 200, marginLeft: 10 }}
              >
                {null}
              </span>
            </div>

            <div style={{ display: "inline-block" }}>
              <span>Đến: </span>
              <span className="farmRevenueInfoTitle">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={handleEndAtChange}
                  style={{ width: 200, marginLeft: 10 }}
                  placeholder="Chọn ngày kết thúc"
                />
              </span>
              <br />
              <span className="newCampaignLabel" style={{ color: "red" }}>
                {validateMsg.endAt}
              </span>
            </div>
          </div>

          <div className="farmRevenueInfo">
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: 150,
                height: 40,
                borderRadius: 5,
              }}
              onClick={() => handleCheck()}
            >
              Kiểm Tra
            </Button>
          </div>
          <div className="farmRevenueTable">
            <Table
              columns={columns}
              dataSource={farmerRevenue}
              loading={loading}
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
        </div>
      )}
    </div>
  );
};

export default FarmerRevenue;
