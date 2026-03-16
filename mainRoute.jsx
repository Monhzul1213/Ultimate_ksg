import React from "react";

import Login from "@/main/Login.jsx";
import InvB from "@/warehouse/InvtBalance.jsx";
import "./mainRoute.css";
import LeftMenu from "@/main/LeftMenu.jsx";
import axios from "axios";

import { Layout, Menu, notification, Spin } from "antd";
import logo from "@/image/logo.png";
import cookie from "react-cookies";
import query from "querystring";
import request from "@/insurance/PostRequest.js";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const LoggedSysuser = cookie.load("LoggedSysuser");

class compon extends React.Component {
  componentWillMount() {
    if (LoggedSysuser) {
      this.funcs.init(LoggedSysuser.token, "", "");
    }
  }

  state = {
    loading: false,
    a: 1,
    user: "",
    pass: "",
    cookieUser: "",
    cookiePass: "",
  };

  funcs = {
    init: (token1, user, pass) => {
      if ((user === "" || pass === "") && token1 === "") return false;
      this.setState({
        loading: true,
      });
      request
        .post("Login", { token: token1, Name: user, Password: pass })
        .then(this.funcs.initSucc)
        .catch(this.funcs.initErr);
    },
    initSucc: (data) => {
      if (data.data.retType === 0) {
        if (LoggedSysuser) {
          cookie.remove("LoggedSysuser");
        }

        cookie.save("LoggedSysuser", data.data.retData.LoggedSysuser);
        cookie.setRawCookie("EmpCode", null);
        cookie.setRawCookie("UserID", null);
        this.setState({
          a: 0,
          loading: false,
          moduls: data.data.retData.moduls,
        });
      } else {
        cookie.remove("LoggedSysuser");
        notification["error"]({
          message: "Алдаа гарлаа",
          description: data.data.retDesc,
        });
        this.setState({
          a: 1,
          loading: false,
        });
      }
    },
    initErr: (data) => {
      notification["error"]({
        message: "Aldaa garlaa",
        description: "Aldaa garlaa desc",
      });
    },
  };

  onSuccess = (username, password) => {
    this.funcs.init("", username, password);
  };

  render() {
    if (1 === this.state.a) {
      return (
        <div className="MainContainer">
          <div>
            <div className="logo">
              {" "}
              <img src={logo} alt="Logo" />
            </div>
            <Spin
              spinning={this.state.loading}
              wrapperClassName="wrapperClassName"
            >
              <Login onSuccess={this.onSuccess} />
            </Spin>
            <div className="cpny">@2019 www.infinite.mn</div>
          </div>
        </div>
      );
    }
    return (
      <Layout className="MainContent">
        <LeftMenu moduls={this.state.moduls} />
      </Layout>
    );
  }
}

export default compon;
