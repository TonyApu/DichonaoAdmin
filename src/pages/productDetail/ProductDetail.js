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
} from "antd";
import { useEffect, useState } from "react";
import productSystemApi from "../../apis/productSystemApi";
import productCategoriesApi from "../../apis/productCategoriesApi";
import { useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
      const response = await productCategoriesApi.getAll(params);
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const id = param.productId;
      const response = await productSystemApi.get(id);
      console.log(response);
      setProduct(response);
      setProductName(response.name);
      setMinPrice(response.minPrice);
      setMaxPrice(response.maxPrice);
      setUnit(response.unit);
      setProductCategoryId(response.productCategoryId);
      setLoading(false);
    };
    fetchProduct();
  }, [loading]);

  const showUpdateConfirm = () => {
    confirm({
      title: "Bạn có muốn cập nhật sản phẩm này?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Những thay đổi sẽ chỉ áp dụng lên những sản phẩm được tạo sau khi cập nhật!",
      okText: "Cập Nhật",
      okType: "ghost",
      cancelText: "Hủy",
      async onOk() {
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
            console.log(err);
            message.error({
              duration: 2,
              content: "Cập nhật không thành công!",
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
        setLoading(true);
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
          const result = await productSystemApi.delete(product.id).catch((err) => {
            console.log(err);
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
        await deleteProduct();
        navigate("/products")
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
                  <span className="productDetailLabel" style={{ color: "red" }}>
                    {validateMsg.productName}
                  </span>
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
                      <br/>
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
                      <br/>
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
                     <br/>
                      <span
                        className="productDetailLabel"
                        style={{ color: "red"}}
                      >
                        {validateMsg.maxPrice}
                      </span>
                    </div>

                    <div style={{ display: "inline-block" }}>
                      <Input value="VNĐ" style={{marginLeft: 10, width: 50}}/>
                      <br/>
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
                    <Option value="Cành">Cành</Option>
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
                      marginLeft: 200
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
