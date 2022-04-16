import "./productList.css";
import { Button, Input, notification, Pagination, Result, Table } from "antd";
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
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);

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
      setloadErr(false);
      const params = {
        page: page,
        size: pageSize,
      };
      await productSystemApi
        .getAllWithPaging(params)
        .then((response) => {
          let productList = [];
          let index = (page - 1) * pageSize + 1;
          response.data.map((product) => {
            productList.push({ index: index++, ...product });
          });
          setProductsSystem(productList);
          setTotalRecords(response.metadata.total);
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
    fetchProductList();
  }, [page, flag]);

  return (
    <div className="productList">
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
            <h1 className="productListTitle">Danh Sách Sản Phẩm</h1>
            <Link to="/newProduct">
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
      )}
    </div>
  );
}
