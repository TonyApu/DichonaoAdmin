import "./wareHouseList.css";
import { Pagination, Table, Modal, message, Button, Input } from "antd";
import {
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import wareHouseApi from "../../apis/wareHouseApi";
import { Link } from "react-router-dom";

export default function WareHouseList() {
  const [page, setPage] = useState(1);
  const [wareHouses, setWareHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecord, setTotalRecords] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Tên Kho",
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
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => <div className="address">{text}</div>,
    },
    {
      title: "Người Quản Lý",
      dataIndex: "warehouseManagerName",
      key: "warehouseManagerName",
      render: (text) => (
        <>{text === null ? <div>Chưa có</div> : <div>{text}</div>}</>
      ),
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <div className="icon">
          <Link to={`/wareHouse/detail/${text}`}>Xem Chi Tiết</Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await wareHouseApi.getAll();
      console.log(response);
      if (response) {
        let warehouseList = [];
        let index = 1;
        response.map((warehouse) => {
          warehouseList.push({ index: index++, ...warehouse });
        });
        setWareHouses(warehouseList);
        setTotalRecords(response.length);
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [page]);

  return (
    <div className="wareHouseList">
      <div className="wrapper">
        <div className="productListTitleContainer">
          <h1 className="productListTitle">Danh Sách Kho</h1>
          <Link to="/newWareHouse">
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
        <Table
          columns={columns}
          dataSource={wareHouses}
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
          loading={loading}
        />
      </div>
    </div>
  );
}
