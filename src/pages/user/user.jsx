import "./user.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../../apis/userApi";
import {
  Button,
  Input,
  message,
  Modal,
  notification,
  Result,
  Spin,
} from "antd";
import {
  CheckCircleTwoTone,
  ExceptionOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

export default function User() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const param = useParams();
  const [reload, setReload] = useState(true);
  const [loadErr, setloadErr] = useState(false);
  const navigate = useNavigate();

  const { confirm } = Modal;

  const hanleFormatDate = (props) => {
    if (props === null) {
      return "";
    } else {
      const date = new Date(props);
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      let yyyy = date.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      return dd + "-" + mm + "-" + yyyy;
    }
  };

  useEffect(() => {   
    const fetchUser = async () => {
      setloadErr(false);
      setLoading(true);
      await userApi
        .getUser(param.userId)
        .then((response) => {
          if (param.role === "customer") {
            setRole("Khách hàng");
          } else if (param.role === "farmer") {
            setRole("Chủ nông trại");
          } else if (param.role === "driver") {
            setRole("Người giao hàng");
          } else {
            setRole("Quản lý kho");
          }
          setUser(response);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            notification.error({
              duration: 2,
              message: "Mất kết nối mạng!",
              style: { fontSize: 16 },
            });
            setloadErr(true);
          } else {
            notification.error({
              duration: 2,
              message: "Có lỗi xảy ra trong quá trình xử lý!",
              style: { fontSize: 16 },
            });
          }
        });
      setLoading(false);
    };
    fetchUser();
  }, [reload]);

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Bạn có muốn khóa tài khoản này?",
      icon: <ExclamationCircleOutlined />,
      content: "Tài khoản sẽ không thể tiếp tục hoạt động trên trang.",
      okText: "Tiếp Tục",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        const deleteUser = async () => {
          const result = await userApi.updateAccount(id).catch((err) => {
            if (err.message === "Network Error") {
              notification.error({
                duration: 2,
                message: "Mất kết nối mạng!",
                style: { fontSize: 16 },
              });
              setloadErr(true);
            } else {
              notification.error({
                duration: 2,
                message: "Có lỗi xảy ra trong quá trình xử lý!",
                style: { fontSize: 16 },
              });
            }
          });
          if (result === "Successfully") {
            notification.success({
              duration: 2,
              message: "Khóa thành công!",
            });
            setReload(!reload);
          }
        };
        deleteUser();
      },
      onCancel() {},
    });
  };

  const showUnbanConfirm = (id) => {
    confirm({
      title: "Bạn có muốn mở khóa tài khoản này?",
      icon: <CheckCircleTwoTone />,
      content: "Tài khoản này sẽ có thể hoạt động trở lại trên trang!",
      okText: "Tiếp Tục",
      okType: "ghost",
      cancelText: "Hủy",
      onOk() {
        const updateUser = async () => {
          const result = await userApi.updateAccount(id).catch((err) => {
            if (err.message === "Network Error") {
              notification.error({
                duration: 2,
                message: "Mất kết nối mạng!",
                style: { fontSize: 16 },
              });
              setloadErr(true);
            } else {
              notification.error({
                duration: 2,
                message: "Có lỗi xảy ra trong quá trình xử lý!",
                style: { fontSize: 16 },
              });
            }
          });
          if (result === "Successfully") {
            notification.success({
              duration: 2,
              message: "Mở khóa thành công!",
            });
            setReload(!reload);
          }
        };
        updateUser();
      },
      onCancel() {},
    });
  };

  return (
    <div className="user">
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
                setReload(!reload);
              }}
            >
              Tải lại
            </Button>,
          ]}
        ></Result>
      ) : (
        <>
          {loading ? (
            <>
              <Spin
                style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
                size="large"
              />{" "}
              <br /> <br />{" "}
            </>
          ) : (
            <div className="userContainer">
              <div className="userShow">
                <div className="userShowTop">
                  <img src={user.image} alt="" className="userShowImg" />
                </div>
                <div className="userShowBottom">
                  <div className="userShowInfo">
                    <span className="userShowInfoTitle">{user.name}</span>
                  </div>
                </div>
              </div>

              <div className="userUpdate">
                <div className="userUpdateInputGroup">
                  <div className="userUpdateItem">
                    <label className="userUpdateLabel">Họ Và Tên</label>
                    <br />
                    <Input className="userUpdateInput" value={user.name} />
                  </div>
                  <div className="userUpdateItem" style={{ marginLeft: 150 }}>
                    <label className="userUpdateLabel">Giới Tính</label>
                    <br />
                    <Input className="userUpdateInput" value={user.gender} />
                  </div>
                </div>
                <br />

                <div className="userUpdateInputGroup">
                  <div className="userUpdateItem">
                    <label className="userUpdateLabel">Vai Trò</label>
                    <br />
                    <Input className="userUpdateInput" value={role} />
                  </div>
                  <div className="userUpdateItem" style={{ marginLeft: 150 }}>
                    <label className="userUpdateLabel">Ngày Sinh</label>
                    <br />
                    <Input
                      className="userUpdateInput"
                      value={hanleFormatDate(user.dateOfBirth)}
                    />
                  </div>
                </div>
                <br />

                <div className="userUpdateInputGroup">
                  <div className="userUpdateItem">
                    <label className="userUpdateLabel">Số điện thoại</label>
                    <br />
                    <Input className="userUpdateInput" value={user.phone} />
                  </div>
                  <div className="userUpdateItem" style={{ marginLeft: 150 }}>
                    <label className="userUpdateLabel">Email</label>
                    <br />
                    <Input className="userUpdateInput" value={user.email} />
                  </div>
                </div>
                <br />
                <div className="userUpdateInputGroup">
                  <div className="userUpdateItem">
                    <label className="userUpdateLabel">Địa Chỉ</label>
                    <br />
                    <TextArea
                      className="userUpdateInput"
                      value={user.address}
                      row={4}
                      style={{ height: 80 }}
                    />
                  </div>

                  <div
                    className="userUpdateItem"
                    style={{ marginLeft: 200 }}
                  ></div>
                </div>
                {user.active ? (
                  <button
                    className="userBanButton"
                    onClick={() => showDeleteConfirm(user.id)}
                  >
                    Khóa Tài Khoản
                  </button>
                ) : (
                  <button
                    className="userUnbanButton"
                    onClick={() => showUnbanConfirm(user.id)}
                  >
                    Mở Khóa
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
