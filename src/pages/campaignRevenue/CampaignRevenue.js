import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./campaignRevenue.css";   

const CampaignRevenue = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(6);

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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div style={{ width: 150 }}>
            <Input
              //  style={{width: 100}}
              autoFocus
              placeholder="Nhập tên "
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
            >
              Tìm
            </Button>
            <Button
              type="danger"
              onClick={() => {
                clearFilters();
              }}
            >
              Reset
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        let total = 0;
        if (record.name.toLowerCase().includes(value.toLowerCase())) {
          total++;
        }
        setTotalRecords(total);
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
      render: (text) => <div className="name">{text}</div>,
    },
    {
      title: "Số Nông Trại Tham Gia",
      dataIndex: "farms",
      key: "farms",
      render: (text) => <div className="number">{text}</div>,
    },

    {
      title: "Số Đơn Hàng",
      dataIndex: "orders",
      key: "orders",
      render: (text) => <div className="number">{text}</div>,
    },

    {
      title: "Tổng Doanh Thu",
      dataIndex: "totalRevenues",
      key: "totalRevenues",
      render: (text) => (
        <div className="number" style={{ color: "orange" }}>
          {text.toLocaleString()}
        </div>
      ),
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <div className="status">
          <Link to={`/revenue/${text}`}>Xem Chi Tiết</Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await userApi.getStatistical();
      if (response) {
        let listCampaign = [];
        let index = (page - 1) * pageSize + 1;
        response.map((campaign) => {
          listCampaign.push({ index: index++, ...campaign });
        });
        setTotalRecords(response.length);
        setData(listCampaign);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="campaignRevenue">
      <div className="wrapper">
        <div className="productListTitleContainer">
          <h1 className="productListTitle">Doanh Thu Các Chiến Dịch</h1>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
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
  );
};

export default CampaignRevenue;
