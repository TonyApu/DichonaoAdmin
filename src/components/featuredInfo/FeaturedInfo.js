import {
  FileTextOutlined,
  ShoppingCartOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import React from "react";
import "./featuredInfo.css";

export default function FeaturedInfo(props) {
  return (
    <div className="featured">
      <div className="featuredItem" style={{ backgroundColor: "#affaf5" }}>
        <ShoppingCartOutlined style={{ fontSize: 30 }} />
        <span className="featuredTitle">Tổng Số Sản Phẩm Hệ Thống</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.products}</span>
          <span className="featuredUnit">Sản phẩm</span>
        </div>
      </div>

      <div className="featuredItem" style={{ backgroundColor: "#ecb5f7" }}>
        <FileTextOutlined style={{ fontSize: 30 }} />
        <span className="featuredTitle">Số Đơn Hàng</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.orders}</span>
          <span className="featuredUnit">Đơn</span>
        </div>
      </div>

      <div className="featuredItem" style={{ backgroundColor: "#f7b3b2" }}>
        <SoundOutlined style={{ fontSize: 30 }} />
        <span className="featuredTitle">Chiến Dịch Đang Diễn Ra</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.campaigns}</span>
          <span className="featuredUnit">Chiến dịch</span>
        </div>
      </div>
    </div>
  );
}
