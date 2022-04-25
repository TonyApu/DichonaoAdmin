import "./newManager.css";
import {
  Input,
  Select,
  Modal,
  message,
  DatePicker,
  Button,
  notification,
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
  const navigate = useNavigate();
  const { confirm } = Modal;

  const handleDateChange = (date, dateString) => {
    setDob(dateString);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

  const validateAll = () => {
    const msg = {};
    if (!/^[a-zA-Z0-9_]{5,}$/.test(username)) {
      msg.username =
        "Tên đăng nhập phải có ít nhất 5 kí tự, và không được có kí tự đặc biệt";
    }
    if (!validator.isEmail(email)) {
      msg.email = "Email không hợp lệ";
    }
    if (validator.isEmpty(dob)) {
      msg.dob = "Vui lòng nhập mục này";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      msg.password =
        "Mật khẩu phải có ít nhất 8 kí tự, bao gồm cả chữ hoa, chữ thường và số";
    }
    if (password !== confirmPassWord) {
      msg.confirmPassword = "Mật khẩu không khớp";
    }
    if (
      !/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        phone
      )
    ) {
      msg.phone = "Số điện thoại không hợp lệ";
    }
    if (validator.isEmpty(address)) {
      msg.address = "Vui lòng nhập mục này";
    }
    if (validator.isEmpty(name)) {
      msg.name = "Vui lòng nhập mục này";
    }
    if (validator.isEmpty(gender)) {
      msg.gender = "Vui lòng chọn mục này";
    }

    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
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
      async onOk() {
        const registerAccount = async () => {
          const data = {
            userName: username,
            phoneNumber: phone,
            password: password,
            address: address,
            gender: gender,
            email: email,
            dateOfBirth: dob,
            name: name,
            role: [
              {
                name: "warehouseManager",
              },
            ],
          };
          console.log(data);
          const result = await userApi
            .registerWareHouseManager(data)
            .catch((err) => {
              console.log(err);
              notification.error({
                duration: 2,
                message: err.response.data.error.message,
                style: { fontSize: 16 },
              });
            });
          if (result === "Create successfully!") {
            notification.success({
              duration: 2,
              content: "Tạo thành công!",
              style: { fontSize: 16 },
            });
          }
        };
        await registerAccount();
        navigate("/deliveryManagers");
      },
      onCancel() {},
    });
  };

  return (
    <div className="newManager">
      <div className="newManagerTitleWrapper">
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
                />
                <span className="newManagerLabelErr">
                  {validateMsg.username}
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
                />
                <span className="newManagerLabelErr">
                  {validateMsg.password}
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
                />
                <span className="newManagerLabelErr">
                  {validateMsg.confirmPassWord}
                </span>
                <br />
              </div>

              <div className="newManagerFormInput">
                <span className="newManagerLabel">Họ Và Tên: </span>
                <Input
                  placeholder="Nhập họ và tên"
                  style={{ width: 500 }}
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="newManagerLabelErr">
                  {validateMsg.name}
                </span>
                <br />
              </div>

              <div className="newManagerFormInput">
                <span className="newManagerLabel">Số Điện Thoại: </span>
                <Input
                  placeholder="Nhập số điện thoại"
                  style={{ width: 500 }}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <span className="newManagerLabelErr">
                  {validateMsg.phone}
                </span>
                <br />
              </div>

              <div className="newManagerFormInput">
                <span className="newManagerLabel">Giới Tính: </span>
                <Select style={{ width: 500 }} onChange={handleGenderChange}>
                  <Option value="nam">Nam</Option>
                  <Option value="nữ">Nữ</Option>
                  <Option value="khác">Khác</Option>
                </Select>
                <span className="newManagerLabelErr">
                  {validateMsg.gender}
                </span>
                <br />
              </div>
              <div className="newManagerFormInput">
                <span className="newManagerLabel">Ngày Sinh: </span>
                <DatePicker
                  onChange={handleDateChange}
                  style={{ width: 500 }}
                />
                <span className="newManagerLabelErr">
                  {validateMsg.dob}
                </span>
                <br />
              </div>
              <div className="newManagerFormInput">
                <span className="newManagerLabel">Email: </span>
                <Input
                  placeholder="Nhập email"
                  style={{ width: 500 }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="newManagerLabelErr">
                  {validateMsg.email}
                </span>
                <br />
              </div>
              <div className="newManagerFormInput">
                <span className="newManagerLabel">Địa Chỉ: </span>
                <TextArea
                  placeholder="Nhập địa chỉ"
                  style={{ width: 500 }}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <span className="newManagerLabelErr">
                  {validateMsg.address}
                </span>
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
      </div>
    </div>
  );
}
