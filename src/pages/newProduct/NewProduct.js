import "./newProduct.css";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  InputNumber,
  Modal,
  message,
  notification,
  Result,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import productSystemApi from "../../apis/productSystemApi";
import productCategoriesApi from "../../apis/productCategoriesApi";
import { useNavigate } from "react-router-dom";
import { CheckOutlined } from "@ant-design/icons";

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [province, setProvince] = useState("");
  const [productCategoryId, setProductCategoryId] = useState(0);
  const [validateMsg, setValidateMsg] = useState("");
  const [loading, setLoading] = useState("");
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);
  const { Option } = Select;
  const { confirm } = Modal;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setloadErr(false);
      setLoading(true);
      const params = {
        page: 1,
        size: 10,
      };
      await productCategoriesApi
        .getAll(params)
        .then((response) => {
          setCategories(response.data);
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
    fetchCategories();
  }, [flag]);

  const onChangeUnit = (e) => {
    setUnit(e);
  };

  const onChangProvince = (e) => {
    setProvince(e);
  };

  const onChangeCatagory = (e) => {
    setProductCategoryId(e);
  };

  const showCreateConfirm = () => {
    confirm({
      title: "Bạn có muốn tạo sản phẩm này?",
      icon: <CheckOutlined />,
      content:
        "Sản phẩm sau khi tạo có thể được các chủ nông trại thêm vào mùa vụ của mình",
      okText: "Tiếp tục",
      okType: "dashed",
      cancelText: "Hủy",
      onOk() {
        const createProduct = async () => {
          const params = {
            name: productName,
            minPrice: minPrice,
            maxPrice: maxPrice,
            unit: unit,
            productCategoryId: productCategoryId,
            province: province,
          };
          setLoading(true);
          const result = await productSystemApi.addNew(params).catch((err) => {
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
              setFlag(!flag);
            }
          });
          if (result === "Create successfully!") {
            notification.success({
              duration: 2,
              message: "Tạo thành công!",
              style: { fontSize: 16 },
            });
            setLoading(false);
            navigate("/products");
          }
        };
        createProduct();
      },
      onCancel() {},
    });
  };

  const validateAll = () => {
    let msg = {};
    if (
      !/^[^-\s][a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/.test(
        productName
      )
    ) {
      msg.productName = "Tên sản phẩm không hợp lệ.";
    }
    if (!/^[1-9][0-9]{2,8}$/.test(parseInt(minPrice))) {
      msg.minPrice = "Giá tối thiểu không hợp lệ.";
    }
    if (!/^[1-9][0-9]{2,8}$/.test(parseInt(maxPrice))) {
      msg.maxPrice = "Giá tối đa không hợp lệ.";
    } else if (maxPrice < minPrice) {
      msg.maxPrice = "Giá tối đa phải lớn hơn.";
    }
    if (productCategoryId === 0) {
      msg.productCategoryId = "Vui lòng chọn mục này";
    }
    if (unit === "") {
      msg.unit = "Vui lòng chọn mục này";
    }
    if (province === "") {
      msg.province = "Vui lòng chọn mục này";
    }
    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const handleCreate = () => {
    const isValid = validateAll();
    if (isValid) {
      showCreateConfirm();
    }
  };

  return (
    <div className="productDetail">
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
        <div className="productDetailTitleWrapper">
          <div className="productDetailForm">
            <div className="productDetailTitleWrapper2">
              <h1 className="productDetailTitle">Tạo Sản Phẩm Mới</h1>
              {loading ? (
                <>
                  <Spin  
                    style={{ display: "flex", justifyContent: "center" }}
                    size="large"
                  />{" "}
                  <br /> <br />{" "}
                </>
              ) : (
                <div className="productDetailFormWrapper">
                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Tên sản phẩm: </span>
                    <Input
                      style={{ width: 500 }}
                      onChange={(e) => {
                        setProductName(e.target.value);
                      }}
                    />
                    <span
                      className="newProductLabelErr"
                      
                    >
                      {validateMsg.productName}
                    </span>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Xuất Sứ: </span>
                    <Select style={{ width: 500 }} onChange={onChangProvince}>
                      <Option value="Đồng Nai">Đồng Nai</Option>
                    </Select>
                    <span
                      className="newProductLabelErr"
                      
                    >
                      {validateMsg.province}
                    </span>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Khoảng Giá: </span>
                    <div>
                      <div style={{ display: "inline-block" }}>
                        <Input
                          style={{ width: 200 }}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{ color: "red", width: 200, fontSize: 14 }}
                        >
                          {validateMsg.minPrice}
                        </span>
                      </div>
                      <div style={{ display: "inline-block" }}>
                        <span style={{ marginLeft: 20, marginRight: 20 }}>
                          {" "}
                          -{" "}
                        </span>
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{ color: "red", width: 200, marginLeft: 20 }}
                        >
                          {null}
                        </span>
                      </div>

                      <div style={{ display: "inline-block" }}>
                        <Input
                          style={{ width: 200 }}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{fontSize: 14, color: "red"}}
                        >
                          {validateMsg.maxPrice}
                        </span>
                      </div>

                      <div style={{ display: "inline-block" }}>
                        <Input
                          value="VNĐ"
                          style={{ marginLeft: 10, width: 50 }}
                        />
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{ color: "red", marginLeft: 20 }}
                        >
                          {null}
                        </span>
                      </div>
                    </div>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Đơn vị: </span>
                    <Select style={{ width: 500 }} onChange={onChangeUnit}>
                      <Option value="Kg">Kg</Option>
                    </Select>
                    <span
                      className="productDetailLabel"
                      style={{fontSize: 14, color: "red"}}
                    >
                      {validateMsg.unit}
                    </span>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Loại</span>
                    <Select style={{ width: 500 }} onChange={onChangeCatagory}>
                      {categories.map((category) => {
                        return (
                          <Option value={category.id}>{category.name}</Option>
                        );
                      })}
                    </Select>
                    <span
                      className="newProductLabelErr"
                      
                    >
                      {validateMsg.productCategoryId}
                    </span>
                  </div>
                  <br />

                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: 150, height: 40, borderRadius: 5 }}
                    onClick={() => handleCreate()}
                  >
                    Tạo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
