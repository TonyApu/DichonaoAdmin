import { UserOutlined } from "@ant-design/icons";
import React from "react";
import "./featuredInfoUser.css";

export default function FeaturedInfoUser(props) {
  return (
    <div className="featured">
      <div className="featuredItem" style={{ backgroundColor: "#f5f3a4" }}>
        <UserOutlined style={{ fontSize: 30 }} />
        <span className="featuredTitle">Tổng Số Khách Hàng</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.customers}</span>
          <span className="featuredUnit">Người</span>
        </div>
      </div>
      <div className="featuredItem" style={{ backgroundColor: "#f5d3a6" }}>
        <UserOutlined style={{ fontSize: 30 }} />
        <span className="featuredTitle">Tổng Số Chủ Nông Trại</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.farmers}</span>
          <span className="featuredUnit">Người</span>
        </div>
      </div>
      <div className="featuredItem" style={{ backgroundColor: "#cef7a8" }}>
        <UserOutlined style={{ fontSize: 30 }} />
        <span className="featuredTitle">Tổng Số Người Quản Lý Kho</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.warehouseManagers}</span>
          <span className="featuredUnit">Người</span>
        </div>
      </div>
    </div>
  );
}
