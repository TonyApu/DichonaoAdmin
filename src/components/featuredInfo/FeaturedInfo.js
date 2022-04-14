import React from "react";
import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

export default function FeaturedInfo(props) {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Tổng Số Sản Phẩm Hệ Thống</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.products}</span>
          {/* <span className="featuredMoneyRate">
            -4% <ArrowDownward className="featuredIcon negative"/>
          </span> */}
        </div>
        {/* <span className="featuredSub">So sánh với tháng trước</span> */}
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Số Đơn Hàng</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.orders}</span>
          {/* <span className="featuredMoneyRate">
            +9% <ArrowUpward className="featuredIcon" />
          </span> */}
        </div>
        {/* <span className="featuredSub">So sánh với tháng trước</span> */}
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Chiến Dịch Đang Diễn Ra</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.campaigns}</span>
          {/* <span className="featuredMoneyRate">
            +6% <ArrowUpward className="featuredIcon" />
          </span> */}
          {/* <span className="featuredUnit">Tài Khoản</span> */}
        </div>
        {/* <span className="featuredSub">So sánh với tháng trước</span> */}
      </div>
      
    </div>
  );
}
