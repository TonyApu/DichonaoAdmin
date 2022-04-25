import { EyeOutlined } from "@ant-design/icons";
import { Button, notification, Pagination, Result, Spin, Table } from "antd";
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
  const [loadingTable, setLoadingTable] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);

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
          <div className="icon">Xem Chi Tiết</div>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      setloadErr(false);
      await campaignsApi
        .get(param.campaignId)
        .then((response) => {
          setCampaign(response);
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
    fetchCampaign();
  }, [flag]);

  useEffect(() => {
    const params = {
      campaignId: param.campaignId,
      page: page,
      size: pageSize,
    };
    setLoadingTable(true);
    setloadErr(false);
    const fetchRequests = async () => {
      await campaignsApi.getFarmApply(params).then((response) => {
        let farmList = [];
        let index = (page - 1) * pageSize + 1;
        response.data.map((farm) => {
          farmList.push({ index: index++, ...farm });
        });
        setFarmRequests(farmList);
        setTotalRecords(response.metadata.total);
        setLoadingTable(false);
      }).catch((err) => {
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
    <div className="farmRequestList">
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
              loading={loadingTable}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmRequestList;
