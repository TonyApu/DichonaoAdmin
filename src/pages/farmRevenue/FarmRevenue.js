import { useEffect, useState } from "react";
import farmApi from "../../apis/farmApi";
import { Link, useParams } from "react-router-dom";
import "./farmRevenue.css";
import campaignsApi from "../../apis/campaignsApi";
import { Spin, Table } from "antd";

const FarmRevenue = () => {
  const param = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState("");
  const [farmsInCampaign, setFarmsInCampaign] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await campaignsApi.get(param.campaignId);
      if (response) {
        setCampaign(response);
        setLoading(false);
      }
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    const fetchFarmsInCampaign = async () => {
      const params = {
        id: param.campaignId,
      };
      const response = await farmApi.getFarmRevenue(params);
      if (response) {
        console.log(response);
        let farms = [];
        let index = 1;
        response.map((farm) => {
          farms.push({ index: index++, ...farm });
        });
        setFarmsInCampaign(farms);
        setTotalRecords(response.length);
        setLoadingTable(false);
      }
    };
    fetchFarmsInCampaign();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => <img className="farmImage" src={text} />,
    },
    {
      title: "Tên Nông Trại",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="farmName">{text}</div>,
    },
    {
      title: "Đơn hàng hoàn thành",
      dataIndex: "countFarmOrder",
      key: "countFarmOrder",
      render: (text) => <div className="harvestApplyRequest">{text}</div>,
    },
    {
      title: "Doanh Thu",
      dataIndex: "total",
      key: "total",
      render: (text) => <div className="address">{text.toLocaleString() + " VNĐ"}</div>,
    },

    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Link to={`/revenue/${param.campaignId}/${text}`}>
          <div className="icon">Xem chi tiết</div>
        </Link>
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
    return dd + "-" + mm + "-" + yyyy;
  };

  return (
    <div className="farmRevenue">
      <div className="farmRevenueWrapper">
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
            <div className="farmRevenueCampaignName">
              <span>{campaign.name}</span>
            </div>

            <div className="campaignInfo">
              <span>
                <b>Bắt đầu ngày: </b>{" "}
              </span>
              <span className="campaignInfoTitle">
                {hanleFormatDate(campaign.startAt)}
              </span>
            </div>
            <div></div>
            <div className="campaignInfo">
              <span>
                <b>Kết thúc ngày:</b>{" "}
              </span>
              <span className="campaignInfoTitle">
                {hanleFormatDate(campaign.endAt)}
              </span>
            </div>
            <div className="campaignInfo">
              <span>
                <b>Mô tả:</b>{" "}
              </span>
              <span className="campaignInfoTitle">{campaign.description}</span>
            </div>
          </div>
        )}
        <div className="farmRevenueTable">
          <Table
            loading={loadingTable}
            columns={columns}
            dataSource={farmsInCampaign}
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
    </div>
  );
};

export default FarmRevenue;
