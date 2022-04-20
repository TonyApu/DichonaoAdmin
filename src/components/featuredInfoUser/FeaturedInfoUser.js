import { UserOutlined } from "@ant-design/icons";
import React from "react";
import "./featuredInfoUser.css";

export default function FeaturedInfoUser(props) {
  return (
    <div className="featured">
      <div className="featuredItem" style={{backgroundColor: "#f5f3a4"}}>
        <span className="featuredTitle">Tổng Số Khách Hàng</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.customers}</span>
          <UserOutlined style={{fontSize: 20, marginLeft: 10}}/>
        </div>
      </div>
      <div className="featuredItem" style={{backgroundColor: "#f5d3a6"}}>
        <span className="featuredTitle">Tổng Số Chủ Nông Trại</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.farmers}</span>
          <UserOutlined style={{fontSize: 20, marginLeft: 10}}/>
        </div>
      </div>
      <div className="featuredItem" style={{backgroundColor: "#cef7a8"}}>
        <span className="featuredTitle">Tổng Số Người Quản Lý Kho</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.warehouseManagers}</span>
          <UserOutlined style={{fontSize: 20, marginLeft: 10}}/>
        </div>
      </div>
    </div>
  );
}
