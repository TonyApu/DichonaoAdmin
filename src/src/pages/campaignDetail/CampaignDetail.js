import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import campaignsApi from "../../apis/campaignsApi";
import validator from "validator";
import { storage } from "../../firebase/firebase";
import moment from "moment";
import "./campaignDetail.css";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  notification,
  Radio,
  Select,
  Space,
  Spin,
  Upload,
  Result,
  Timeline,
} from "antd";
import { Option } from "antd/lib/mentions";
import TextArea from "antd/lib/input/TextArea";
import productSystemApi from "../../apis/productSystemApi";
import externalApi from "../../apis/externalApi";
import {
  CheckCircleTwoTone,
  CheckOutlined,
  ExceptionOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const CampaignDetail = () => {
  const param = useParams();
  const [campaign, setCampaign] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [campaignZoneId, setCampaignZoneId] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState([]);
  const [type, setType] = useState("");
  const [campaignDeliveryZones, setCampaignDeliveryZones] = useState([]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [startRecruimentAt, setStartRecruimentAt] = useState("");
  const [endRecruimentAt, setEndRecruimentAt] = useState("");
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("");
  const [fileList, setFileList] = useState([]);
  const [productSalesCampaigns, setProductSalesCampaigns] = useState([]);
  const [productsSystem, setProductsSystem] = useState([]);
  const [mapZone, setMapZone] = useState([]);
  const [validateMsg, setValidateMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [note, setNote] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [loadErr, setloadErr] = useState(false);
  const [reload, setReload] = useState(true);
  const { confirm } = Modal;

  useEffect(() => {
    const fetChDeliveryZone = async () => {
      const response = await externalApi.getAll();
      setMapZone(response);
    };
    fetChDeliveryZone();
  }, []);

  useEffect(() => {
    const fetProductSystem = async () => {
      const response = await productSystemApi.getAll();
      setProductsSystem(response);
    };

    fetProductSystem();
  }, []);

  useEffect(() => {
    const fetchCampaign = async () => {
      setloadErr(false);
      setLoading(true);
      await campaignsApi
        .get(param.campaignId)
        .then((response) => {
          setCampaign(response);
          setType(response.type);
          setCampaignName(response.name);
          setDescription(response.description);
          setStartAt(response.startAt);
          setEndAt(response.endAt);
          setStartRecruimentAt(response.startRecruitmentAt);
          setEndRecruimentAt(response.endRecruitmentAt);
          let deliveryTime = new Date(response.endAt);
          deliveryTime.setDate(deliveryTime.getDate() + 2);
          setExpectedDeliveryTime(deliveryTime);
          setProductSalesCampaigns(response.productSalesCampaigns);
          setCampaignZoneId(response.campaignZoneId);
          setCampaignDeliveryZones(response.campaignDeliveryZones);
          let file = [];
          file.push({
            uid: "-1",
            name: "image.png",
            status: "done",
            url: response.image1,
          });
          if (response.image2 !== null) {
            file.push({
              uid: "-2",
              name: "image.png",
              status: "done",
              url: response.image2,
            });
          }
          if (response.image3 !== null) {
            file.push({
              uid: "-3",
              name: "image.png",
              status: "done",
              url: response.image3,
            });
          }
          if (response.image4 !== null) {
            file.push({
              uid: "-4",
              name: "image.png",
              status: "done",
              url: response.image4,
            });
          }
          if (response.image5 !== null) {
            file.push({
              uid: "-5",
              name: "image.png",
              status: "done",
              url: response.image5,
            });
          }
          setFileList(file);
          setLoadingList(false);
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
    fetchCampaign();
  }, [reload]);

  const onImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const upLoadImage = async (imageAsFile) => {
    let firebaseUrl = "";
    try {
      const storageRef = ref(storage, `/Images/Campaign/${imageAsFile.name}`);
      const upLoadTask = await uploadBytesResumable(storageRef, imageAsFile);
      if (upLoadTask !== undefined) {
        const url = await getDownloadURL(storageRef);
        firebaseUrl = url;
      }
    } catch (error) {
      console.log(error);
    }

    return firebaseUrl;
  };

  const getListDeliveryZone = () => {
    let zoneList = [];
    if (campaign !== null) {
      campaignDeliveryZones.map((zone) => {
        zoneList.push(zone.deliveryZoneId);
      });
      setDeliveryZone(zoneList);
    }
    console.log(zoneList);
    return zoneList;
  };

  const getListProductInCampaign = () => {
    let listProduct = [];
    if (campaign !== null) {
      productSalesCampaigns.map((product) => {
        listProduct.push(product.productSystemId);
      });
    }
    return listProduct;
  };

  const formatDate = (e) => {
    if (e === "") {
      return "";
    } else {
      let value = new Date(e);
      let dd = value.getDate();
      let mm = value.getMonth() + 1;
      let yyyy = value.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      const date = dd + "-" + mm + "-" + yyyy;
      return date;
    }
  };

  const handleFarmZoneChange = (value) => {
    setCampaignZoneId(value);
  };

  const handleDeliveyZoneChange = (value) => {
    setDeliveryZone(value);
  };

  const handleProductChange = async (e) => {
    let listProduct = [];
    let idIndex = 1;
    setLoadingList(true);
    e.map((id) => {
      console.log(id);
      // console.log(document.getElementById(id).value);
      for (let index = 0; index < productsSystem.length; index++) {
        if (id === productsSystem[index].id) {
          let product = productsSystem[index];
          console.log(product);
          let min = document.getElementById("min" + id);
          let max = document.getElementById("max" + id);
          if (min !== null && max !== null) {
            listProduct.push({
              id: idIndex++,
              maxCapacity: max.value,
              minCapacity: min.value,
              productSystemId: product.id,
              productSystem: {
                id: product.id,
                name: product.name,
                minPrice: product.minPrice,
                maxPrice: product.maxPrice,
                unit: product.unit,
              },
            });
          } else {
            listProduct.push({
              id: idIndex++,
              minCapacity: "",
              maxCapacity: "",
              productSystemId: product.id,
              productSystem: {
                id: product.id,
                name: product.name,
                minPrice: product.minPrice,
                maxPrice: product.maxPrice,
                unit: product.unit,
              },
            });
          }
        }
      }
    });
    setProductSalesCampaigns(listProduct);
    setLoadingList(false);
  };

  const validateAll = () => {
    const msg = {};
    if (validator.isEmpty(campaignName.trim())) {
      msg.campaignName = "Tên chiến dịch không hợp lệ";
    }
    if (validator.isEmpty(description.trim())) {
      msg.description = "Vui lòng nhập mô tả";
    }
    if (campaignZoneId === "") {
      msg.farmZone = "Vui lòng chọn khu vực chiến dịch";
    }
    if (fileList.length === 0) {
      msg.fileList = "Vui lòng chọn ảnh";
    }
    if (deliveryZone.length === 0) {
      msg.deliveryZone = "Vui lòng chọn khu vực giao hàng";
    }
    if (productSalesCampaigns.length === 0) {
      msg.productList = "Vui lòng chọn sản phẩm bày bán trong chiến dịch";
    }
    productSalesCampaigns.map((product) => {
      let maxCapacity = document.getElementById(
        "max" + product.productSystemId
      ).value;
      let minCapacity = document.getElementById(
        "min" + product.productSystemId
      ).value;

      if (maxCapacity !== "" && minCapacity !== "") {
        if (parseInt(maxCapacity) < parseInt(minCapacity)) {
          msg.capacity = "Số lượng tối đa phải lớn hơn số tối thiểu";
        }
      } else {
        if (!/^[1-9][0-9]{1,3}$/.test(parseInt(maxCapacity))) {
          msg.capacity = "Số lượng sản phẩm không hợp lệ";
        }
        if (!/^[1-9][0-9]{1,3}$/.test(parseInt(minCapacity))) {
          msg.capacity = "Số lượng sản phẩm không hợp lệ";
        }
      }
    });

    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const onReasonChange = (e) => {
    setNote(e.target.value);
  };

  const handleOk = () => {
    const removeCampaign = async () => {
      setIsModalVisible(false);
      setLoading(true);
      const params = {
        id: param.campaignId,
        note: note,
      };
      const result = await campaignsApi.remove(params).catch((err) => {
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
            message: err.response.data.error.message,
            style: { fontSize: 16 },
          });
          setReload(!reload)
        } else {
          notification.error({
            duration: 2,
            message: err.response.data.error.message,
            style: { fontSize: 16 },
          });
          setReload(!reload)
        }
      });
      if (result === "Delete successfully!") {
        notification.success({
          duration: 2,
          message: "Xóa thành công!",
        });
        navigate("/campaigns");
      }
    };
    removeCampaign();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showUpdateConfirm = () => {
    confirm({
      title: "Bạn có muốn cập nhật thông tin cho chiến dịch này?",
      icon: <CheckCircleTwoTone />,
      content:
        "Những thông tin thay đổi sẽ ảnh hưởng đến các nông trại tham gia vào chiến dịch sau này, bạn hãy kiểm tra kĩ nhé.",
      okText: "Tiếp Tục",
      okType: "dashed",
      cancelText: "Hủy",
      onOk() {
        const updateCampaign = async () => {
          let productSales = [];
          productSalesCampaigns.map((product) => {
            const minCapacity = document.getElementById(
              "min" + product.productSystemId
            ).value;
            const maxCapacity = document.getElementById(
              "max" + product.productSystemId
            ).value;
            productSales.push({
              productSystemId: product.productSystemId,
              maxCapacity: maxCapacity,
              minCapacity: minCapacity,
            });
          });
          setLoading(true);
          const mediaURL = [];
          for (let i = 0; i < fileList.length; i++) {
            let url = "";
            if (!fileList[i].hasOwnProperty("originFileObj")) {
              url = fileList[i].url;
            } else {
              url = await upLoadImage(fileList[i].originFileObj);
            }

            mediaURL.push(url);
          }

          const data = {
            id: param.campaignId,
            name: campaignName,
            images: mediaURL,
            description: description,
            // startAt: startAt,
            campaignZoneId: campaignZoneId,
            deliveryZoneId: deliveryZone,
            productSalesCampaigns: productSales,
            type: type,
          };
          console.log(data);
          const result = await campaignsApi
            .updateCampaign(data)
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
                  message: err.response.data.error.message,
                  style: { fontSize: 16 },
                });
                setReload(!reload)
              } else {
                notification.error({
                  duration: 2,
                  message: err.response.data.error.message,
                  style: { fontSize: 16 },
                });
                setReload(!reload)
              }
            });
          if (result === "Update successfully!") {
            notification.success({
              duration: 2,
              message: "Cập nhật thành công!",
            });
            setReload(!reload);
          }
        };
        updateCampaign();
      },
      onCancel() {},
    });
  };

  const openRejecConfirm = () => {
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    const isValid = validateAll();
    if (isValid) {
      showUpdateConfirm();
    }
  };

  return (
    <div className="newCampaign">
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
        <div className="newCampaignTitleWrapper">
          <div className="newCampaignForm">
            <div className="newCampaignTitleWrapper2">
              <h1 className="newCampaignTitle">Cập Nhật Chiến Dịch</h1>
              {loading ? (
                <>
                  <Spin
                    style={{ display: "flex", justifyContent: "center" }}
                    size="large"
                  />{" "}
                  <br /> <br />{" "}
                </>
              ) : (
                <div className="newCampaignFormWrapper">
                  <div className="newCampaignFormInput">
                    <Modal
                      icon={<ExclamationCircleOutlined />}
                      title="Bạn hãy chọn lý do xóa để tiếp tục nhé?"
                      visible={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText="Tiếp Tục"
                      okType="danger"
                      cancelText="Hủy"
                    >
                      <Radio.Group
                        onChange={(e) => onReasonChange(e)}
                        value={note}
                      >
                        <Space direction="vertical">
                          <Radio value={"Sai thông tin"}>Sai thông tin</Radio>
                          <Radio value={"Không có nông trại tham gia"}>
                            Không có nông trại tham gia
                          </Radio>
                          <Radio value={"Khác"}>
                            Khác...
                            {note === "Khác" ? (
                              <Input
                                style={{ width: 100, marginLeft: 10 }}
                                onChange={onReasonChange}
                              />
                            ) : null}
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </Modal>
                    <span className="newCampaignLabel">Tên Chiến Dịch: </span>
                    <Input
                      style={{ width: 500 }}
                      onChange={(e) => setCampaignName(e.target.value)}
                      defaultValue={campaignName}
                    />
                    <span className="newCampaignLabelErr">
                      {validateMsg.campaignName}
                    </span>
                  </div>
                  <br />
                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Hình Ảnh (tối đa 5):{" "}
                    </span>
                    <Upload
                      action={"http://localhost:3000/"}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onImageChange}
                      onPreview={onPreview}
                      beforeUpload={(file) => {
                        return false;
                      }}
                    >
                      {fileList.length < 5 && "+ Upload"}
                    </Upload>
                    <span className="newCampaignLabelErr">
                      {validateMsg.fileList}
                    </span>
                  </div>
                  <br />

                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">Loại Chiến Dịch: </span>
                    <Select
                      style={{ width: 500 }}
                      onChange={(e) => setType(e)}
                      defaultValue={type}
                    >
                      <Option value="Hàng tuần">Hàng Tuần</Option>
                      <Option value="Sự kiện">Sự Kiện</Option>
                    </Select>
                    <span className="newCampaignLabelErr">
                      {validateMsg.type}
                    </span>
                  </div>
                  <br />

                  <div>
                    <span className="newCampaignLabel">
                      Thời Gian Diễn Ra:{" "}
                    </span>
                    <br />
                    <br />
                    <Timeline>
                      <Timeline.Item>
                        Bắt đầu duyệt đơn: {formatDate(startRecruimentAt)}
                      </Timeline.Item>
                      <Timeline.Item>
                        Kết thúc duyệt đơn: {formatDate(endRecruimentAt)}
                      </Timeline.Item>
                      <Timeline.Item color="green">
                        Bắt đầu mở bán: {formatDate(startAt)}
                      </Timeline.Item>
                      <Timeline.Item color="red">
                        Kết thúc chiến dịch: {formatDate(endAt)}
                      </Timeline.Item>
                      <Timeline.Item>
                        Giao hàng dự kiến: {formatDate(expectedDeliveryTime)}
                      </Timeline.Item>
                    </Timeline>
                  </div>
                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Khu Vực Giao Hàng:{" "}
                    </span>
                    <Select
                      mode="tags"
                      placeholder="Chọn khu vực giao hàng"
                      style={{ width: 500 }}
                      onChange={handleDeliveyZoneChange}
                      defaultValue={getListDeliveryZone}
                    >
                      {mapZone.map((zone) => {
                        return (
                          <Option key={zone.id} value={zone.id}>
                            {zone.name}
                          </Option>
                        );
                      })}
                    </Select>
                    <span className="newCampaignLabelErr">
                      {validateMsg.deliveryZone}
                    </span>
                  </div>
                  <br />
                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Khu Vực Nông Trại:{" "}
                    </span>
                    <Select
                      placeholder="Chọn khu vực nông trại"
                      style={{ width: 500 }}
                      onChange={handleFarmZoneChange}
                      defaultValue={campaignZoneId}
                    >
                      {mapZone.map((zone) => {
                        return (
                          <Option key={zone.id} value={zone.id}>
                            {zone.name}
                          </Option>
                        );
                      })}
                    </Select>
                    <span className="newCampaignLabelErr">
                      {validateMsg.farmZone}
                    </span>
                  </div>
                  <br />
                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">Mô tả: </span>
                    <TextArea
                      style={{ width: 500, height: 120 }}
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                    <span className="newCampaignLabelErr">
                      {validateMsg.description}
                    </span>
                  </div>
                  <br />
                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Chọn Loại Sản Phẩm Bày Bán:{" "}
                    </span>
                    <Select
                      mode="tags"
                      placeholder="Chọn loại sản phẩm"
                      style={{ width: 500 }}
                      defaultValue={getListProductInCampaign}
                      onChange={handleProductChange}
                    >
                      {productsSystem.map((product) => {
                        return (
                          <Option key={product.id} value={product.id}>
                            {product.name}
                          </Option>
                        );
                      })}
                    </Select>
                    <span className="newCampaignLabelErr">
                      {validateMsg.productList}
                    </span>
                  </div>
                  <div className="newCampaignFormInput">
                    <List
                      loading={loadingList}
                      itemLayout="horizontal"
                      dataSource={productSalesCampaigns}
                      style={{ width: 500, minHeight: 300 }}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            key={item.productSystemId}
                            title={item.productSystem.name}
                            description={
                              item.productSystem.minPrice +
                              " " +
                              "VNĐ" +
                              " - " +
                              item.productSystem.maxPrice +
                              " " +
                              "VNĐ"
                            }
                          />
                          <div className="newCampaignCapacity">
                            <span>Số lượng ({item.productSystem.unit}): </span>
                            <Input
                              style={{ width: 70, marginLeft: 10 }}
                              id={"min" + item.productSystemId}
                              defaultValue={item.minCapacity}
                            />
                            <span style={{ marginLeft: 10 }}> - </span>
                            <Input
                              style={{ width: 70, marginLeft: 10 }}
                              id={"max" + item.productSystemId}
                              defaultValue={item.maxCapacity}
                            />
                          </div>
                        </List.Item>
                      )}
                    />
                    <span className="newCampaignLabelErr">
                      {validateMsg.capacity}
                    </span>
                  </div>
                  <br />
                  <div className="newCampaignFormInput">
                    <div>
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
                        Cập Nhật
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          width: 150,
                          height: 40,
                          borderRadius: 5,
                          marginBottom: 20,
                          marginLeft: 200,
                        }}
                        danger
                        onClick={() => openRejecConfirm()}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
