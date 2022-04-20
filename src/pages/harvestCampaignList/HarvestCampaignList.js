import "./harvestCampaignList.css";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Table,
  Radio,
  Modal,
  message,
  Space,
  Button,
  Spin,
  notification,
  Result,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import campaignsApi from "../../apis/campaignsApi";
import harvestCampaignsApi from "../../apis/harvestCampaigns";
import { async } from "@firebase/util";
import farmApi from "../../apis/farmApi";
import TextArea from "antd/lib/input/TextArea";

const HarvestCampaignList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [deleteId, setDeleteId] = useState(0);
  const [flag, setFlag] = useState(true);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [farm, setFarm] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [harvestRequests, setHarvestRequests] = useState([]);
  const [approveRequests, setApproveRequests] = useState([]);
  const [totalRecord, setTotalRecords] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadErr, setloadErr] = useState(false);
  const param = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const { confirm } = Modal;

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "harvest",
      Id: "harvest",
      render: (text) => <img className="farmImage" src={text.image1} />,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      Id: "productName",
      render: (text) => <div className="harvestName">{text}</div>,
    },

    {
      title: "Số Lượng",
      dataIndex: "inventory",
      Id: "inventory",
      render: (text) => <div className="inventory">{text}</div>,
    },
    {
      title: "Đơn Vị",
      dataIndex: "unit",
      Id: "unit",
      render: (text) => <div className="unit">{text}</div>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      Id: "price",
      render: (text) => <div className="price">{text}</div>,
    },
    {
      title: "Xóa",
      dataIndex: "id",
      Id: "id",
      render: (text) => (
        <div className="icon">
          <DeleteOutlined onClick={() => openRejecConfirm(text)} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true);
      setloadErr(false);
      await farmApi
        .get(param.farmId)
        .then((response) => {
          setFarm(response);
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
    fetchFarm();
  }, [flag]);

  useEffect(() => {
    const params = {
      campaignId: param.campaignId,
      page: page,
      size: pageSize,
      farmId: param.farmId,
    };
    const fetchRequests = async () => {
      setloadErr(false);
      setLoadingTable(true);
      await campaignsApi
        .getHarvestApply(params)
        .then((response) => {
          setHarvestRequests(response.data);
          setTotalRecords(response.metadata.total);
          if (response.metadata.total === 0) {
            navigate(`/request/${param.campaignId}`);
          }
          setLoadingTable(false);
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
    fetchRequests();
  }, [page, flag]);

  const rowSelection = {
    onChange: (selectedRowIds, selectedRows) => {
      setApproveRequests(selectedRows);
    },
  };

  const openRejecConfirm = (id) => {
    setIsModalVisible(true);
    setDeleteId(id);
  };

  const onReasonChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setLoadingTable(true);
    const rejectHarvest = async () => {
      const params = {
        id: deleteId,
        note: value,
      };
      const result = await harvestCampaignsApi.reject(params).catch((err) => {
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
      if (result === "Update successfully!") {
        notification.success({
          duration: 2,
          message: "Từ chối thành công!",
        });
        setFlag(!flag);
      }
    };
    rejectHarvest();
  };

  const showAcceptConfirm = (requests) => {
    confirm({
      title: "Bạn có muốn duyệt những sản phẩm này vào chiến dịch?",
      icon: <CheckCircleTwoTone />,
      content:
        "Khách hàng có thể thấy những sản phẩm này vào ngày chiến dịch bắt đầu mở bán",
      okText: "Tiếp Tục",
      okType: "dashed",
      cancelText: "Hủy",
      onOk() {
        setLoadingTable(true);
        let id = [];
        {
          requests.map((request) => {
            id.push(request.id);
          });
        }
        const approveHarvest = async () => {
          const result = await harvestCampaignsApi.approve(id).catch((err) => {
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
          if (result === "Update successfully!") {
            notification.success({
              duration: 2,
              message: "Duyệt sản phẩm thành công!",
              style: { fontSize: 16 }
            });
            setFlag(!flag);
          }
        };
        approveHarvest();
      },
      onCancel() {},
    });
  };

  return (
    <div className="harvestRequestList">
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
        <div className="harvestRequestListWrapper">
          <Modal
            icon={<ExclamationCircleOutlined />}
            title="Bạn có muốn từ chối sản phẩm này?"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Tiếp Tục"
            okType="danger"
            cancelText="Hủy"
          >
            <span>Hãy cho chủ nông trại biết lý do nhé:</span>
            <Radio.Group
              style={{ marginTop: 20 }}
              onChange={(e) => onReasonChange(e)}
              value={value}
            >
              <Space direction="vertical">
                <Radio value={"Hình ảnh không hợp lệ"}>
                  Hình ảnh không hợp lệ
                </Radio>
                <Radio value={"Tên sản phẩm không hợp lệ"}>
                  Tên sản phẩm không hợp lệ
                </Radio>
                <Radio value={"Giá sản phẩm không nằm trong khoảng qui định"}>
                  Giá sản phẩm không nằm trong khoảng qui định
                </Radio>
                <Radio value={"Khác"}>
                  Khác...
                  {value === "Khác" ? (
                    <TextArea
                      style={{ width: 200, marginLeft: 10 }}
                      onChange={onReasonChange}
                    />
                  ) : null}
                </Radio>
              </Space>
            </Radio.Group>
          </Modal>
          {loading ? (
            <>
              <Spin
                style={{ display: "flex", justifyContent: "center" }}
                size="large"
              />{" "}
              <br /> <br />{" "}
            </>
          ) : (
            <div>
              <div className="farmHarvestfarmName">
                <span>{farm.name}</span>
              </div>
              <div className="farmHarvestInfo">
                <span>
                  <b>Địa Chỉ:</b>{" "}
                </span>
                <span className="farmHarvestInfoTitle">{farm.address}</span>
              </div>
            </div>
          )}
          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columns}
            dataSource={harvestRequests}
            pagination={{
              position: ["bottomCenter"],
              current: page,
              pageSize: pageSize,
              total: totalRecord,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            style={{ height: 400, marginTop: 10 }}
            loading={loadingTable}
          />
          <Button
            key="button"
            type="primary"
            htmlType="submit"
            style={{
              width: 150,
              height: 40,
              borderRadius: 5,
            }}
            onClick={() => showAcceptConfirm(approveRequests)}
          >
            Duyệt
          </Button>
        </div>
      )}
    </div>
  );
};

export default HarvestCampaignList;
