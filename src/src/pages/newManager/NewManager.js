import "./newManager.css";
import {
  Input,
  Select,
  Modal,
  message,
  DatePicker,
  Button,
  notification,
  Result,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import userApi from "../../apis/userApi";
import TextArea from "antd/lib/input/TextArea";

export default function NewManager() {
  const { Option } = Select;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassWord, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [validateMsg, setValidateMsg] = useState("");
  const [invalidUsername, setInvalidUsername] = useState("");
  const [invalidPassword, setInvalidPassword] = useState("");
  const [invalidConfirm, setInvalidConfirm] = useState("");
  const [invalidName, setInvalidName] = useState("");
  const [invalidAddress, setInvalidAddress] = useState("");
  const [invalidPhone, setInvalidPhone] = useState("");
  const [invalidGender, setInvalidGender] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [invalidDob, setInvalidDob] = useState("");
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { confirm } = Modal;

  useEffect(() => {
    setloadErr(false);
    setLoading(false);
  }, [flag]);

  const handleDateChange = (date, dateString) => {
    setDob(dateString);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

  const checkInvalidUsername = () => {
    if (!/^[a-zA-Z0-9_]{5,}$/.test(username)) {
      setInvalidUsername(
        "Tên đăng nhập phải có ít nhất 5 kí tự, và không được có kí tự đặc biệt."
      );
    } else {
      setInvalidUsername("");
    }
  };

  const checkInvalidPassword = () => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setInvalidPassword(
        "Mật khẩu phải có ít nhất 8 kí tự, bao gồm cả chữ hoa, chữ thường và số."
      );
    } else {
      setInvalidPassword("");
    }
  };

  const checkInvalidConfirm = () => {
    if (confirmPassWord !== password) {
      setInvalidConfirm("Mật khẩu không khớp.");
    } else {
      setInvalidConfirm("");
    }
  };

  const checkInvalidName = () => {
    if (validator.isEmpty(name)) {
      setInvalidName("Tên đăng nhập không hợp lệ");
    } else {
      setInvalidName("");
    }
  };

  const checkInvalidAddress = () => {
    if (validator.isEmpty(address)) {
      setInvalidAddress("Địa chỉ không hợp lệ");
    } else {
      setInvalidAddress("");
    }
  };

  const checkInvalidPhoneNumber = () => {
    if (
      !/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        phone
      )
    ) {
      setInvalidPhone("Số điện thoại không hợp lệ");
    } else {
      setInvalidPhone("");
    }
  };

  const checkInvalidGender = () => {
    if (validator.isEmpty(gender)) {
      setInvalidGender("Vui lòng chọn giới tính.");
    } else {
      setInvalidGender("");
    }
  };

  const checkInvalidEmail = () => {
    if (validator.isEmpty(email)) {
      setInvalidEmail("Vui lòng chọn giới tính.");
    } else {
      setInvalidEmail("");
    }
  };

  const checkInvalidDob = () => {
    if (validator.isEmpty(dob)) {
      setInvalidDob("Vui lòng chọn ngày sinh");
    } else {
      setInvalidDob("");
    }
  };

  const validateAll = () => {
    let error = 0;
    if (!/^[a-zA-Z0-9_]{5,}$/.test(username)) {
      setInvalidUsername(
        "Tên đăng nhập phải có ít nhất 5 kí tự, và không được có kí tự đặc biệt"
      );
      error++;
    } else {
      setInvalidUsername("");
    }

    if (validator.isEmpty(email)) {
      setInvalidEmail("Email không hợp lệ.");
      error++;
    } else {
      setInvalidEmail("");
    }

    if (validator.isEmpty(dob)) {
      setInvalidDob("Vui lòng chọn ngày sinh");
      error++;
    } else {
      setInvalidDob("");
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setInvalidPassword(
        "Mật khẩu phải có ít nhất 8 kí tự, bao gồm cả chữ hoa, chữ thường và số"
      );
      error++;
    } else {
      setInvalidPassword("");
    }

    if (confirmPassWord !== password) {
      setInvalidConfirm("Mật khẩu không khớp.");
      error++;
    } else {
      setInvalidConfirm("");
    }

    if (
      !/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        phone
      )
    ) {
      setInvalidPhone("Số điện thoại không hợp lệ");
      error++;
    } else {
      setInvalidPhone("");
    }

    if (validator.isEmpty(address)) {
      setInvalidAddress("Địa chỉ không hợp lệ");
      error++;
    } else {
      setInvalidAddress("");
    }

    if (validator.isEmpty(name)) {
      setInvalidName("Họ và tên không hợp lệ");
      error++;
    } else {
      setInvalidName("");
    }

    if (validator.isEmpty(gender)) {
      setInvalidGender("Vui lòng chọn giới tính");
      error++;
    } else {
      setInvalidGender("");
    }

    if (error > 0) return false;
    return true;
  };

  const hanleFormatDate = (props) => {
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
    return yyyy + "-" + mm + "-" + dd;
  };

  const handleCreate = () => {
    const isValid = validateAll();
    if (isValid) {
      showRegisterConfirm();
    }
  };

  const showRegisterConfirm = () => {
    confirm({
      title: "Bạn có muốn tạo tài khoản này?",
      icon: <CheckCircleTwoTone />,
      content: "Tài khoản này sẽ hoạt động với vai trò quản lý một kho nào đó!",
      okText: "Tiếp tục",
      okType: "dashed",
      cancelText: "Hủy",
      onOk() {
        const registerAccount = async () => {
          setLoading(true);
          const data = {
            userName: username,
            phoneNumber: phone,
            password: password,
            address: address,
            gender: gender,
            email: email,
            dateOfBirth: hanleFormatDate(dob),
            name: name,
            role: [
              {
                name: "warehouseManager",
              },
            ],
          };
          const result = await userApi
            .registerWareHouseManager(data)
            .catch((err) => {
              if (err.message === "Network Error") {
                notification.error({
                  duration: 2,
                  message: "Mất kết nối mạng!",
                  style: { fontSize: 16 },
                });
                setloadErr(true);
              } else if (err.message === "timeout") {
                notification.error({
                  duration: 2,
                  message: "Server mất thời gian quá lâu để phản hồi!",
                  style: { fontSize: 16 },
                });
                setloadErr(true);
              } else if (err.response.status === 400) {
                notification.error({
                  duration: 2,
                  message: "Đã có lỗi xảy ra!",
                  style: { fontSize: 16 },
                });
                setFlag(!flag);
              } else {
                notification.error({
                  duration: 2,
                  message: err.response.data.error.message,
                  style: { fontSize: 16 },
                });
                setFlag(!flag);
              }
              setLoading(true);
            });
          if (result.succeeded) {
            notification.success({
              duration: 2,
              content: "Tạo thành công!",
              style: { fontSize: 16 },
            });
            setLoading(false);
            navigate("/warehouseManager");
          }
        };
        registerAccount();
      },
      onCancel() {},
    });
  };

  return (
    <div className="newManager">
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
        <div className="newManagerTitleWrapper">
          {loading ? (
            <>
              <Spin
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
                size="large"
              />{" "}
              <br /> <br />{" "}
            </>
          ) : (
            <div className="newManagerForm">
              <div className="newManagerTitleWrapper2">
                <h1 className="newManagerTitle">Tạo Tài Khoản Quản Lý Kho</h1>
                <div className="newManagerFormWrapper">
                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Tên Đăng Nhập: </span>
                    <Input
                      placeholder="Nhập tên đăng nhập"
                      style={{ width: 500 }}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={checkInvalidUsername}
                    />
                    <span className="newManagerLabelErr">
                      {invalidUsername}
                    </span>
                    <br />
                  </div>

                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Mật Khẩu: </span>
                    <Input.Password
                      placeholder="Nhập mật khẩu"
                      style={{ width: 500 }}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={checkInvalidPassword}
                    />
                    <span className="newManagerLabelErr">
                      {invalidPassword}
                    </span>
                    <br />
                  </div>

                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Xác Nhận Mật Khẩu: </span>
                    <Input.Password
                      placeholder="Nhập lại mật khẩu"
                      style={{ width: 500 }}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={checkInvalidConfirm}
                    />
                    <span className="newManagerLabelErr">{invalidConfirm}</span>
                    <br />
                  </div>

                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Họ Và Tên: </span>
                    <Input
                      placeholder="Nhập họ và tên"
                      style={{ width: 500 }}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={checkInvalidName}
                    />
                    <span className="newManagerLabelErr">{invalidName}</span>
                    <br />
                  </div>

                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Số Điện Thoại: </span>
                    <Input
                      placeholder="Nhập số điện thoại"
                      style={{ width: 500 }}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={checkInvalidPhoneNumber}
                    />
                    <span className="newManagerLabelErr">{invalidPhone}</span>
                    <br />
                  </div>

                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Giới Tính: </span>
                    <Select
                      style={{ width: 500 }}
                      onChange={handleGenderChange}
                      onBlur={checkInvalidGender}
                    >
                      <Option value="nam">Nam</Option>
                      <Option value="nữ">Nữ</Option>
                      <Option value="khác">Khác</Option>
                    </Select>
                    <span className="newManagerLabelErr">{invalidGender}</span>
                    <br />
                  </div>
                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Ngày Sinh: </span>
                    <DatePicker
                      onChange={handleDateChange}
                      style={{ width: 500 }}
                      onBlur={checkInvalidDob}
                    />
                    <span className="newManagerLabelErr">{invalidDob}</span>
                    <br />
                  </div>
                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Email: </span>
                    <Input
                      placeholder="Nhập email"
                      style={{ width: 500 }}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={checkInvalidEmail}
                    />
                    <span className="newManagerLabelErr">{invalidEmail}</span>
                    <br />
                  </div>
                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Địa Chỉ: </span>
                    <TextArea
                      placeholder="Nhập địa chỉ"
                      style={{ width: 500 }}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={checkInvalidAddress}
                    />
                    <span className="newManagerLabelErr">{invalidAddress}</span>
                    <br />
                  </div>
                  <div className="newManagerFormInput">
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        width: 150,
                        height: 40,
                        borderRadius: 5,
                        marginBottom: 20,
                      }}
                      onClick={() => handleCreate()}
                    >
                      Tạo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
