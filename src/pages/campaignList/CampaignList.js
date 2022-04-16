import "./campaignList.css";
import { Button, Input, Modal, notification, Result, Select, Spin, Table } from "antd";
import { useState, useEffect } from "react";
import campaignsApi from "../../apis/campaignsApi";
import { Link } from "react-router-dom";

export default function CampaignList() {
  const [page, setPage] = useState(1);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecord, setTotalRecords] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [loadErr, setloadErr] = useState(false); 
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
      setloadErr(false);
      setLoading(true);
      await campaignsApi
        .getAll(params)
        .then((response) => {
          setTotalRecords(response.metadata.total);
          let campainList = [];
          let index = (page - 1) * pageSize + 1;
          response.data.map((campaign) => {
            campainList.push({ index: index++, ...campaign });
          });
          setCampaigns(campainList);
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
    setPage(1);
    setFlag(!flag);
  };

  const onStatusChange = (e) => {
    setStatus(e);
    setPage(1);
    setFlag(!flag);
  };

  return (
    <div className="campaignList">
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
              style={{ width: 120, marginLeft: 10 }}
              placeholder="Trạng thái"
              onChange={onStatusChange}
            >
              <Option value="">Tất cả</Option>
              <Option value="Sắp mở bán">Sắp Mở Bán</Option>
              <Option value="Đang diễn ra">Đang Diễn Ra</Option>
              <Option value="Đã kết thúc">Đã Kết Thúc</Option>
              <Option value="Đã hủy">Đã Hủy</Option>
            </Select>
          </div>
          <Table
            style={{ marginTop: 10, minHeight: 400 }}
            columns={columns}
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
      )}
    </div>
  );
}
