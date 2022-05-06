import "./newCampaign.css";
import {
  Input,
  Select,
  Upload,
  List,
  Button,
  DatePicker,
  Modal,
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
import { CheckCircleTwoTone } from "@ant-design/icons";
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
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("");
  const [productList, setProductList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { Option } = Select;
  const [zone1, setZone1] = useState([]);
  const [zone2, setZone2] = useState([]);
  const [loadErr, setloadErr] = useState(false);
  const [campaignNameErr, setCampaignNameErr] = useState("");
  const [imageErr, setImageErr] = useState("");
  const [timelineErr, setTimelineErr] = useState("");
  const [farmZoneErr, setFarmZoneErr] = useState("");
  const [deliveryZoneErr, setDeliveryZoneErr] = useState("");
  const [typeErr, setTypeErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [productListErr, setProductListErr] = useState("");
  const [capacityErr, setCapacityErr] = useState("");
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
    fetProductSystem();
  }, [reload]);

  useEffect(() => {
    const fetChDeliveryZone = async () => {
      setLoading(true);
      setloadErr(false);
      await externalApi
        .getDeliveryZone()
        .then((response) => {
          setZone1(response);
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
    fetChDeliveryZone();
  }, [reload]);

  useEffect(() => {
    const fetCampaignZone = async () => {
      setLoading(true);
      setloadErr(false);
      await externalApi
        .getCampaignZone()
        .then((response) => {
          setZone2(response);
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
    fetCampaignZone();
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
    } catch (error) {}

    return firebaseUrl;
  };

  const disabledDate = (current) => {
    return current < moment().startOf("day");
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
    }
  };

  const handleEndAtChange = (value) => {
    if (value === null) {
      setEndAt("");
    } else {
      let date = new Date(value);
      setEndAt(date);
      let deliveryTime = new Date(value);
      deliveryTime.setDate(deliveryTime.getDate() + 2);
      setExpectedDeliveryTime(deliveryTime);
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
    console.log(e);
    setType(e);
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

  const checkInvalidCampaignName = () => {
    if (validator.isEmpty(campaignName.trim())) {
      setCampaignNameErr("Tên chiến dịch không hợp lệ");
    } else {
      setCampaignNameErr("");
    }
  };

  const checkInvalidImage = () => {
    if (fileList.length === 0) {
      setImageErr("Vui lòng chọn mục này");
    } else {
      setImageErr("");
    }
  };

  const checkInvalidType = () => {
    if (type === "") {
      setTypeErr("Vui lòng chọn mục này");
    } else {
      setTypeErr("");
    }
  };

  const checkTimelineErr = () => {
    if (
      startAt === "" ||
      endAt === "" ||
      startRecruimentAt === "" ||
      endRecruimentAt === ""
    ) {
      setTimelineErr("Vui lòng chọn đủ các mốc thời gian của chiến dịch");
    } else {
      setTimelineErr("");
    }

    if (
      startAt !== "" &&
      endAt !== "" &&
      startRecruimentAt !== "" &&
      endRecruimentAt !== ""
    ) {
      let start = new Date(startAt).getTime();
      let end = new Date(endAt).getTime();
      let startRecruiment = new Date(startRecruimentAt).getTime();
      let endRecruiment = new Date(endRecruimentAt).getTime();
      let dayDiff1 = parseInt(
        (endRecruiment - startRecruiment) / (24 * 3600 * 1000)
      );
      let dayDiff2 = parseInt((start - endRecruiment) / (24 * 3600 * 1000));
      let dayDiff3 = parseInt((end - start) / (24 * 3600 * 1000));
      if (dayDiff1 < 1 || dayDiff2 < 1 || dayDiff3 < 1) {
        setTimelineErr("Trình tự các mốc thời gian không đúng");
      } else {
        setTimelineErr("");
      }
    }
  };

  const checkInvalidFarmZone = () => {
    if (farmZone === "") {
      setFarmZoneErr("Vui lòng chọn mục này");
    } else {
      setFarmZoneErr("");
    }
  };

  const checkInvalidDeliveryZone = () => {
    if (deliveryZone.length === 0) {
      setDeliveryZoneErr("Vui lòng chọn mục này");
    } else {
      setDeliveryZoneErr("");
    }
  };

  const checkInvalidDescription = () => {
    if (validator.isEmpty(description.trim())) {
      setDescriptionErr("Vui lòng chọn mục này");
    } else {
      setDescriptionErr("");
    }
  };

  const checkInvalidProductList = () => {
    if (productList.length === 0) {
      setProductListErr("Vui lòng chọn mục này");
    } else {
      setProductListErr("");
    }
  };

  const checkInvalidCapacity = () => {
    productList.map((product) => {
      let maxCapacity = document.getElementById("max" + product.id).value;
      let minCapacity = document.getElementById("min" + product.id).value;

      if (maxCapacity !== "" && minCapacity !== "") {
        if (parseInt(maxCapacity) <= parseInt(minCapacity)) {
          setCapacityErr("Số tối đa phải lớn hơn tối thiểu");
        } else {
          setCapacityErr("");
        }
      } else {
        if (!/^[1-9][0-9]{1,3}$/.test(parseInt(maxCapacity))) {
          setCapacityErr("Số lượng sản phẩm không hợp lệ");
        } else {
          setCapacityErr("");
        }
        if (!/^[1-9][0-9]{1,3}$/.test(parseInt(minCapacity))) {
          setCapacityErr("Số lượng sản phẩm không hợp lệ");
        }
        setCapacityErr("");
      }
    });
  };

  const validateAll = () => {
    let error = 0;
    if (validator.isEmpty(campaignName.trim())) {
      setCampaignNameErr("Tên chiến dịch không hợp lệ");
      error++;
    } else {
      setCampaignNameErr("");
    }

    if (validator.isEmpty(description.trim())) {
      setDescriptionErr("Vui lòng chọn mục này");
      error++;
    } else {
      setDescriptionErr("");
    }

    if (farmZone === "") {
      setFarmZoneErr("Vui lòng chọn mục này");
      error++;
    } else {
      setFarmZoneErr("");
    }

    if (fileList.length === 0) {
      setImageErr("Vui lòng chọn mục này");
      error++;
    } else {
      setImageErr("");
    }

    if (
      startAt === "" ||
      endAt === "" ||
      startRecruimentAt === "" ||
      endRecruimentAt === ""
    ) {
      setTimelineErr("Vui lòng chọn đủ các mốc thời gian của chiến dịch");
      error++;
    } else {
      setTimelineErr("");
    }

    if (
      startAt !== "" &&
      endAt !== "" &&
      startRecruimentAt !== "" &&
      endRecruimentAt !== ""
    ) {
      let start = new Date(startAt).getTime();
      let end = new Date(endAt).getTime();
      let startRecruiment = new Date(startRecruimentAt).getTime();
      let endRecruiment = new Date(endRecruimentAt).getTime();
      let dayDiff1 = parseInt(
        (endRecruiment - startRecruiment) / (24 * 3600 * 1000)
      );
      let dayDiff2 = parseInt((start - endRecruiment) / (24 * 3600 * 1000));
      let dayDiff3 = parseInt((end - start) / (24 * 3600 * 1000));
      if (dayDiff1 < 1 || dayDiff2 < 1 || dayDiff3 < 1) {
        setTimelineErr("Trình tự các mốc thời gian không đúng");
        error++;
      } else {
        setTimelineErr("");
      }
    }

    if (type === "") {
      setTypeErr("Vui lòng chọn mục này");
      error++;
    } else {
      setTypeErr("");
    }

    if (deliveryZone.length === 0) {
      setDeliveryZoneErr("Vui lòng chọn mục này");
    } else {
      setDeliveryZoneErr("");
    }

    if (productList.length === 0) {
      setProductListErr("Vui lòng chọn mục này");
      error++;
    } else {
      setProductListErr("");
    }

    productList.map((product) => {
      let maxCapacity = document.getElementById("max" + product.id).value;
      let minCapacity = document.getElementById("min" + product.id).value;

      if (maxCapacity !== "" && minCapacity !== "") {
        if (parseInt(maxCapacity) <= parseInt(minCapacity)) {
          setCapacityErr("Số tối đa phải lớn hơn tối thiểu");
          error++;
        } else {
          setCapacityErr("");
        }
      } else {
        if (!/^[1-9][0-9]{1,3}$/.test(parseInt(maxCapacity))) {
          setCapacityErr("Số lượng sản phẩm không hợp lệ");
          error++;
        } else {
          setCapacityErr("");
        }
        if (!/^[1-9][0-9]{1,3}$/.test(parseInt(minCapacity))) {
          setCapacityErr("Số lượng sản phẩm không hợp lệ");
          error++;
        } else {
          setCapacityErr("");
        }
      }
    });

    if (error > 0) return false;
    return true;
  };

  const showCreateConfirm = () => {
    confirm({
      title: "Bạn có muốn tạo chiến dịch này?",
      icon: <CheckCircleTwoTone />,
      content:
        "Chiến dịch được tạo sẽ ở trạng thái sắp mở bán và các nông trại có thể gửi yêu cầu tham gia vào.",
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
              maxCapacity: maxCapacity,
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
              setReload(!reload);
            } else {
              notification.error({
                duration: 2,
                message: err.response.data.error.message,
                style: { fontSize: 16 },
              });
              setReload(!reload);
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
                      onBlur={checkInvalidCampaignName}
                    />
                    <span className="newCampaignLabelErr">
                      {campaignNameErr}
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
                      onBlur={checkInvalidImage}
                    >
                      {fileList.length < 5 && "+ Upload"}
                    </Upload>
                    <span className="newCampaignLabelErr">{imageErr}</span>
                  </div>
                  <br />

                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">Loại Chiến Dịch: </span>
                    <Select
                      style={{ width: 500 }}
                      onChange={(e) => handleTypeChange(e)}
                      onBlur={checkInvalidType}
                    >
                      <Option value="Hàng tuần">Hàng Tuần</Option>
                      <Option value="Sự kiện">Sự Kiện</Option>
                    </Select>
                    <span className="newCampaignLabelErr">{typeErr}</span>
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
                          onChange={handleStartRecruimentAtChange}
                          style={{ width: 200 }}
                          placeholder="Bắt đầu duyệt đơn"
                          onBlur={checkTimelineErr}
                        />
                      </div>

                      <div style={{ display: "inline-block", marginLeft: 100 }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          onChange={handleEndRecruimentAtChange}
                          style={{ width: 200 }}
                          placeholder="Kết thúc duyệt đơn"
                          onBlur={checkTimelineErr}
                        />
                      </div>
                    </div>
                    <br />
                    <div>
                      <div style={{ display: "inline-block" }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          onChange={handleStartAtChange}
                          style={{ width: 200 }}
                          placeholder="Ngày mở bán"
                          onBlur={checkTimelineErr}
                        />
                      </div>

                      <div style={{ display: "inline-block", marginLeft: 100 }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          onChange={handleEndAtChange}
                          style={{ width: 200 }}
                          placeholder="Ngày kết thúc"
                          onBlur={checkTimelineErr}
                        />
                      </div>
                    </div>

                    <span className="newCampaignLabelErr">{timelineErr}</span>
                  </div>
                  <br />

                  {startAt !== "" &&
                  endAt !== "" &&
                  startRecruimentAt !== "" &&
                  endRecruimentAt !== "" ? (
                    <Timeline>
                      <Timeline.Item color="grey">
                        Ngày khởi tạo: {formatDate(new Date())}
                      </Timeline.Item>
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
                  ) : null}

                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Khu Vực Nông Trại:{" "}
                    </span>
                    <Select
                      placeholder="Chọn khu vực nông trại"
                      style={{ width: 500 }}
                      onChange={handleFarmZoneChange}
                      onBlur={checkInvalidFarmZone}
                    >
                      {zone2.map((zone) => {
                        return (
                          <Option key={zone.id} value={zone.id}>
                            {zone.name}
                          </Option>
                        );
                      })}
                    </Select>
                    <span className="newCampaignLabelErr">{farmZoneErr}</span>
                  </div>
                  <br />

                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">
                      Khu Vực Giao Hàng:{" "}
                    </span>
                    <Select
                      mode="tags"
                      placeholder="Chọn khu vực giao hàng"
                      style={{ width: 500 }}
                      onChange={handleDeliveyZoneChange}
                      onBlur={checkInvalidDeliveryZone}
                    >
                      {zone1.map((zone) => {
                        return (
                          <Option key={zone.id} value={zone.id}>
                            {zone.name}
                          </Option>
                        );
                      })}
                    </Select>
                    <span className="newCampaignLabelErr">
                      {deliveryZoneErr}
                    </span>
                  </div>
                  <br />

                  <div className="newCampaignFormInput">
                    <span className="newCampaignLabel">Mô tả: </span>
                    <TextArea
                      style={{ width: 500, height: 120 }}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={checkInvalidDescription}
                    />
                    <span className="newCampaignLabelErr">
                      {descriptionErr}
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
                      onBlur={checkInvalidProductList}
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
                      {productListErr}
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
                                item.minPrice.toLocaleString() +
                                " " +
                                "VNĐ" +
                                " - " +
                                item.maxPrice.toLocaleString() +
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

                    <span className="newCampaignLabelErr">{capacityErr}</span>
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
