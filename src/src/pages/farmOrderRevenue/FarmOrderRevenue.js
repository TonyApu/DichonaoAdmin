import { async } from "@firebase/util";
import { Button, notification, Result, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import farmApi from "../../apis/farmApi";
import farmOrderApi from "../../apis/farmOrderApi";
import "./farmOrderRevenue.css";

const FarmOrderRevenue = () => {
  const [page, setPage] = useState(1);
  const [farmOrders, setFarmOrders] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [loadErr, setloadErr] = useState(false);
  const [reload, setReload] = useState(true);
  const param = useParams();

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Mã Đơn Hàng",
      dataIndex: "code",
      key: "code",
      render: (text) => <div className="farmName">{text}</div>,
    },
    {
      title: "Giá Trị",
      dataIndex: "total",
      key: "total",
      render: (text) => (
        <div className="harvestApplyRequest">
          {text.toLocaleString() + "VNĐ"}
        </div>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        if (text === "Đã hoàn thành") {
          return <div style={{ color: "green" }}>{text}</div>;
        } else {
          return <div style={{ color: "red" }}>{text}</div>;
        }
      },
    },
  ];

  useEffect(() => {
    const fetchFarm = async () => {
      const response = await farmApi.get(param.farmId);
      if (response) {
        setFarm(response);
        setLoading(false);
      }
    };
    fetchFarm();
  }, []);

  useEffect(() => {
    const fetchFarmOrder = async () => {
      setLoading(true);
      setloadErr(false);
      const params = {
        campaignId: param.campaignId,
        farmId: param.farmId,
      };
      await farmOrderApi
        .getAll(params)
        .then((response) => {
          let orders = [];
          let index = 1;
          response.map((order) => {
            orders.push({ index: index++, ...order });
          });
          setFarmOrders(orders);

          setTotalRecords(response.length);
          setLoadingTable(false);
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
    fetchFarmOrder();
  }, [reload]);

  return (
    <div className="farmOrderRevenue">
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
        <div className="farmOrderRevenueWrapper">
          {loading ? (
            <>
              <Spin
                style={{ display: "flex", justifyContent: "center" }}
                size="large"
              />{" "}
              <br /> <br />{" "}
            </>
          ) : (
            <div>
              <div className="farmOrderRevenueCampaignName">
                <span>{farm.name}</span>
              </div>
            </div>
          )}
          <div className="farmOrderRevenueTable">
            <Table
              loading={loadingTable}
              columns={columns}
              dataSource={farmOrders}
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
              style={{ minHeight: 300 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmOrderRevenue;
