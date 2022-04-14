import "./newWareHouse.css";
import { Input, Select, Button, Modal, message } from "antd";
import { useEffect, useState } from "react";
import wareHouseApi from "../../apis/wareHouseApi";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
  const provinces = city;
  const navigate = useNavigate();
  const { confirm } = Modal;

  useEffect(() => {
    const fetchZone = async () => {
      const response = await externalApi.getAll();
      setZone(response);
    };
    fetchZone();
  }, []);

  const handleCreate = () => {
    const isValid = validateAll();
    if (isValid) {
      showCreateConfirm();
    } 
  }

  const showCreateConfirm = () => {
    
    confirm({
      title: "Bạn có muốn tạo nhà kho này?",
      icon: <ExclamationCircleOutlined />,
      content: "Kho sẽ hoạt động như một nơi chứa sản phẩm trung gian!",
      okText: "Đồng Ý",
      okType: "dashed",
      cancelText: "Hủy",
      async onOk() {
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
            console.log(err);
            message.error({
              duration: 2,
              content: err.response.data.error.message,
            });
          });
          if (result === "Create successfully!") {
            message.success({
              duration: 2,
              content: "Tạo kho thành công!",
            });
          }
        };
        await createWareHouse();
        navigate("/warehouses");
      },
      onCancel() {},
    });
  };

  const validateAll = () => {
    const msg = {};
    if (validator.isEmpty(wareHouseName)) {
      msg.wareHouseName = "Vui lòng nhập tên kho";
    }
    if (validator.isEmpty(provinceName)) {
      msg.provinceName = "Vui lòng chọn tỉnh thành";
    }
    if (validator.isEmpty(districtName)) {
      msg.districtName = "Vui lòng chọn quận huyện";
    }
    if (validator.isEmpty(subDistrictName)) {
      msg.subDistrictName = "Vui Lòng chọn xã phường";
    }
    if (validator.isEmpty(address)) {
      msg.address = "Vui lòng nhập địa chỉ";
    }
    if (wareHousesZones.length === 0) {
      msg.wareHouseZones = "Vui lòng chọn khu vực quản lý";
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
                <span className="newWareHouseLabel" style={{ color: "red" }}>{validateMsg.wareHouseName}</span>
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
                <span className="newWareHouseLabel" style={{ color: "red" }}>{validateMsg.provinceName}</span>
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
                <span className="newWareHouseLabel" style={{ color: "red" }}>{validateMsg.districtName}</span>
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
                <span className="newWareHouseLabel" style={{ color: "red" }}>{validateMsg.subDistrictName}</span>
                <br />
              </div>
              <div className="newWareHouseFormInput">
                <span className="newWareHouseLabel">Nhập Địa Chỉ: </span>
                <TextArea
                  placeholder="Nhập địa chỉ"
                  onChange={(e) => handleChangeAddress(e)}
                  style={{ width: 500 }}
                />
                <span className="newWareHouseLabel" style={{ color: "red" }}>{validateMsg.address}</span>
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
                <span className="newWareHouseLabel" style={{ color: "red" }}>{validateMsg.wareHouseZones}</span>
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
    </div>
  );
}