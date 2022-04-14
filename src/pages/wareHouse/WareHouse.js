import "./wareHouse.css";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  InputNumber,
  Spin,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import { useEffect, useState } from "react";
import productSystemApi from "../../apis/productSystemApi";
import productCategoriesApi from "../../apis/productCategoriesApi";
import userApi from "../../apis/userApi";
import { useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import wareHouseApi from "../../apis/wareHouseApi";
import TextArea from "antd/lib/input/TextArea";
import validator from "validator";
import externalApi from "../../apis/externalApi";

export default function WareHouse() {
  const [warehouseManagers, setWareHouseManagers] = useState([]);
  const [wareHouse, setWareHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wareHouseName, setWareHouseName] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState([]);
  const [wareHousesZones, setWareHouseZones] = useState([]);
  const [validateMsg, setValidateMsg] = useState("");
  const [wareHouseManagerID, setWareHouseManagerID] = useState(0);
  const [zoneDefault, setZoneDefault] = useState([]);

  const param = useParams();
  let naviagte = useNavigate();
  const { Option } = Select;
  const { confirm } = Modal;

  useEffect(() => {
    const fetchZone = async () => {
      const response = await externalApi.getAll();
      setZone(response);
    };
    fetchZone();
  }, []);

  useEffect(() => {
    const fetchWareHouseManagers = async () => {
      const response = await userApi.getManagerFree();
      setWareHouseManagers(response);
      console.log(response);
    };
    fetchWareHouseManagers();
  }, []);

  useEffect(() => {
    const fetchWareHouse = async () => {
      const id = param.wareHouseId;
      const response = await wareHouseApi.get(id);
      if (response) {
        console.log(response);
        setWareHouse(response);
        setWareHouseName(response.name);
        setAddress(response.address);
        let zones = [];
        response.wareHouseZones.map((zone) => {
          zones.push(zone.zoneId)
        });
        setZoneDefault(zones);
        setWareHouseManagerID(response.wareHouseManagerID);
        setLoading(false);
      }
    };
    fetchWareHouse();
  }, [param]);

  const showUpdateConfirm = () => {
    confirm({
      title: "Bạn có muốn cập nhật lại thông tin cho kho này?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Những thay đổi sẽ chỉ áp dụng lên những sản phẩm được tạo sau khi cập nhật!",
      okText: "Tiếp Tục",
      okType: "ghost",
      cancelText: "Hủy",
      async onOk() {
        const updateProduct = async () => {
          const params = {
            id: param.wareHouseId,
            name: wareHouseName,
            address: address,
            wareHouseManagerID: wareHouseManagerID,
            wareHouseZones: wareHousesZones
          };
          console.log(params);
          const result = await wareHouseApi.update(params).catch((err) => {
            message.error({
              duration: 2,
              content: err.response.data.error.message,
            });
          });
          if (result === "Update successfully!") {
            message.success({
              duration: 2,
              content: "Cập nhật thành công!",
            });
          }
        };
        await updateProduct();
        naviagte("/warehouses");
      },
      onCancel() {},
    });
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có muốn xóa kho này?",
      icon: <ExclamationCircleOutlined />,
      content: "Sau khi xóa sẽ không thể khôi phục!",
      okText: "Tiếp Tục",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        const deleteWareHouse = async () => {
          const result = await wareHouseApi
            .delete(param.wareHouseId)
            .catch((err) => {
              message.error({
                duration: 2,
                content: err.response.data.error.message,
              });
            });
          if (result === "Delete successfully!") {
            message.success({
              duration: 2,
              content: "Xóa thành công!",
            });
          }
        };
        await deleteWareHouse();
        naviagte("/warehouses");
      },
      onCancel() {},
    });
  };

  const validateAll = () => {
    const msg = {};
    if (validator.isEmpty(wareHouseName)) {
      msg.wareHouseName = "Vui lòng nhập tên kho";
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

  const onChangeWarehouseManager = (e) => {
    setWareHouseManagerID(e);
  };

  const handleUpdate = () => {
    const isValid = validateAll();
    if (isValid) {
      showUpdateConfirm();
    }
  };

  const handleChangZones = (e) => {
    console.log(e);
    let zones = [];
    e.map((zone) => {
      zones.push({zoneId: zone})
    })
    console.log(zones);
    setWareHouseZones(zones);
  };

  return (
    <div className="wareHouse">
      <div className="wareHouseTitleWrapper">
        <div className="wareHouseForm">
          <div className="wareHouseTitleWrapper2">
            <h1 className="wareHouseTitle">Thông Tin Kho</h1>

            {loading ? (
              <>
                <Spin
                  style={{ display: "flex", justifyContent: "center" }}
                  size="large"
                />{" "}
                <br /> <br />{" "}
              </>
            ) : (
              <div className="wareHouseFormWrapper">
                <div className="wareHouseFormInput">
                  <span className="wareHouseLabel">Tên kho: </span>
                  <Input
                    defaultValue={wareHouse.name}
                    style={{ width: 500 }}
                    onChange={(e) => {
                      setWareHouseName(e.target.value);
                    }}
                  />
                </div>
                <br />
                <div className="wareHouseFormInput">
                  <span className="wareHouseLabel">Địa Chỉ: </span>
                  <TextArea
                    defaultValue={wareHouse.address}
                    style={{ width: 500 }}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <span className="newWareHouseLabel" style={{ color: "red" }}>
                  {validateMsg.wareHouseName}
                </span>
                <br />

                <div className="wareHouseFormInput">
                  <span className="wareHouseLabel">Người Quản Lý:</span>
                  <Select
                    defaultValue={wareHouse.warehouseManagerName}
                    style={{ width: 500 }}
                    onChange={onChangeWarehouseManager}
                    allowClear
                  >
                    {warehouseManagers.map((manager) => {
                      return <Option value={manager.id}>{manager.name}</Option>;
                    })}
                  </Select>
                </div>
                <br />

                <div className="newWareHouseFormInput">
                  <span className="newWareHouseLabel">Khu Vực Quản Lý: </span>
                  <Select
                    mode="tags"
                    placeholder="Chọn khu vực quản lý"
                    onChange={(e) => handleChangZones(e)}
                    defaultValue={zoneDefault}
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
                  <span className="newWareHouseLabel" style={{ color: "red" }}>
                    {validateMsg.wareHouseZones}
                  </span>
                  <br />
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: 150, height: 40, borderRadius: 5 }}
                  onClick={() => handleUpdate()}
                >
                  Cập nhật
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: 150,
                    height: 40,
                    borderRadius: 5,
                    marginLeft: 50,
                  }}
                  danger
                  onClick={() => showDeleteConfirm()}
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
