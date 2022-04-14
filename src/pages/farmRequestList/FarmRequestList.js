import { EyeOutlined } from "@ant-design/icons";
import { Pagination, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import campaignsApi from "../../apis/campaignsApi";
import "./farmRequestList.css";

const FarmRequestList = () => {
  const [page, setPage] = useState(1);
  const [farmRequests, setFarmRequests] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
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
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => <div className="address">{text}</div>,
    },
    {
      title: "Số Sản Phẩm",
      dataIndex: "harvestApplyRequest",
      key: "harvestApplyRequest",
      render: (text) => <div className="harvestApplyRequest">{text}</div>,
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Link to={`/request/${param.campaignId}/${text}`}>
          <div className="icon">
            Xem Chi Tiết
          </div>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignResponse = await campaignsApi.get(param.campaignId);
      setCampaign(campaignResponse);
      console.log(campaignResponse);
      setLoading(false);
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    const params = {
      campaignId: param.campaignId,
      page: page,
      size: pageSize,
    };
    const fetchRequests = async () => {
      const response = await campaignsApi.getFarmApply(params);
      if (response) {
        let farmList = [];
        let index = (page - 1) * pageSize + 1;
        response.data.map((farm) => {
          farmList.push({ index: index++, ...farm });
        });

        setFarmRequests(farmList);
        setTotalRecords(response.metadata.total);
      }
    };
    fetchRequests();
  }, [page]);

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

  const renderPagination = () => {
    return (
      <div className="paging">
        <Pagination
          showSizeChanger={false}
          pageSize={6}
          defaultCurrent={1}
          total={totalRecord}
          onChange={(pageNumber) => setPage(pageNumber)}
        />
      </div>
    );
  };

  return (
    <div className="farmRequestList">
      <div className="farmRequestListWrapper">
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
            <div className="farmRequestListCampaignName">
              <span>{campaign.name}</span>
            </div>

            <div className="farmRequestListInfo">
              <span>
                <b>Bắt đầu ngày: </b>{" "}
              </span>
              <span className="farmRequestListInfoTitle">
                {hanleFormatDate(campaign.startAt)}
              </span>
            </div>
            <div></div>
            <div className="farmRequestListInfo">
              <span>
                <b>Kết thúc ngày:</b>{" "}
              </span>
              <span className="farmRequestListInfoTitle">
                {hanleFormatDate(campaign.endAt)}
              </span>
            </div>
            <div className="farmRequestListInfo">
              <span>
                <b>Mô tả:</b>{" "}
              </span>
              <span className="farmRequestListInfoTitle">
                {campaign.description}
              </span>
            </div>
          </div>
        )}
        <div className="farmRequestListTable">
          <Table
            columns={columns}
            dataSource={farmRequests}
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
    </div>
  );
};

export default FarmRequestList;
