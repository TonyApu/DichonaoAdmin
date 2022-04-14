import "./productList.css";
import { Button, Input, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import productSystemApi from "../../apis/productSystemApi";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [productsSystem, setProductsSystem] = useState([]);
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
      title: "Tên Sản Phẩm",
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
      title: "Xuất Sứ",
      dataIndex: "province",
      key: "province",
      render: (text) => <div className="province">{text}</div>,
    },
    {
      title: "Giá Thấp Nhất",
      dataIndex: "minPrice",
      key: "minPrice",
      sorter: (record1, record2) => {
        return record1.minPrice - record2.minPrice;
      },
      render: (text) => (
        <div className="price">{text.toLocaleString() + "  VNĐ"}</div>
      ),
    },
    {
      title: "Giá Cao Nhất",
      dataIndex: "maxPrice",
      key: "maxPrice",
      render: (text) => (
        <div className="price">{text.toLocaleString() + "  VNĐ"}</div>
      ),
      sorter: (record1, record2) => {
        return record1.maxPrice - record2.maxPrice;
      },
    },
    {
      title: "Đơn Vị",
      dataIndex: "unit",
      key: "unit",
      render: (text) => <div className="province">{text}</div>,
    },
    {
      title: "Hành Động",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <div className="icon">
          <Link to={`/product/edit/${text}`}>Xem Chi Tiết</Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchProductList = async () => {
      setLoading(true);
      const params = {
        page: page,
        size: pageSize,
      };
      console.log(params);
      const response = await productSystemApi.getAllWithPaging(params);
      console.log(response);
      if (response) {
        let productList = [];
        let index = (page - 1) * pageSize + 1;
        response.data.map((product) => {
          productList.push({ index: index++, ...product });
        });
        setProductsSystem(productList);
        setTotalRecords(response.metadata.total);
        setLoading(false);
      }
    };
    fetchProductList();
  }, [page]);

  return (
    <div className="productList">
      <div className="wrapper">
        <div className="productListTitleContainer">
          <h1 className="productListTitle">Danh Sách Sản Phẩm</h1>
          <Link to="newProduct">
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
          dataSource={productsSystem}
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

      {/* {renderPagination()} */}
    </div>
  );
}
