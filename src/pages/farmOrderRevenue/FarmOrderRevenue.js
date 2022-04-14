import { async } from "@firebase/util";
import { Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import farmApi from "../../apis/farmApi";
import farmOrderApi from "../../apis/farmOrderApi";
import "./farmOrderRevenue.css"

const FarmOrderRevenue = () => {
  const [page, setPage] = useState(1);
  const [farmOrders, setFarmOrders] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [pageSize, setPageSize] = useState(6);
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
          return <div style={{color: "green"}}>{text}</div>
        } else {
          return <div style={{color: "red"}}>{text}</div>
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
      const params = {
        campaignId: param.campaignId,
        farmId: param.farmId,
      };
      const response = await farmOrderApi.getAll(params);
      if (response) {
          let orders = [];
          let index = [];
          response.map((order) => {
              orders.push({index: index++, ...order})
          })
          setFarmOrders(orders);
          
          setTotalRecords(response.length);
          setLoadingTable(false);
      }
    };
    fetchFarmOrder();
  }, []);

  return <div className="farmOrderRevenue">
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
</div>;
};

export default FarmOrderRevenue;
