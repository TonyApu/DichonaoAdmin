import "./campaign.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import campaignsApi from "../../apis/campaignsApi";
import { Button, notification, Pagination, Result, Spin, Table } from "antd";
import farmApi from "../../apis/farmApi";

export default function Campaign() {
  const param = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [farmsInCampaign, setFarmsInCampaign] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      setloadErr(false);
      await campaignsApi.get(param.campaignId).then((response) => {
        setCampaign(response);
        setLoading(false);
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
      });
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    const fetchFarmsInCampaign = async () => {
      setloadErr(false);
      setLoadingTable(true);
      const params = {
        id: param.campaignId,
      };
      await farmApi
        .getFarmsInCampaign(params)
        .then((response) => {
          let farms = [];
          let index = 1;
          response.map((farm) => {
            farms.push({ index: index++, ...farm });
          });
          setFarmsInCampaign(farms);
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
    fetchFarmsInCampaign();
  }, [flag]);

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
      dataIndex: "countHarvestInCampaign",
      key: "countHarvestInCampaign",
      render: (text) => <div className="harvestApplyRequest">{text}</div>,
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Link to={`/campaign/${param.campaignId}/${text}`}>
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
    <div className="campaign">
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
        <div className="campaignWrapper">
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
              <div className="campaignCampaignName">
                <span>{campaign && campaign.name}</span>
              </div>

              <div className="campaignInfo">
                <span>
                  <b>Bắt đầu ngày: </b>{" "}
                </span>
                <span className="campaignInfoTitle">
                  {campaign && hanleFormatDate(campaign.startAt)}
                </span>
              </div>
              <div></div>
              <div className="campaignInfo">
                <span>
                  <b>Kết thúc ngày:</b>{" "}
                </span>
                <span className="campaignInfoTitle">
                  {campaign && hanleFormatDate(campaign.endAt)}
                </span>
              </div>
              <div className="campaignInfo">
                <span>
                  <b>Mô tả:</b>{" "}
                </span>
                <span className="campaignInfoTitle">
                  {campaign && campaign.description}
                </span>
              </div>
            </div>
          )}
          <div className="campaignTable">
            <Table
              columns={columns}
              dataSource={farmsInCampaign}
              loading={loadingTable}
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
}
