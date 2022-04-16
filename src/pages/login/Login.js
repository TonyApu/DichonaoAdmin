import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Spin } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import userApi from "../../apis/userApi";
import { setUser } from "../../stateManager/user/userSlice";
import "./login.css";

const Login = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;
  const [loginFail, setLoginFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onFinish = (values) => {
    const username = values.username;
    const password = values.password;

    setLoginFail(false);
    setLoading(true);
    const login = async () => {
      const result = await userApi.login({username, password}).catch(() => {
        setLoginFail(true);
        setLoading(false);
      });
      if (result && result.user.role === "admin") {
        const setUserAction = setUser({ ...result });
        dispatch(setUserAction);
        message.success({
          duration: 3,
          content: "Đăng nhập thành công",
        });
      }
    };
    login();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div style={{flex: 1}}>
    <div className="login">
      <div className="loginWrapper">
      <div className="d-flex justify-content-center">
        {loading ? (
          <>
            <Spin indicator={antIcon} /> <br /> <br />{" "}
          </>
        ) : null}
      </div>
        <div className="loginForm">
          <div className="loginTitle">
            <h1>Admin Dichonao</h1>
          </div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Tên Đăng Nhập"
              name="username"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mật Khẩu"
              name="password"
            >
              <Input.Password />
            </Form.Item>
            {loginFail && <span style={{color:'red', display: "flex", justifyContent: "center"}}>Tên đăng nhập hoặc mật khẩu không chính xác</span>}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" style={{display: "flex", justifyContent: "center", marginTop: 20}}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
