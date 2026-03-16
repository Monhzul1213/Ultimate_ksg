import React, { Component } from "react";
import "ant-design-pro/dist/ant-design-pro.css";
import "./Dashboard.css";
import "antd/dist/antd.css";
import HeaderSearch from "ant-design-pro/lib/HeaderSearch";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { Row, Col, Slider } from "antd";
import { Avatar, Input } from "antd";
import { relative } from "path";

import Content1 from "./Content1";
import Content2 from "./Content2";
import Content3 from "./Content3";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const Search = Input.Search;

class Dashboard extends Component {
  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout className ="Container">
          <Content1 />
          <Content2 />
          <Content3 />

          <Footer className="footer" style={{ textAlign: "center" }}>
            Created by Infinite Solutions ©2019
          </Footer>
      </Layout>
    );
  }
}

export default Dashboard;
