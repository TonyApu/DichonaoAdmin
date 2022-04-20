import "./newCampaign.css";
import {
  Input,
  Select,
  Upload,
  List,
  Button,
  DatePicker,
  Modal,
  message,
  Timeline,
  notification,
  Result,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import externalApi from "../../apis/externalApi";
import campaignApi from "../../apis//campaignsApi";
import { storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import validator from "validator";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import productSystemApi from "../../apis/productSystemApi";
import { CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const NewCampaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [productsSystem, setProductsSystem] = useState([]);
  const [farmZone, setFarmZone] = useState("");
  const [type, setType] = useState("");
  const [deliveryZone, setDeliveryZone] = useState([]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [startRecruimentAt, setStartRecruimentAt] = useState("");
  const [endRecruimentAt, setEndRecruimentAt] = useState("");
  const [startSellingAt, setStartSellingAt] = useState("");
  const [productList, setProductList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { Option } = Select;
  const [zone, setZone] = useState([]);
  const [validateMsg, setValidateMsg] = useState("");
  const [loadErr, setloadErr] = useState(false);
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { confirm } = Modal;

  useEffect(() => {
    const fetProductSystem = async () => {
      setProductList([]);
      setLoading(true);
      setloadErr(false);
      await productSystemApi
        .getAll()
        .then((response) => {
          setProductsSystem(response);
          setLoading(false);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            notification.error({
              duration: 2,
              message: "Mất kết nối mạng!",
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
    fetProductSystem();
  }, [reload]);

  useEffect(() => {
    const fetChDeliveryZone = async () => {
      setLoading(true);
      setloadErr(false);
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
    fetChDeliveryZone();
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
    try {
      const storageRef = ref(storage, `/Images/Campaign/${imageAsFile.name}`);
      const upLoadTask = uploadBytesResumable(storageRef, imageAsFile);
      const url = await getDownloadURL(upLoadTask.snapshot.ref);
      if (url) {
        return url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  const handleStartAtChange = (value) => {
    if (value === null) {
      setStartAt("");
    } else {
      let start = new Date(value);
      setStartAt(start);
    }
  };

  const handleStartRecruimentAtChange = (value) => {
    if (value === null) {
      setStartRecruimentAt("");
    } else {
      let start = new Date(value);
      setStartRecruimentAt(start);
    }
  };

  const handleEndRecruimentAtChange = (value) => {
    if (value === null) {
      setEndRecruimentAt("");
    } else {
      let start = new Date(value);
      setEndRecruimentAt(start);
      let startSelling = new Date(value);
      startSelling.setDate(startSelling.getDate() + 1);
      setStartSellingAt(startSelling);
    }
  };

  const handleEndAtChange = (value) => {
    if (value === null) {
      setEndAt("");
    } else {
      let date = new Date(value);
      setEndAt(date);
    }
  };

  const handleFarmZoneChange = (value) => {
    setFarmZone(value);
  };

  const handleDeliveyZoneChange = (value) => {
    setDeliveryZone(value);
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

  const handleTypeChange = (e) => {
    setType(e);
    if (startAt !== "") {
      let date = new Date(startAt);
      date.setDate(startAt.getDate() + 7);
      setEndAt(date);
    }
  };

  const handleProductChange = async (e) => {
    let listProduct = [];
    e.map((id) => {
      for (let index = 0; index < productsSystem.length; index++) {
        if (id === productsSystem[index].id) {
          listProduct.push(productsSystem[index]);
        }
      }
    });
    setProductList(listProduct);
  };

  const validateAll = () => {
    const msg = {};
    if (validator.isEmpty(campaignName.trim())) {
      msg.campaignName = "Tên chiến dịch không hợp lệ";
    }
    if (validator.isEmpty(description.trim())) {
      msg.description = "Mô tả không hợp lệ";
    }
    if (farmZone === "") {
      msg.farmZone = "Vui lòng chọn mục này";
    }
    if (fileList.length === 0) {
      msg.fileList = "Vui lòng chọn chọn mục này";
    }
    if (
      startAt === "" ||
      endAt === "" ||
      startRecruimentAt === "" ||
      endRecruimentAt === ""
    ) {
      msg.startAt = "Vui lòng chọn đủ các mốc thời gian của chiến dịch";
    }
    // if (startAt !== "" && endAt !== "") {
    //   let start = new Date(startAt).getTime();
    //   let end = new Date(endAt).getTime();
    //   let dayDiff = parseInt((end-start)/(24*3600*1000))
    //   console.log(dayDiff);
    //   if (dayDiff < 7 || dayDiff > 10) {
    //     msg.startAt = "Thời gian chiến dịch phải từ 7-10 ngày";
    //   }
    // }
    if (
      startAt !== "" &&
      endAt !== "" &&
      startRecruimentAt !== "" &&
      endRecruimentAt !== ""
    ) {
      let start = new Date(startAt).getTime();
      let end = new Date(endAt).getTime();
      let startRecruiment = new Date(startRecruimentAt).getTime();
      let startSelling = new Date(startSellingAt).getTime();
      let endRecruiment = new Date(endRecruimentAt).getTime();
      let dayDiff1 = parseInt((startRecruiment-start)/(24*3600*1000));
      let dayDiff2 = parseInt((endRecruiment-startRecruiment)/(24*3600*1000));
      let dayDiff3 = parseInt((end-startSelling)/(24*3600*1000)); 
      if (
        (startRecruiment < start) || (dayDiff2 < 1) || (dayDiff3 < 1)
      ) {
        msg.startAt = "Trình tự các mốc thời gian không đúng";
      }
    }
    if (type === "") {
      msg.type = "Vui lòng chọn mục này";
    }
    if (deliveryZone.length === 0) {
      msg.deliveryZone = "Vui lòng chọn mục này";
    }
    if (productList.length === 0) {
      msg.productList = "Vui lòng chọn mục này";
    }
    productList.map((product) => {
      let maxCapacity = document.getElementById("max" + product.id).value;
      let minCapacity = document.getElementById("min" + product.id).value;

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

  const showCreateConfirm = () => {
    confirm({
      title: "Bạn có muốn tạo chiến dịch này?",
      icon: <CheckOutlined />,
      content:
        "Chiến dịch được tạo sẽ ở trạng thái đang chờ và các nông trại có thể gửi yêu cầu tham gia vào.",
      okText: "Đồng Ý",
      okType: "dashed",
      cancelText: "Hủy",
      onOk() {
        const createCampaign = async () => {
          let productSalesCampaigns = [];
          productList.map((product) => {
            let minCapacity = "";
            let maxCapacity = "";
            if (document.getElementById("min" + product.id) !== null) {
              minCapacity = document.getElementById("min" + product.id).value;
            }
            if (document.getElementById("max" + product.id) !== null) {
              maxCapacity = document.getElementById("max" + product.id).value;
            }
            productSalesCampaigns.push({
              productSystemId: product.id,
              minCapacity: minCapacity,
              capacity: maxCapacity,
            });
          });
          setLoading(true);
          const mediaURL = [];
          for (let i = 0; i < fileList.length; i++) {
            const url = await upLoadImage(fileList[i].originFileObj);
            mediaURL.push(url);
          }

          const data = {
            name: campaignName,
            images: mediaURL,
            description: description,
            type: type,
            startAt: startAt,
            endAt: endAt,
            startRecruitmentAt: startRecruimentAt,
            endRecruitmentAt: endRecruimentAt,
            campaignZoneId: farmZone,
            deliveryZoneId: deliveryZone,
            productSalesCampaigns: productSalesCampaigns,
          };
          console.log(data);

          const result = await campaignApi.createCampaign(data).catch((err) => {
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
            } else {
              notification.error({
                duration: 2,
                message: err.response.data.error.message,
                style: { fontSize: 16 },
              });
            }
          });
          if (result === "Create Successfully") {
            notification.success({
              duration: 2,
              message: "Tạo thành công!",
              style: { fontSize: 16 },
            });
            setLoading(false);
            navigate("/campaigns");
          }
        };
        createCampaign();
      },
      onCancel() {},
    });
  };

  const handleCreate = () => {
    const isValid = validateAll();
    if (isValid) {
      showCreateConfirm();
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
            <div className="newCampaignForm">
              <div className="newCampaignTitleWrapper2">
                <h1 className="newCampaignTitle">Chiến Dịch Mới</h1>
                <div className="newCampaignFormWrapper">
                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">Tên Chiến Dịch: </span>
                    <Input
                      style={{ width: 500 }}
                      onChange={(e) => setCampaignName(e.target.value)}
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
                      onChange={(e) => handleTypeChange(e)}
                    >
                      <Option value="Hàng tuần">Hàng Tuần</Option>
                      <Option value="Sự kiện">Sự Kiện</Option>
                    </Select>
                    <span className="newCampaignLabelErr">
                      {validateMsg.type}
                    </span>
                  </div>
                  <br />

                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Thời Gian Diễn Ra:{" "}
                    </span>

                    <div>
                      <div style={{ display: "inline-block" }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          onChange={handleStartAtChange}
                          style={{ width: 200 }}
                          placeholder="Ngày khởi tạo"
                        />
                      </div>

                      <div style={{ display: "inline-block", marginLeft: 100 }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          onChange={handleStartRecruimentAtChange}
                          style={{ width: 200 }}
                          placeholder="Bắt đầu duyệt đơn"
                        />
                      </div>
                    </div>
                    <br />
                    <div>
                      <div style={{ display: "inline-block" }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          onChange={handleEndRecruimentAtChange}
                          style={{ width: 200 }}
                          placeholder="Kết thúc duyệt đơn"
                        />
                      </div>

                      <div style={{ display: "inline-block", marginLeft: 100 }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          onChange={handleEndAtChange}
                          style={{ width: 200 }}
                          placeholder="Ngày kết thúc"
                        />
                      </div>
                    </div>

                    <span className="newCampaignLabelErr">
                      {validateMsg.startAt}
                    </span>
                  </div>
                  <br />

                  {startAt !== "" &&
                  endAt !== "" &&
                  startRecruimentAt !== "" &&
                  endRecruimentAt !== "" ? (
                    <Timeline>
                      <Timeline.Item color="grey">
                        Bắt Đầu Chiến Dịch: {formatDate(startAt)}
                      </Timeline.Item>
                      <Timeline.Item>
                        Mở duyệt đơn: {formatDate(startRecruimentAt)}
                      </Timeline.Item>
                      <Timeline.Item>
                        Kết thúc duyệt đơn: {formatDate(endRecruimentAt)}
                      </Timeline.Item>
                      <Timeline.Item color="green">
                        Bắt đầu mở bán: {formatDate(startSellingAt)}
                      </Timeline.Item>
                      <Timeline.Item color="red">
                        Kết thúc chiến dịch: {formatDate(endAt)}
                      </Timeline.Item>
                    </Timeline>
                  ) : null}

                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Khu Vực Giao Hàng:{" "}
                    </span>
                    <Select
                      mode="tags"
                      placeholder="Chọn khu vực giao hàng"
                      style={{ width: 500 }}
                      onChange={handleDeliveyZoneChange}
                    >
                      {zone.map((zone) => {
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
                    >
                      {zone.map((zone) => {
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
                      style={{ width: 500 }}
                      onChange={(e) => setDescription(e.target.value)}
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
                      onChange={(e) => handleProductChange(e)}
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
                    {productList.length !== 0 ? (
                      <List
                        itemLayout="horizontal"
                        dataSource={productList}
                        style={{ width: 500 }}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={item.name}
                              description={
                                item.minPrice +
                                " " +
                                "VNĐ" +
                                " - " +
                                item.maxPrice +
                                " " +
                                "VNĐ"
                              }
                            />
                            <div className="newCampaignCapacity">
                              <span>Số lượng ({item.unit}): </span>
                              <Input
                                style={{ width: 70, marginLeft: 10 }}
                                id={"min" + item.id}
                              />
                              <span style={{ marginLeft: 10 }}> - </span>
                              <Input
                                style={{ width: 70, marginLeft: 10 }}
                                id={"max" + item.id}
                              />
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : null}

                    <span className="newCampaignLabelErr">
                      {validateMsg.capacity}
                    </span>
                  </div>
                  <br />

                  <div className="newCampaignFormInput">
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
};

export default NewCampaign;
