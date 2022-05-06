import "./newProduct.css";
import { Input, Select, Button, Modal, notification, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import productSystemApi from "../../apis/productSystemApi";
import productCategoriesApi from "../../apis/productCategoriesApi";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { CheckOutlined } from "@ant-design/icons";

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [origin, setOrigin] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [loading, setLoading] = useState("");
  const [loadErr, setloadErr] = useState(false);
  const [productNameErr, setProductNameErr] = useState("");
  const [minPriceErr, setMinPriceErr] = useState("");
  const [maxPriceErr, setMaxPriceErr] = useState("");
  const [unitErr, setUnitErr] = useState("");
  const [originErr, setOriginErr] = useState("");
  const [productCategoryErr, setProductCategoryErr] = useState("");
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

  // const onChangeUnit = (e) => {
  //   setUnit(e);
  // };

  // const onChangProvince = (e) => {
  //   setProvince(e);
  // };

  // const onChangeCatagory = (e) => {
  //   setProductCategoryId(e);
  // };

  const checkInvalidProductName = () => {
    if (validator.isEmpty(productName.trim())) {
      setProductNameErr("Tên sản phẩm không hợp lệ");
    } else {
      setProductNameErr("");
    }
  }

  const checkInvalidOrigin = () => {
    if (origin === "") {
      setOriginErr("Vui lòng chọn mục này")
    } else {
      setOriginErr("");
    }
  }

  const checkInvalidMinPrice = () => {
    if (!/^[1-9][0-9]{2,8}$/.test(parseInt(minPrice))) {
      setMinPriceErr("Giá tối thiểu không hợp lệ.")
    } else if (/^[1-9][0-9]{2,8}$/.test(parseInt(maxPrice)) && parseInt(maxPrice) <= parseInt(minPrice)) {
      setMinPriceErr("Giá tối thiểu phải nhỏ hơn tối đa.")
    } else {
      setMinPriceErr("");
      setMaxPriceErr("");
    }
  }

  const checkInvalidMaxPrice = () => {
    if (!/^[1-9][0-9]{2,8}$/.test(parseInt(maxPrice))) {
      setMaxPriceErr("Giá tối đa không hợp lệ")
    }else if (/^[1-9][0-9]{2,8}$/.test(parseInt(minPrice)) && parseInt(maxPrice) <= parseInt(minPrice)) {
      setMaxPriceErr("Giá tối đa phải lớn hơn tối thiểu")
    } else {
      setMaxPriceErr("");
      setMinPriceErr("");
    }
  }

  const checkInvalidUnit = () => {
    if (unit === "") {
      setUnitErr("Vui lòng chọn mục này")
    } else {
      setUnitErr("");
    }
  }

  const checkInvalidCategory = () => {
    if (productCategoryId === "") {
      setProductCategoryErr("Vui lòng chọn mục này")
    } else {
      setProductCategoryErr("");
    }
  }

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
            province: origin,
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
    let err = 0;
    if (validator.isEmpty(productName.trim())) {
      setProductNameErr("Tên sản phẩm không hợp lệ");
      err++;
    } else {
      setProductNameErr("");
    }

    if (!/^[1-9][0-9]{2,8}$/.test(parseInt(minPrice))) {
      setMinPriceErr("Giá tối thiểu không hợp lệ.")
    } else if (/^[1-9][0-9]{2,8}$/.test(parseInt(maxPrice)) && parseInt(maxPrice) <= parseInt(minPrice)) {
      setMinPriceErr("Giá tối thiểu phải nhỏ hơn tối đa.")
    } else {
      setMinPriceErr("");
      setMaxPriceErr("");
    }

    if (!/^[1-9][0-9]{2,8}$/.test(parseInt(maxPrice))) {
      setMaxPriceErr("Giá tối đa không hợp lệ");
      err++;
    }else if (/^[1-9][0-9]{2,8}$/.test(parseInt(minPrice)) && parseInt(maxPrice) <= parseInt(minPrice)) {
      setMaxPriceErr("Giá tối đa phải lớn hơn tối thiểu");
      err++;
    } else {
      setMaxPriceErr("");
      setMinPriceErr("")
    }

    if (productCategoryId === "") {
      setProductCategoryErr("Vui lòng chọn mục này")
      err++;
    } else {
      setProductCategoryErr("");
    }

    if (unit === "") {
      setUnitErr("Vui lòng chọn mục này")
      err++;
    } else {
      setUnitErr("");
    }

    if (origin === "") {
      setOriginErr("Vui lòng chọn mục này")
      err++
    } else {
      setOriginErr("");
    }
    if (err > 0) return false;
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
                      onBlur={checkInvalidProductName}
                    />
                    <span className="newProductLabelErr">
                      {productNameErr}
                    </span>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Xuất Sứ: </span>
                    <Select
                      style={{ width: 500 }}
                      onChange={(e) => setOrigin(e)}
                      onBlur={checkInvalidOrigin}
                    >
                      <Option value="Đồng Nai">Đồng Nai</Option>
                    </Select>
                    <span className="newProductLabelErr">
                      {originErr}
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
                          onBlur={checkInvalidMinPrice}
                        />
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{ color: "red", width: 200, fontSize: 14 }}
                        >
                          {minPriceErr}
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
                          onBlur={checkInvalidMaxPrice}
                        />
                        <br />
                        <span
                          className="productDetailLabel"
                          style={{ fontSize: 14, color: "red" }}
                        >
                          {maxPriceErr}
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
                          style={{ color: "red", marginLeft: 20, fontSize: 14 }}
                        >
                          {null}
                        </span>
                      </div>
                    </div>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Đơn vị: </span>
                    <Select style={{ width: 500 }} onChange={(e) => setUnit(e)} onBlur={checkInvalidUnit}>
                      <Option value="Kg">Kg</Option>
                    </Select>
                    <span
                      className="productDetailLabel"
                      style={{ fontSize: 14, color: "red" }}
                    >
                      {unitErr}
                    </span>
                  </div>
                  <br />

                  <div className="productDetailFormInput">
                    <span className="productDetailLabel">Loại</span>
                    <Select
                      style={{ width: 500 }}
                      onChange={(e) => setProductCategoryId(e)}
                      onBlur={checkInvalidCategory}
                    >
                      {categories.map((category) => {
                        return (
                          <Option value={category.id}>{category.name}</Option>
                        );
                      })}
                    </Select>
                    <span className="newProductLabelErr">
                      {productCategoryErr}
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
