import "./productDetail.css";
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
  notification,
  Result,
} from "antd";
import { useEffect, useState } from "react";
import productSystemApi from "../../apis/productSystemApi";
import productCategoriesApi from "../../apis/productCategoriesApi";
import { useParams } from "react-router-dom";
import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [productCategoryId, setProductCategoryId] = useState(0);
  const [validateMsg, setValidateMsg] = useState("");
  const [loadErr, setloadErr] = useState(false);
  const [flag, setFlag] = useState(true);
  const navigate = useNavigate();

  const param = useParams();
  const { Option } = Select;
  const { confirm } = Modal;

  useEffect(() => {
    const fetchCategories = async () => {
      const params = {
        page: 1,
        size: 10,
      };
      setLoading(true);
      setloadErr(false);
      await productCategoriesApi.getAll(params).then((response) => {
        setCategories(response.data);
      }).catch((err) => {
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
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const id = param.productId;
      setLoading(true);
      setloadErr(false);
      await productSystemApi
        .get(id)
        .then((response) => {
          setProduct(response);
          setProductName(response.name);
          setMinPrice(response.minPrice);
          setMaxPrice(response.maxPrice);
          setUnit(response.unit);
          setProductCategoryId(response.productCategoryId);
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
    fetchProduct();
  }, [flag]);

  const showUpdateConfirm = () => {
    confirm({
      title: "Bạn có muốn cập nhật sản phẩm này?",
      icon: <CheckCircleTwoTone />,
      content:
        "Những thay đổi sẽ chỉ áp dụng lên những sản phẩm được tạo sau khi cập nhật!",
      okText: "Tiếp Tục",
      okType: "ghost",
      cancelText: "Hủy",
      onOk() {
        const updateProduct = async () => {
          const params = {
            id: product.id,
            name: productName,
            minPrice: parseInt(minPrice),
            maxPrice: parseInt(maxPrice),
            unit: unit,
            productCategoryId: productCategoryId,
            province: "Đà Lạt",
          };
          console.log(params);
          const result = await productSystemApi.update(params).catch((err) => {
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
          if (result === "Update successfully!") {
            notification.success({
              duration: 2,
              message: "Cập nhật thành công!",
              style: { fontSize: 16 },
            });
            setFlag(!flag);
          }
        };
        updateProduct();
      },
      onCancel() {},
    });
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có muốn xóa sản phẩm này?",
      icon: <ExclamationCircleOutlined />,
      content: "Sau khi xóa sẽ không thể khôi phục!",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        const deleteProduct = async () => {
          const result = await productSystemApi
            .delete(product.id)
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
          if (result === "Delete successfully!") {
            notification.success({
              duration: 2,
              content: "Xóa thành công!",
              style: { fontSize: 16 }
            });
            navigate("/products");
          }
        };
        await deleteProduct();
        
      },
      onCancel() {},
    });
  };

  const onChangeUnit = (e) => {
    setUnit(e);
  };

  const onChangeCatagory = (e) => {
    console.log(e);
    setProductCategoryId(e);
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

    setValidateMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const handleUpdate = () => {
    const isValid = validateAll();
    if (isValid) {
      showUpdateConfirm();
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
              <h1 className="productDetailTitle">Thông Tin Sản Phẩm</h1>

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
                      defaultValue={product.name}
                      style={{ width: 500 }}
                      onChange={(e) => {
                        setProductName(e.target.value);
                      }}
                    />
                    <span
                      className="productDetailLabel"
                      style={{ color: "red" }}
                    >
                      {validateMsg.productName}
                    </span>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Xuất Sứ: </span>
                    <Input value={product.province} style={{ width: 500 }} />
                  </div>
                  <br />
                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Khoảng Giá: </span>
                    <div>
                      <div style={{ display: "inline-block" }}>
                        <Input
                          defaultValue={product.minPrice.toLocaleString()}
                          style={{ width: 200 }}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{ color: "red", width: 200 }}
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
                          defaultValue={product.maxPrice.toLocaleString()}
                          style={{ width: 200 }}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{ color: "red" }}
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
                    <Select
                      defaultValue={product.unit}
                      style={{ width: 500 }}
                      onChange={onChangeUnit}
                    >
                      <Option value="Kg">Kg</Option>
                    </Select>
                  </div>
                  <br />
                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Loại</span>
                    <Select
                      defaultValue={product.productCategoryId}
                      style={{ width: 500 }}
                      onChange={onChangeCatagory}
                    >
                      {categories.map((category) => {
                        return (
                          <Option value={category.id}>{category.name}</Option>
                        );
                      })}
                    </Select>
                  </div>
                  <br />
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
                      marginBottom: 20,
                      marginLeft: 200,
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
      )}
    </div>
  );
}
