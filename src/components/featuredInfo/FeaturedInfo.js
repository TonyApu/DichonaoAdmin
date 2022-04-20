import { FileTextOutlined, ShopOutlined, ShoppingCartOutlined, SoundOutlined } from "@ant-design/icons";
import React from "react";
import "./featuredInfo.css";


export default function FeaturedInfo(props) {
  return (
    <div className="featured">
      <div className="featuredItem" style={{backgroundColor: "#affaf5"}}>
        <span className="featuredTitle">Tổng Số Sản Phẩm Hệ Thống</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.products}</span>
          <ShoppingCartOutlined style={{fontSize: 20, marginLeft: 10}}/>         
        </div>
      </div>

      <div className="featuredItem" style={{backgroundColor: "#ecb5f7"}}>
        <span className="featuredTitle">Số Đơn Hàng</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.orders}</span>
          <FileTextOutlined style={{fontSize: 20, marginLeft: 10}}/> 
        </div>
      </div>

      <div className="featuredItem" style={{backgroundColor: "#f7b3b2"}}>
        <span className="featuredTitle">Chiến Dịch Đang Diễn Ra</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.campaigns}</span>
          <SoundOutlined style={{fontSize: 20, marginLeft: 10}}/> 
        </div>
      </div>
      
    </div>
  );
}
