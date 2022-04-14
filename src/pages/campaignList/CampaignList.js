import "./campaignList.css";
import { Button, Input, Modal, Pagination, Select, Spin, Table } from "antd";
import { EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import campaignsApi from "../../apis/campaignsApi";
import { Link } from "react-router-dom";

export default function CampaignList() {
  const [page, setPage] = useState(1);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecord, setTotalRecords] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [flag, setFlag] = useState(true);
  const { info } = Modal;
  const { Search } = Input;
  const { Option } = Select;

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
      render: (text) => <div className="campaign_name">{text}</div>,
    },

    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        if (text === "Sắp mở bán") {
          return <div style={{ color: "orange" }}>{text}</div>;
        } else if (text === "Đang diễn ra") {
          return <div style={{ color: "green" }}>{text}</div>;
        } else {
          return <div style={{ color: "grey" }}>{text}</div>;
        }
      },
    },
    {
      title: "Số Nông Trại Tham Gia",
      dataIndex: "farmInCampaign",
      key: "farmInCampaign",

      render: (text) => <div className="farmInCampaign">{text}</div>,
    },
    {
      title: "Khu Vực",
      dataIndex: "campaignZoneName",
      key: "campaignZoneName",
      render: (text) => <div className="province">{text}</div>,
    },
    {
      title: "Chi Tiết Các Nông Trại",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <>
          {record.farmInCampaign === 0 ? (
            <div>Chưa Có</div>
          ) : (
            <Link to={`/campaign/${text}`}>
              <div className="icon">Xem Nông Trại</div>
            </Link>
          )}
        </>
      ),
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <>
          {record.status === "Đã hủy" ? (
            <Button
              style={{ border: "none", color: "#24aef2" }}
              onClick={() => showNoteInfo(record.note)}
            >
              Xem Lý Do
            </Button>
          ) : (
            <Link to={`/campaign/edit/${text}`}>
              <div style={{ marginLeft: 10 }} className="icon">
                Xem Chi Tiết
              </div>
            </Link>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      const params = {
        page: page,
        size: pageSize,
        name: searchValue,
        status: status,
      };
      console.log(params);
      setLoading(true);
      const campaignsResponse = await campaignsApi.getAll(params);
      console.log(campaignsResponse);
      if (campaignsResponse) {
        setTotalRecords(campaignsResponse.metadata.total);
        let campainList = [];
        let index = (page - 1) * pageSize + 1;
        campaignsResponse.data.map((campaign) => {
          campainList.push({ index: index++, ...campaign });
        });
        setCampaigns(campainList);
      }
      setLoading(false);
    };
    fetchCampaigns();
  }, [page, flag]);

  const showNoteInfo = (note) => {
    info({
      title: "Lý Do Hủy",
      content: (
        <div>
          <p style={{ marginTop: 10, fontSize: 14 }}>{note}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const onSearch = (e) => {
    setSearchValue(e);
    setFlag(!flag);
  };

  const onStatusChange = (e) => {
    setStatus(e);
    setFlag(!flag);
  };

  return (
    <div className="campaignList">
      <div className="wrapper">
        <div className="productListTitleContainer">
          <h1 className="productListTitle">Danh Sách Chiến Dịch</h1>

          <Link to="/newCampaign">
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: 150,
                height: 40,
                borderRadius: 5,
              }}
            >
              Tạo Mới
            </Button>
          </Link>
        </div>
        <div>
          <Search
            placeholder="Tìm chiến dịch"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
          <Select
            style={{ width: 120, marginLeft: 150 }}
            placeholder="Trạng thái"
            onChange={onStatusChange}
          >
            <Option value=""></Option>
            <Option value="Sắp mở bán">Sắp Mở Bán</Option>
            <Option value="Đang diễn ra">Đang Diễn Ra</Option>
            {/* <Option value="Đã kết thúc">Đã Kết Thúc</Option> */}
            <Option value="Đã hủy">Đã Hủy</Option>
          </Select>
        </div>
        <Table
          style={{ marginTop: 10, minHeight: 400 }}
          columns={columns}
          locale={{emptyText: "Không có dữ liệu!"}}   
          dataSource={campaigns}
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
          loading={loading}
        />
      </div>
    </div>
  );
}
