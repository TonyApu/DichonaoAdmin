import "./newWareHouse.css";
import { Input, Select, Button, Modal, message, notification, Result } from "antd";
import { useEffect, useState } from "react";
import wareHouseApi from "../../apis/wareHouseApi";
import { useNavigate } from "react-router-dom";
import { CheckCircleTwoTone, ExclamationCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import externalApi from "../../apis/externalApi";
import { city } from "../../geography/province_city/tinh_tp";
import { district } from "../../geography/district/district";
import { sub_district } from "../../geography/sub_district_village/sub_district";
import validator from "validator";
export default function NewWareHouse() {
  const { Option } = Select;
  const [wareHouseName, setWareHouseName] = useState("");
  const [zone, setZone] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [subDistrictName, setSubDistrictName] = useState("");
  const [address, setAddress] = useState("");
  const [wareHousesZones, setWareHouseZones] = useState([]);
  const [validateMsg, setValidateMsg] = useState("");
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);
  const [loading, setLoading] = useState(true);
  const provinces = city;
  const navigate = useNavigate();
  const { confirm } = Modal;

  useEffect(() => {
    const fetchZone = async () => {
      setloadErr(false);
      setLoading(true);
      await externalApi
        .getAll()
        .then((response) => {
          setZone(response);
          setLoading(false);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            notification.error({
              duration: 2,
              message: "Mất kết nối mạng!",
              style: { fontSize: 16 },
            });
          } else if (err.message === "timeout") {
            notification.error({
              duration: 2,
              message: "Server mất thời gian quá lâu để phản hồi!",
              style: { fontSize: 16 },
            });
          } else if (err.response.status === 400) {
            notification.error({
              duration: 2,
              message: "Đã có lỗi xảy ra!",
              style: { fontSize: 16 },
            });
          } else {
            notification.error({
              duration: 2,
              message: "Có lỗi xảy ra trong quá trình xử lý!",
              style: { fontSize: 16 },
            });
          }
          setloadErr(true);
        });
    };
    fetchZone();
  }, [flag]);

  const handleCreate = () => {
    const isValid = validateAll();
    if (isValid) {
      showCreateConfirm();
    }
  };

  const showCreateConfirm = () => {
    confirm({
      title: "Bạn có muốn tạo nhà kho này?",
      icon: <CheckCircleTwoTone />,
      content: "Kho sẽ hoạt động như một nơi chứa, quản lý nông sản!",
      okText: "Tiếp Tục",
      okType: "dashed",
      cancelText: "Hủy",
      onOk() {
        const createWareHouse = async () => {
          let zone = [];
          {
            wareHousesZones.map((wareHouseZone) => {
              zone.push({ zoneId: wareHouseZone });
            });
          }
          let location =
            address +
            ", " +
            subDistrictName +
            ", " +
            districtName +
            ", " +
            provinceName;
          const params = {
            name: wareHouseName,
            address: location,
            wareHouseZones: zone,
          };
          console.log(params);
          const result = await wareHouseApi.create(params).catch((err) => {
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
            } else {
              notification.error({
                duration: 2,
                message: err.response.data.error.message,
                style: { fontSize: 16 },
              });
            }
          });
          if (result === "Create successfully!") {
            notification.success({
              duration: 2,
              message: "Tạo thành công!",
              style: { fontSize: 16 },
            });
            setLoading(false);
            navigate("/warehouses");
          }
        };
        createWareHouse();
      },
      onCancel() {},
    });
  };

  const validateAll = () => {
    const msg = {};
    if (validator.isEmpty(wareHouseName)) {
      msg.wareHouseName = "Vui lòng nhập mục này";
    }
    if (validator.isEmpty(provinceName)) {
      msg.provinceName = "Vui lòng chọn mục này";
    }
    if (validator.isEmpty(districtName)) {
      msg.districtName = "Vui lòng chọn mục này";
    }
    if (validator.isEmpty(subDistrictName)) {
      msg.subDistrictName = "Vui Lòng chọn mục này";
    }
    if (validator.isEmpty(address)) {
      msg.address = "Vui lòng nhập mục này";
    }
    if (wareHousesZones.length === 0) {
      msg.wareHouseZones = "Vui lòng chọn mục này";
    }

    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const hanldeChangProvince = (e) => {
    setProvinceName(city[e].name_with_type);
    setDistrictName("");
    setDistricts(district[e]);
  };

  const hanldeChangDistrict = (e) => {
    setDistrictName(districts[e].name_with_type);
    setSubDistrictName("");
    setSubDistricts(sub_district[e]);
  };

  const hanldeChangSubDistrict = (e) => {
    setSubDistrictName(subDistricts[e].name_with_type);
  };

  const handleChangZones = (e) => {
    setWareHouseZones(e);
  };

  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleChangeWareHouseName = (e) => {
    setWareHouseName(e.target.value);
  };
  return (
    <div className="newWareHouse">
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
        <div className="newWareHouseTitleWrapper">
          <div className="newWareHouseForm">
            <div className="newWareHouseTitleWrapper2">
              <h1 className="newWareHouseTitle">Tạo Kho Mới</h1>
              <div className="newWareHouseFormWrapper">
                <div className="newWareHouseFormInput">
                  <span className="newWareHouseLabel">Tên Nhà Kho: </span>
                  <Input
                    placeholder="Nhập tên nhà kho"
                    style={{ width: 500 }}
                    onChange={(e) => handleChangeWareHouseName(e)}
                  />
                  <span className="newWarehouseLabelErr">
                    {validateMsg.wareHouseName}
                  </span>
                  <br />
                </div>
                <div className="newWareHouseFormInput">
                  <span className="newWareHouseLabel">Tỉnh Thành: </span>
                  <Select
                    placeholder="Chọn khu vực quản lý"
                    onChange={hanldeChangProvince}
                    style={{ width: 500 }}
                  >
                    {Object.values(provinces).map((zone) => {
                      return (
                        <Option value={zone.code} key={zone.id}>
                          {zone.name_with_type}
                        </Option>
                      );
                    })}
                  </Select>
                  <span className="newWarehouseLabelErr">
                    {validateMsg.provinceName}
                  </span>
                  <br />
                </div>
                <div className="newWareHouseFormInput">
                  <span className="newWareHouseLabel">Quận Huyện: </span>
                  <Select
                    placeholder="Chọn khu vực quản lý"
                    onChange={hanldeChangDistrict}
                    style={{ width: 500 }}
                    value={districtName}
                  >
                    {Object.values(districts).map((zone) => {
                      return (
                        <Option value={zone.code} key={zone.id}>
                          {zone.name_with_type}
                        </Option>
                      );
                    })}
                  </Select>
                  <span className="newWarehouseLabelErr">
                    {validateMsg.districtName}
                  </span>
                  <br />
                </div>
                <div className="newWareHouseFormInput">
                  <span className="newWareHouseLabel">Xã Phường: </span>
                  <Select
                    placeholder="Chọn khu vực quản lý"
                    onChange={hanldeChangSubDistrict}
                    value={subDistrictName}
                    style={{ width: 500 }}
                  >
                    {Object.values(subDistricts).map((zone) => {
                      return (
                        <Option value={zone.code} key={zone.id}>
                          {zone.name_with_type}
                        </Option>
                      );
                    })}
                  </Select>
                  <span className="newWarehouseLabelErr">
                    {validateMsg.subDistrictName}
                  </span>
                  <br />
                </div>
                <div className="newWareHouseFormInput">
                  <span className="newWareHouseLabel">Nhập Địa Chỉ: </span>
                  <TextArea
                    placeholder="Nhập địa chỉ"
                    onChange={(e) => handleChangeAddress(e)}
                    style={{ width: 500 }}
                  />
                  <span className="newWarehouseLabelErr">
                    {validateMsg.address}
                  </span>
                  <br />
                </div>
                <div className="newWareHouseFormInput">
                  <span className="newWareHouseLabel">Khu Vực Quản Lý: </span>
                  <Select
                    mode="tags"
                    placeholder="Chọn khu vực quản lý"
                    onChange={(e) => handleChangZones(e)}
                    style={{ width: 500 }}
                  >
                    {zone.map((zone) => {
                      return (
                        <Option value={zone.id} key={zone.id}>
                          {zone.name}
                        </Option>
                      );
                    })}
                  </Select>
                  <span className="newWarehouseLabelErr">
                    {validateMsg.wareHouseZones}
                  </span>
                  <br />
                </div>
                <div className="newWareHouseFormInput">
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
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
