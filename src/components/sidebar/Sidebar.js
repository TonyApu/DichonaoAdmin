import React, { useEffect, useState } from "react";
import "./sidebar.css";
import {
  LineStyle,
  PermIdentity,
  AddShoppingCart,
  MailOutline,
  ArrowLeft,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import {
  DollarCircleOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  OrderedListOutlined,
  TagOutlined,
} from "@ant-design/icons";

export default function Sidebar() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    if (document.getElementById(path.toString()) !== null) {
      document.getElementById(path.toString()).classList.add("active");
    }
  }, [path]);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <div className="sidebarTop">
            <div className="sidebarTopTitle">
              <h3 className="sidebarTitle">Dashboard</h3>
            </div>
            {/* <div className="sidebarToggleIcon">
              <DoubleLeftOutlined />
            </div> */}
          </div>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li
                className="sidebarListItem"
                id="/"
                onClick={() => (window.location.pathname = "/")}
              >
                <LineStyle className="sidebarIcons" />
                Trang Chủ
              </li>
            </Link>
          </ul>
          <h3 className="sidebarTitle">Tài Khoản</h3>
          <ul className="sidebarList">
            <Link to="/customer" className="link">
              <li
                className="sidebarListItem"
                id="/customer"
                onClick={() => (window.location.pathname = "/customer")}
              >
                <PermIdentity className="sidebarIcons" />
                Khách Hàng
              </li>
            </Link>

            <Link to="/farmer" className="link">
              <li
                className="sidebarListItem"
                id="/farmer"
                onClick={() => (window.location.pathname = "/farmer")}
              >
                <PermIdentity className="sidebarIcons" />
                Chủ Nông Trại
              </li>
            </Link>

            <Link to="/warehouseManager" className="link">
              <li
                className="sidebarListItem"
                id="/warehouseManager"
                onClick={() => (window.location.pathname = "/warehouseManager")}
              >
                <PermIdentity className="sidebarIcons" />
                Quản Lý Kho
              </li>
            </Link>

            <Link to="/driver" className="link">
              <li
                className="sidebarListItem"
                id="/driver"
                onClick={() => (window.location.pathname = "/driver")}
              >
                <PermIdentity className="sidebarIcons" />
                Người Giao Hàng
              </li>
            </Link>
          </ul>
          <h3 className="sidebarTitle">Chiến Dịch</h3>

          <ul className="sidebarList">
            <Link to="/campaigns" className="link">
              <li
                className="sidebarListItem"
                id="/campaigns"
                onClick={() => (window.location.pathname = "/campaigns")}
              >
                <OrderedListOutlined className="sidebarIcons" />
                Danh Sách
              </li>
            </Link>
            <Link to="/requests" className="link">
              <li
                className="sidebarListItem"
                id="/requests"
                onClick={() => (window.location.pathname = "/requests")}
              >
                <MailOutline className="sidebarIcons" />
                Yêu Cầu Tham Gia
              </li>
            </Link>
            <Link to="/revenue" className="link">
              <li
                className="sidebarListItem"
                id="/revenue"
                onClick={() => (window.location.pathname = "/revenue")}
              >
                <DollarCircleOutlined className="sidebarIcons" />
                Doanh Thu
              </li>
            </Link>
          </ul>
          <h3 className="sidebarTitle">Hệ Thống</h3>
          <ul className="sidebarList">
            <Link to="/products" className="link">
              <li
                className="sidebarListItem"
                id="/products"
                onClick={() => (window.location.pathname = "/products")}
              >
                <AddShoppingCart className="sidebarIcons" />
                Sản Phẩm
              </li>
            </Link>
            <Link to="/warehouses" className="link">
              <li
                className="sidebarListItem"
                id="/warehouses"
                onClick={() => (window.location.pathname = "/warehouses")}
              >
                <HomeOutlined className="sidebarIcons" />
                Kho Chứa Hàng
              </li>
            </Link>
            <Link to="/statistical" className="link">
              <li
                className="sidebarListItem"
                id="/statistical"
                onClick={() => (window.location.pathname = "/statistical")}
              >
                <FolderOpenOutlined className="sidebarIcons" />
                Thống Kê
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
