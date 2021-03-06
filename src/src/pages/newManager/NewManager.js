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
        "T??n ????ng nh???p ph???i c?? ??t nh???t 5 k?? t???, v?? kh??ng ???????c c?? k?? t??? ?????c bi???t."
      );
    } else {
      setInvalidUsername("");
    }
  };

  const checkInvalidPassword = () => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setInvalidPassword(
        "M???t kh???u ph???i c?? ??t nh???t 8 k?? t???, bao g???m c??? ch??? hoa, ch??? th?????ng v?? s???."
      );
    } else {
      setInvalidPassword("");
    }
  };

  const checkInvalidConfirm = () => {
    if (confirmPassWord !== password) {
      setInvalidConfirm("M???t kh???u kh??ng kh???p.");
    } else {
      setInvalidConfirm("");
    }
  };

  const checkInvalidName = () => {
    if (validator.isEmpty(name)) {
      setInvalidName("T??n ????ng nh???p kh??ng h???p l???");
    } else {
      setInvalidName("");
    }
  };

  const checkInvalidAddress = () => {
    if (validator.isEmpty(address)) {
      setInvalidAddress("?????a ch??? kh??ng h???p l???");
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
      setInvalidPhone("S??? ??i???n tho???i kh??ng h???p l???");
    } else {
      setInvalidPhone("");
    }
  };

  const checkInvalidGender = () => {
    if (validator.isEmpty(gender)) {
      setInvalidGender("Vui l??ng ch???n gi???i t??nh.");
    } else {
      setInvalidGender("");
    }
  };

  const checkInvalidEmail = () => {
    if (validator.isEmpty(email)) {
      setInvalidEmail("Vui l??ng ch???n gi???i t??nh.");
    } else {
      setInvalidEmail("");
    }
  };

  const checkInvalidDob = () => {
    if (validator.isEmpty(dob)) {
      setInvalidDob("Vui l??ng ch???n ng??y sinh");
    } else {
      setInvalidDob("");
    }
  };

  const validateAll = () => {
    let error = 0;
    if (!/^[a-zA-Z0-9_]{5,}$/.test(username)) {
      setInvalidUsername(
        "T??n ????ng nh???p ph???i c?? ??t nh???t 5 k?? t???, v?? kh??ng ???????c c?? k?? t??? ?????c bi???t"
      );
      error++;
    } else {
      setInvalidUsername("");
    }

    if (validator.isEmpty(email)) {
      setInvalidEmail("Email kh??ng h???p l???.");
      error++;
    } else {
      setInvalidEmail("");
    }

    if (validator.isEmpty(dob)) {
      setInvalidDob("Vui l??ng ch???n ng??y sinh");
      error++;
    } else {
      setInvalidDob("");
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
      setInvalidPassword(
        "M???t kh???u ph???i c?? ??t nh???t 8 k?? t???, bao g???m c??? ch??? hoa, ch??? th?????ng v?? s???"
      );
      error++;
    } else {
      setInvalidPassword("");
    }

    if (confirmPassWord !== password) {
      setInvalidConfirm("M???t kh???u kh??ng kh???p.");
      error++;
    } else {
      setInvalidConfirm("");
    }

    if (
      !/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        phone
      )
    ) {
      setInvalidPhone("S??? ??i???n tho???i kh??ng h???p l???");
      error++;
    } else {
      setInvalidPhone("");
    }

    if (validator.isEmpty(address)) {
      setInvalidAddress("?????a ch??? kh??ng h???p l???");
      error++;
    } else {
      setInvalidAddress("");
    }

    if (validator.isEmpty(name)) {
      setInvalidName("H??? v?? t??n kh??ng h???p l???");
      error++;
    } else {
      setInvalidName("");
    }

    if (validator.isEmpty(gender)) {
      setInvalidGender("Vui l??ng ch???n gi???i t??nh");
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
      title: "B???n c?? mu???n t???o t??i kho???n n??y?",
      icon: <CheckCircleTwoTone />,
      content: "T??i kho???n n??y s??? ho???t ?????ng v???i vai tr?? qu???n l?? m???t kho n??o ????!",
      okText: "Ti???p t???c",
      okType: "dashed",
      cancelText: "H???y",
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
                  message: "M???t k???t n???i m???ng!",
                  style: { fontSize: 16 },
                });
                setloadErr(true);
              } else if (err.message === "timeout") {
                notification.error({
                  duration: 2,
                  message: "Server m???t th???i gian qu?? l??u ????? ph???n h???i!",
                  style: { fontSize: 16 },
                });
                setloadErr(true);
              } else if (err.response.status === 400) {
                notification.error({
                  duration: 2,
                  message: "???? c?? l???i x???y ra!",
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
              content: "T???o th??nh c??ng!",
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
          title="???? c?? l???i x???y ra!"
          subTitle="R???t ti???c ???? c?? l???i x???y ra trong qu?? tr??nh t???i d??? li???u, vui l??ng ki???m tra l???i k???t n???i m???ng v?? th??? l???i."
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setFlag(!flag);
              }}
            >
              T???i l???i
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
                <h1 className="newManagerTitle">T???o T??i Kho???n Qu???n L?? Kho</h1>
                <div className="newManagerFormWrapper">
                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">T??n ????ng Nh???p: </span>
                    <Input
                      placeholder="Nh???p t??n ????ng nh???p"
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
                    <span className="newManagerLabel">M???t Kh???u: </span>
                    <Input.Password
                      placeholder="Nh???p m???t kh???u"
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
                    <span className="newManagerLabel">X??c Nh???n M???t Kh???u: </span>
                    <Input.Password
                      placeholder="Nh???p l???i m???t kh???u"
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
                    <span className="newManagerLabel">H??? V?? T??n: </span>
                    <Input
                      placeholder="Nh???p h??? v?? t??n"
                      style={{ width: 500 }}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={checkInvalidName}
                    />
                    <span className="newManagerLabelErr">{invalidName}</span>
                    <br />
                  </div>

                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">S??? ??i???n Tho???i: </span>
                    <Input
                      placeholder="Nh???p s??? ??i???n tho???i"
                      style={{ width: 500 }}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={checkInvalidPhoneNumber}
                    />
                    <span className="newManagerLabelErr">{invalidPhone}</span>
                    <br />
                  </div>

                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Gi???i T??nh: </span>
                    <Select
                      style={{ width: 500 }}
                      onChange={handleGenderChange}
                      onBlur={checkInvalidGender}
                    >
                      <Option value="nam">Nam</Option>
                      <Option value="n???">N???</Option>
                      <Option value="kh??c">Kh??c</Option>
                    </Select>
                    <span className="newManagerLabelErr">{invalidGender}</span>
                    <br />
                  </div>
                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">Ng??y Sinh: </span>
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
                      placeholder="Nh???p email"
                      style={{ width: 500 }}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={checkInvalidEmail}
                    />
                    <span className="newManagerLabelErr">{invalidEmail}</span>
                    <br />
                  </div>
                  <div className="newManagerFormInput">
                    <span className="newManagerLabel">?????a Ch???: </span>
                    <TextArea
                      placeholder="Nh???p ?????a ch???"
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
                      T???o
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
