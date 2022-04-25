import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import viVN from "antd/lib/locale-provider/vi_VN";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./store";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={viVN}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
