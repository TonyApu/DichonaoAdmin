import { Button, notification, Pagination, Result, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import farmApi from "../../apis/farmApi";
import harvestCampaignsApi from "../../apis/harvestCampaigns";
import "./farmHarvest.css";

const FarmHarvest = () => {
  const [farmHarvests, setFarmsHarvest] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalRecord, setTotalRecords] = useState(1);
  const [farm, setFarm] = useState(null);
  const [loadingTable, setLoadingTable] = useState(true);
  const [pageSize, setPageSize] = useState(5);
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
      title: "Hình Ảnh",
      dataIndex: "image1",
      key: "image1",
      render: (text) => <img className="farmImage" src={text} />,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <div className="farmName">{text}</div>,
    },
    {
      title: "Mùa Vụ",
      dataIndex: "harvestName",
      key: "harvestName",
      render: (text) => <div className="farmName">{text}</div>,
    },

    {
      title: "Tổng Số Lượng",
      dataIndex: "inventory",
      key: "inventory",
      render: (text) => <div className="address">{text}</div>,
    },
    {
      title: "Còn Lại",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <div className="harvestApplyRequest">{text}</div>,
    },
    {
      title: "Đơn Vị",
      dataIndex: "unit",
      key: "unit",
      render: (text) => <div className="harvestApplyRequest">{text}</div>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <div className="harvestApplyRequest">{text}</div>,
    },
  ];

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true);
      setloadErr(false);
      await farmApi
        .get(param.farmId)
        .then((response) => {
          setFarm(response);
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
    fetchFarm();
  }, [reload]);

  useEffect(() => {
    const params = {
      page: page,
      size: pageSize,
      farmId: param.farmId,
      campaignId: param.campaignId,
    };
    const fetchFarmHarvests = async () => {
      setLoadingTable(true);
      setloadErr(false);
      await harvestCampaignsApi
        .getFarmHarvest(params)
        .then((response) => {
          setTotalRecords(response.metadata.total);
          let harvests = [];
          let index = (page - 1) * pageSize + 1;
          response.data.map((harvest) => {
            harvests.push({ index: index++, ...harvest });
          });
          setFarmsHarvest(harvests);
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
    fetchFarmHarvests();
  }, [page, reload]);

  return (
    <div className="farmHarvest">
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
        <div className="farmHarvestWrapper">
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
              <div className="farmHarvestfarmName">
                <span>{farm.name}</span>
              </div>
              <div className="farmHarvestInfo">
                <span>
                  <b>Địa Chỉ:</b>{" "}
                </span>
                <span className="farmHarvestInfoTitle">{farm.address}</span>
              </div>
              <div className="farmHarvestInfo">
                <span>
                  <b>Mô tả:</b>{" "}
                </span>
                <span className="farmHarvestInfoTitle">
                  {farm.description !== null ? farm.description : "Chưa có"}
                </span>
              </div>
            </div>
          )}
          <div className="farmHarvestTable">
            <Table
              columns={columns}
              dataSource={farmHarvests}
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

      {/* {renderPagination()} */}
    </div>
  );
};

export default FarmHarvest;
