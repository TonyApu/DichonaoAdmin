import "./newCampaign.css";
import imag1 from "../../assets/1.jpg";
import {
  Input,
  Select,
  Upload,
  List,
  Button,
  DatePicker,
  Modal,
  message,
  InputNumber,
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
import {
  CheckOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const NewCampaign = () => {
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [productsSystem, setProductsSystem] = useState([]);
  const [farmZone, setFarmZone] = useState("");
  const [deliveryZone, setDeliveryZone] = useState([]);
  const [startAt, setStartAt] = useState("");
  const [productList, setProductList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { Option } = Select;
  
  const [zone, setZone] = useState([]);
  const [endAt, setEndAt] = useState(new Date());
  const [validateMsg, setValidateMsg] = useState("");

  const navigate = useNavigate();
  const { confirm } = Modal;

  useEffect(() => {
    const fetProductSystem = async () => {
      const response = await productSystemApi.getAll();
      setProductsSystem(response);
      console.log(response);
    };

    fetProductSystem();
  }, []);

  useEffect(() => {
    const fetChDeliveryZone = async () => {
      const response = await externalApi.getAll();
      setZone(response);
    };
    fetChDeliveryZone();
  }, []);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const onImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList);
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
    let date = new Date(value);
    setStartAt(date);
    date.setDate(date.getDate() + 7);
    console.log(date);
    setEndAt(date);
  };

  const handleFarmZoneChange = (value) => {
    setFarmZone(value);
  };

  const handleDeliveyZoneChange = (value) => {
    setDeliveryZone(value);
  };

  const formatDate = (value) => {
    console.log(value);
    let dd = value.startAt._d.getDate();
    let mm = value.startAt._d.getMonth() + 1;
    console.log(mm);
    let yyyy = value.startAt._d.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    const date = yyyy + "-" + mm + "-" + dd;
    return date;
  };

  const validateAll = () => {
    const msg = {};
    if (
      !/^[^-\s][a-zA-Z0-9_@./#&+-ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]{1,}$/.test(
        campaignName
      )
    ) {
      msg.campaignName = "Tên chiến dịch không hợp lệ";
    }
    if (validator.isEmpty(description.trim())
    ) {
      msg.description = "Mô tả không hợp lệ";
    }
    if (farmZone === "") {
      msg.farmZone = "Vui lòng chọn khu vực nông trại";
    }
    if (fileList.length === 0) {
      msg.fileList = "Vui lòng chọn ảnh";
    }
    if (startAt === "") {
      msg.startAt = "Vui lòng chọn ngày bắt đầu chiến dịch";
    }
    if (deliveryZone.length === 0) {
      msg.deliveryZone = "Vui lòng chọn khu vực giao hàng";
    }
    if (productList.length === 0) {
      msg.productList = "Vui lòng chọn sản phẩm bày bán trong chiến dịch";
    }
    productList.map(product => {
      if (document.getElementById(product.id).value === "") {
        msg.capacity = "Vui lòng nhập số lượng cho tất cả sản phẩm"
      }
    })

    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const showCreateConfirm = () => {
    confirm({
      title: "Bạn có muốn tạo chiến dịch này?",
      icon: <CheckOutlined />,
      content: "Chiến dịch được tạo sẽ ở trạng thái đang chờ và các nông trại có thể gửi yêu cầu tham gia vào.",
      okText: "Đồng Ý",
      okType: "dashed",
      cancelText: "Hủy",
      async onOk() {
        const createCampaign = async () => {
          const mediaURL = [];
          // await Promise.all(
          //   fileList.map(async (item, index) => {
          //     const url = await upLoadImage(item.originFileObj);
          //     console.log(url);
          //     mediaURL.push(url);
          //   })
          // );
          for (let i = 0; i < fileList.length; i++) {
            const url = await upLoadImage(fileList[i].originFileObj);
            mediaURL.push(url);
          }
          let productSalesCampaigns = [];
          productList.map((product) => {
            const capacity = document.getElementById(product.id).value;
            productSalesCampaigns.push({
              productSystemId: product.id,
              capacity: capacity,
            });
          });
          const data = {
            name: campaignName,
            images: mediaURL,
            description: description,
            startAt: startAt,
            campaignZoneId: farmZone,
            deliveryZoneId: deliveryZone,
            productSalesCampaigns: productSalesCampaigns,
          };
          console.log(data);
          const result = await campaignApi.createCampaign(data).catch((err) => {
            console.log(err);
            message.error({
              duration: 2,
              content: err.response.data.error.message,
            });
          });
          if (result === "Create Successfully") {
            message.success({
              duration: 2,
              content: "Tạo thành công!",
            });
          }
        };
        await createCampaign();
        navigate("/campaigns");
      },
      onCancel() {},
    });
  };

  const handleCampaignNameChange = (e) => {
    setCampaignName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleProductChange = async (e) => {
    let listProduct = [];
    e.map((id) => {
      for (let index = 0; index < productsSystem.length; index++) {
        if (id === productsSystem[index].id) {
          listProduct.push(productsSystem[index])
        }
      }
    })
    setProductList(listProduct);
    console.log(listProduct);
  };

  

  const handleCreate = () => {
    const isValid = validateAll();
    if (isValid) {
      showCreateConfirm();
    }
  };

  return (
    <div className="newCampaign">
      <div className="newCampaignTitleWrapper">
        <div className="newCampaignForm">
          <div className="newCampaignTitleWrapper2">
            <h1 className="newCampaignTitle">Chiến Dịch Mới</h1>
            <div className="newCampaignFormWrapper">
              <div className="newCampaignFormInput">
                <span className="newCampaignLabel">Tên Chiến Dịch: </span>
                <Input
                  style={{ width: 500 }}
                  onChange={(e) => handleCampaignNameChange(e)}
                />
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.campaignName}</span>
              </div>
              <br />
              <div className="newCampaignFormInput">
                <span className="newCampaignLabel">Hình Ảnh (tối đa 5): </span>
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
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.fileList}</span>
              </div>
              <br />
              <div>
                <span className="newCampaignLabel">Thời Gian Diễn Ra: </span>
                <br />
                <DatePicker
                  disabledDate={disabledDate}
                  format="DD-MM-YYYY"
                  onChange={handleStartAtChange}
                  style={{ width: 200 }}
                  placeholder="Chọn ngày bắt đầu"
                />
                <span style={{ marginLeft: 10, marginRight: 10 }}>-</span>
                <DatePicker
                  value={moment(endAt)}
                  format="DD-MM-YYYY"
                  disabled
                  style={{ width: 200 }}
                />
                <br/>
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.startAt}</span>
              </div>
              <br />
              <div className="newCampaignFormInput">
                <span className="newCampaignLabel">Khu Vực Giao Hàng: </span>
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
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.deliveryZone}</span>
              </div>
              <br />
              <div className="newCampaignFormInput">
                <span className="newCampaignLabel">Khu Vực Nông Trại: </span>
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
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.farmZone}</span>
              </div>
              <br />
              <div className="newCampaignFormInput">
                <span className="newCampaignLabel">Mô tả: </span>
                <TextArea
                  style={{ width: 500 }}
                  onChange={(e) => handleDescriptionChange(e)}
                />
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.description}</span>
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
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.productList}</span>
              </div>
              <div className="newCampaignFormInput">
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
                        <InputNumber
                          style={{ width: 100 }}
                          id={item.id}
                          // onChange={(e) => handleChangeCapacity(e, item.id)}
                        />
                      </div>
                    </List.Item>
                  )}
                />
                <span className="newCampaignLabel" style={{ color: "red" }}>{validateMsg.capacity}</span>
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
      </div>
    </div>
  );
};

export default NewCampaign;
