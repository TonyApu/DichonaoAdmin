import { Pagination, Spin, Table } from "antd";
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
  const [pageSize, setPageSize] = useState(5)
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
    const fetchCampaign = async () => {
      const response = await farmApi.get(param.farmId);
      console.log(response);
      setFarm(response);
      setLoading(false);
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    const params = {
      page: page,
      size: pageSize,
      farmId: param.farmId,
      campaignId: param.campaignId,
    };
    const fetchFarmHarvests = async () => {
      const response = await harvestCampaignsApi.getFarmHarvest(params);
      if (response) {
        console.log(response.data);
        setTotalRecords(response.metadata.total);
        let harvests = [];
        let index = (page - 1) * pageSize + 1;
        response.data.map((harvest) => {
          harvests.push({index: index++, ...harvest});
        });
        setFarmsHarvest(harvests)
        setLoadingTable(false);
      }
     
    };
    fetchFarmHarvests();
  }, [page]);

  // const renderPagination = () => {
  //   return (
  //     <div className="paging">
  //       <Pagination
  //         showSizeChanger={false}
  //         pageSize={6}
  //         defaultCurrent={1}
  //         total={totalRecord}
  //         onChange={(pageNumber) => setPage(pageNumber)}
  //       />
  //     </div>
  //   );
  // };

  return (
    <div className="farmHarvest">
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
      {/* {renderPagination()} */}
    </div>
  );
};

export default FarmHarvest;
