import React, { Suspense } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import NotMatch from "@/main/NotMatch.jsx";
import cookie from "react-cookies";
import request from "@/insurance/PostRequest";
import { Layout, Menu, Icon, Avatar, Dropdown, Spin } from "antd";
import "./LeftMenu.css";
import logo from "@/image/login_logo.png";
import loadingImg from "@/image/loading.gif";
import male from "@/image/male.png";
import female from "@/image/female.png";
import logo1 from "@/image/Logo_104X104_1.png";
import CryptoJS from "crypto-js";
import HRDashboard from "../dashboard/HRDashboard";
import LoginPasswordChangeModal from "../hrm/LoginPasswordChangeModal";

const { Header, Content, Sider } = Layout;

const loadingIcon = (
  <Icon component={() => <img src={loadingImg} alt="loading" />} />
);

class compon extends React.Component {
  constructor(props) {
    super(props);
    const cookieUser = cookie.load("LoggedSysuser");    
    this.state = {
      cookieUser,
      moduls: props.moduls,
      user: props.user,
      loading: false,
      LoginEmpCode: props.LoginEmpCode,
      EmpFLName: props.EmpFLName,
      Gender: props.Gender,
      LoginToken: props.LoginToken,
      LoginCompanyID: "",
      mainloading: false,
      collapsed: false,
      EmpCode: cookieUser.EmpCode,
      isOtpResponse: props.isOtpResponse,
      isOtpModalVisible: props.isOtpModalVisible,
      isNewPass: props.isNewPass,
    };
  }

  imports = {};

  toggle = () => {
    this.onCollapse(!this.state.collapsed);
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onLoad = (visible) => {
    this.setState({ mainloading: visible });
  };

  componentDidMount() {    
    this.setState({
      LoginCompanyID: this.state.user,
    });
  }
  render() {
    const userMenu = (
      <Menu>
        <Menu.Item key="0">
          <a
            href="#/Profile"
            onClick={() => {
              const encryptedEmpCode = CryptoJS.AES.encrypt(
                this.state.EmpCode,
                "secretKey"
              ).toString();

              // Шифрлэсэн утгыг localStorage-д хадгална
              localStorage.setItem("id0356123", encryptedEmpCode);
              if (window.location.hash === "#/Profile") {
                window.location.reload();
              } else {
                window.location.hash = "#/Profile";
              }
            }}
          >
            Profile
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2">
          <a
            rel="noopener noreferrer"
            href=""
            onClick={() => {
              cookie.remove("LoggedSysuser");
              localStorage.removeItem("id0356123");

              window.location.reload();
            }}
          >
            <span>Logout</span>
          </a>
        </Menu.Item>
      </Menu>
    );

    const { ReportHeaderLogo } = this.state.moduls.Table4[0]|| {};
        
    return (
      <Layout>
        <LoginPasswordChangeModal isNewPass={this.state.isNewPass} />
        <Sider
          trigger={null}
          breakpoint="md"
          collapsible
          onCollapse={this.onCollapse}
          collapsedWidth={window.innerWidth >= 768 ? 82 : 0}
          collapsed={this.state.collapsed}
          width={280}
          className="MenuLayout"
        >
          <div className={!this.state.collapsed ? "logo1" : "LogoTitle"}>
            <a href="#/HRDashboard">
              <img
                src={this.state.collapsed ? logo1 : ReportHeaderLogo ? `data:image/png;base64,${ReportHeaderLogo}` : logo}
                alt="Logo"
                style={this.state.collapsed ? {cursor: "pointer", width: 40, height: 45} : { cursor: "pointer", width: 155, height: 45 }}
              />
            </a>
          </div>

          <Menu theme="dark" mode="inline" className="Menu">
            {this.state.moduls &&
              this.state.moduls.GrandParent &&
              this.state.moduls.GrandParent.map((grandParent) => {
                return [
                  <Menu.ItemGroup
                    title={
                      <span className="MenuItemGroupTitle">
                        {!this.state.collapsed ? grandParent.Caption : ""}
                      </span>
                    }
                  />,
                  this.state.moduls &&
                    this.state.moduls.Parent &&
                    this.state.moduls.Parent.filter((parent) => {
                      return parent.ParentMenuID === grandParent.MenuID;
                    }).map((parent) => {
                      return (
                        <Menu.SubMenu
                          key={parent.MenuID}
                          popupClassName="SubMenu"
                          title={
                            <span>
                              <Icon type={parent.ImageName} />
                              <span>{parent.Caption}</span>
                            </span>
                          }
                        >
                          {this.state.moduls &&
                            this.state.moduls.Child &&
                            this.state.moduls.Child.filter((child) => {
                              return child.ParentMenuID === parent.MenuID;
                            }).map((child) => {
                              return (
                                <Menu.Item key={child.MenuID}>
                                  <a href={`#/${child.FormName}`}>
                                    <span>{child.Caption}</span>
                                  </a>
                                </Menu.Item>
                              );
                            })}
                        </Menu.SubMenu>
                      );
                    }),
                ];
              })}
          </Menu>
        </Sider>
        <Layout>
          <Header className="Header">
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
            <div className="ContentHeader">
              <Dropdown
                overlay={userMenu}
                overlayStyle={{ padding: 0, margin: 0 }}
                overlayClassName="customDropdown"
              >
                <div className="DropDownTitle">
                  <Avatar
                    size="small"
                    icon={
                      <img
                        src={
                          this.state.cookieUser &&
                          this.state.cookieUser.Gender === "M"
                            ? male
                            : female
                        }
                      />
                    }
                    src={
                      request.host +
                      "avatars/" +
                      this.state.cookieUser.EmpCode +
                      ".jpg?" +
                      Date.now()
                    }
                  />
                  <span className="DropDownUser">
                    {`${this.state.cookieUser.EmpFLName.slice(0, -1)}`}
                  </span>
                </div>
              </Dropdown>
            </div>
          </Header>
          <div className="MainContainer1">
            <Spin
              indicator={loadingIcon}
              spinning={this.state.mainloading}
              style={{ height: "50%" }}
            >
              <Content>
                <Router>
                  <Suspense
                    fallback={
                      <Spin spinning>
                        <div style={{ height: "100vh" }} />
                      </Spin>
                    }
                  >
                    <Switch>
                      <Route exact path="/">
                        <Redirect to="/HRDashboard" />
                      </Route>
                      {this.state.moduls &&
                        this.state.moduls.Screen &&
                        this.state.moduls.Screen.map((screen) => {
                          let comp = this.imports[screen.ScreenID];
                          if (typeof comp === "undefined") {
                            comp = React.lazy(() =>
                              import(`@/${screen.Namespace}`)
                            );
                            this.imports[screen.ScreenID] = comp;
                          }
                          return (
                            <Route
                              key={screen.ScreenID}
                              exact
                              path={screen.ClassName.split(",")}
                              component={comp}
                            />
                          );
                        })}
                      {this.state.moduls &&
                        this.state.moduls.Screen &&
                        this.state.moduls.Screen.filter((screen) => {
                          return screen.FormName === "Profile";
                        }).map((profile) => {
                          return (
                            <Redirect
                              key={profile.FormName}
                              from="/"
                              to={`/Profile/${this.state.cookieUser.EmpCode}`}
                            />
                          );
                        })}
                      <Route path="/HRDashboard" component={HRDashboard} />
                      <Route component={NotMatch} />
                    </Switch>
                  </Suspense>
                </Router>
              </Content>
            </Spin>
          </div>
        </Layout>
      </Layout>
    );
  }
}
export default compon;
