import { Button, notification, Result, Spin } from "antd";
import React, { useEffect, useState } from "react";
import userApi from "../../apis/userApi";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import FeaturedInfoUser from "../../components/featuredInfoUser/FeaturedInfoUser";
import "./home.css";

export default function Home() {
  const [data, setData] = useState([]);
  const [loadErr, setloadErr] = useState(false);
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setloadErr(false);
      await userApi
        .getDataDashboard()
        .then((response) => {
          console.log(response);
          setData(response);
          setLoading(false);
        })
        .catch((err) => {
          if (err.message === "Network Error") {
            notification.error({
              duration: 2,
              message: "Mất kết nối mạng!",
              style: { fontSize: 16 },
            });
            setloadErr(true);
          } else {
            notification.error({
              duration: 2,
              message: "Có lỗi xảy ra trong quá trình xử lý!",
              style: { fontSize: 16 },
            });
          }
        });
    };
    fetchData();
  }, []);

  return (
    <div className="home">
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
        <>
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
            <>
              <FeaturedInfoUser {...data} />
              <br />
              <br />
              <FeaturedInfo {...data} />
            </>
          )}
        </>
      )}
    </div>
  );
}
