import "./harvestCampaignList.css";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Pagination,
  Table,
  Radio,
  Divider,
  Spin,
  Modal,
  message,
  Space,
  Input,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import campaignsApi from "../../apis/campaignsApi";
import harvestCampaignsApi from "../../apis/harvestCampaigns";
import { async } from "@firebase/util";
import farmApi from "../../apis/farmApi";

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
  const param = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const { confirm } = Modal;

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "harvest",
      Id: "harvest",
      render: (text) => <img className="harvestImage" src={text.image1} />,
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
    const fetchCampaign = async () => {
      const response = await farmApi.get(param.farmId);
      console.log(response);
      setFarm(response);
      setLoading(false);
    };
    fetchCampaign();
  }, []);

  useEffect(() => {
    const params = {
      campaignId: param.campaignId,
      page: page,
      size: pageSize,
      farmId: param.farmId,
    };
    const fetchRequests = async () => {
      setLoading(true);
      const response = await campaignsApi.getHarvestApply(params);
      console.log(response);
      setHarvestRequests(response.data);
      setTotalRecords(response.metadata.total);
      if (response.metadata.total === 0) {
        navigate(`/request/${param.campaignId}`);
      }
      setLoading(false);
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

  const handleOk = async () => {
    const rejectHarvest = async () => {
      const params = {
        id: deleteId,
        note: value,
      };
      console.log(params);
      const result = await harvestCampaignsApi.reject(params).catch((err) => {
        console.log(err);
        message.error({
          duration: 2,
          content: err.response.data.error.message,
        });
      });
      if (result === "Update successfully!") {
        message.success({
          duration: 2,
          content: "Từ chối thành công!",
        });
      }
    };
    await rejectHarvest();
    setFlag(!flag);
  };

  const showAcceptConfirm = (requests) => {
    console.log(requests);
    confirm({
      title: "Bạn có muốn duyệt những sản phẩm này vào chiến dịch?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Khách hàng có thể thấy những sản phẩm này vào ngày chiến dịch bắt đầu mở bán",
      okText: "Duyệt",
      okType: "dashed",
      cancelText: "Hủy",
      async onOk() {
        let id = [];
        {
          requests.map((request) => {
            id.push(request.id);
          });
        }
        const approveHarvest = async () => {
          const result = await harvestCampaignsApi.approve(id).catch((err) => {
            console.log(err);
            message.error({
              duration: 2,
              content: err.response.data.error.message,
            });
          });
          if (result === "Update successfully!") {
            message.success({
              duration: 2,
              content: "Duyệt sản phẩm thành công!",
            });
          }
        };
        await approveHarvest();
        setFlag(!flag);
      },
      onCancel() {},
    });
  };

  return (
    <div className="harvestRequestList">
      <div className="wrapper">
        <Modal
          icon={<ExclamationCircleOutlined />}
          title="Bạn có muốn từ chối sản phẩm này?"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Từ Chối"
          okType="danger"
          cancelText="Hủy"
        >
          <p>Sau khi Xóa Sản phẩm sẽ không thể được bày bán trong chiến dịch</p>
          <span>Hãy cho chủ nông trại biết lý do nhé:</span>
          <Radio.Group onChange={(e) => onReasonChange(e)} value={value}>
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
                  <Input
                    style={{ width: 100, marginLeft: 10 }}
                    onChange={onReasonChange}
                  />
                ) : null}
              </Radio>
            </Space>
          </Radio.Group>
        </Modal>
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
          style={{ height: 400 }}
          loading={loading}
        />
      </div>

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
  );
};

export default HarvestCampaignList;
