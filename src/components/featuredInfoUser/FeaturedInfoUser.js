import React from "react";
import "./featuredInfoUser.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

export default function FeaturedInfoUser(props) {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Tổng Số Khách Hàng</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.customers}</span>
          {/* <span className="featuredMoneyRate">
            -4% <ArrowDownward className="featuredIcon negative"/>
          </span> */}
        </div>
        {/* <span className="featuredSub">So sánh với tháng trước</span> */}
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Tổng Số Chủ Nông Trại</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.farmers}</span>
          {/* <span className="featuredMoneyRate">
            +9% <ArrowUpward className="featuredIcon" />
          </span> */}
        </div>
        {/* <span className="featuredSub">So sánh với tháng trước</span> */}
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Tổng Số Người Quản Lý Kho</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.warehouseManagers}</span>
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
