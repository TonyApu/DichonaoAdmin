import React from "react";
import "./topbar.css";
import { CheckOutlined, LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../stateManager/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { confirm } = Modal;
  const handleLogout = () => {
    const action = logout();
    dispatch(action);
    navigate("/");
  };

  const showLogoutConfirm = () => {
    confirm({
      title: "Bạn có muốn đăng xuất không?",
      icon: <CheckOutlined />,
      okText: "Đồng Ý",
      okType: "dashed",
      cancelText: "Hủy",
      onOk() {
        const action = logout();
        dispatch(action);
        navigate("/");
      },
      onCancel() {},
    });
  };
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Dichonao</span>
        </div>
        <div className="topRight">
          {/* <div className="topbarIconContainer">
                        <NotificationsNone/>
                        <span className="topIconBag">2</span>
                    </div> */}
          {/* <div className="topbarIconContainer">
                        <Language/>
                        <span className="topIconBag">2</span>
                    </div> */}
          {/* <div className="topbarIconContainer">
                        <Settings/> 
                    </div> */}
          <div
            className="topbarIconContainer"
            style={{ color: "blue" }}
            onClick={showLogoutConfirm}
          >
            Đăng Xuất
          </div>
          {/* <img src={Bau_Avatar} alt="" className="topAvatar" /> */}
        </div>
      </div>
    </div>
  );
}
