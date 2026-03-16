import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "@/route/Home.jsx";
import TimeConfirm from "@/main/TimeConfirm.jsx";
import TimeRequestHistory from "@/main/TimeRequestHistory.jsx";
import NotMatch from "@/main/NotMatch.jsx";
import Login from "@/main/Login.jsx";
import Dashboard from "@/dashboard/Dashboard.jsx";
import InventoryDetail from "@/dashboard/InventoryDetail.jsx";
import InventoryDetails from "@/dashboard/InventoryDetails.jsx";
import InvtBalance from "@/warehouse/InvtBalance.jsx";
import TerminalPayment from "@/warehouse/TerminalPayment.jsx";
import ContractSheet from "@/insurance/ContractSheet.jsx";
import ContractSheetList from "@/insurance/ContractSheetList.jsx";
import Employees from "@/hrm/Employees.jsx";
import Profile from "@/hrm/Profile.jsx";
import Salaries from "@/hrm/Salaries.jsx";
import SalariesTable from "@/hrm/SalariesTable.jsx";
import SalaryLeave from "@/hrm/SalaryLeave.jsx";
import Reference from "@/hrm/Reference.jsx";
import LeaveRequest from "@/hrm/LeaveRequest.jsx";
import EmpsLeave from "@/hrm/EmpsLeave.jsx";
import cookie from "react-cookies";

import { Layout, Menu, Breadcrumb, Icon, Avatar, Dropdown, Spin } from "antd";
import "./LeftMenu.css";
import logo from "@/image/Logo_104X104.png";
import loadingImg from "@/image/loading.gif";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a rel="noopener noreferrer">Profile</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a rel="noopener noreferrer">Settings</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="2">
      <a
        rel="noopener noreferrer"
        href=""
        onClick={() => {
          cookieUser: cookie.remove("LoggedSysuser");
          window.location.reload();
        }}
      >
        <span>Logout</span>
      </a>
    </Menu.Item>
  </Menu>
);

const mainloading = false;
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
      loading: false,
      mainloading: false,
      collapsed: false,
    };
  }

  toggle = () => {
    this.onCollapse(!this.state.collapsed);
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onLoad = (visible) => {
    this.setState({ mainloading: visible });
  };

  render() {
    const HRMenuRender = () => {
      return [
        !this.state.collapsed && (
          <Menu.ItemGroup
            title={<span className="MenuItemGroupTitle">Хүний нөөц</span>}
          />
        ),
        <SubMenu
          key="sub1.1"
          popupClassName="SubMenu"
          title={
            <span>
              <Icon type="user" />
              <span>Бүртгэл</span>
            </span>
          }
        >
          <Menu.Item key="1">
            <a href="#/Employees">
              <span>Бүх ажилтан</span>
            </a>
          </Menu.Item>
        </SubMenu>,
        <SubMenu
          key="sub1.2"
          popupClassName="SubMenu"
          title={
            <span>
              <Icon type="dollar" />
              <span>Цалин</span>
            </span>
          }
        >
          <Menu.Item key="8">
            <a href="#/Salaries">
              <span>Бүх ажилтан</span>
            </a>
          </Menu.Item>
          <Menu.Item key="9">
            <a href={`#/SalariesTable/${this.state.cookieUser.EmpCode}`}>
              <span>Цалингийн хүснэгт</span>
            </a>
          </Menu.Item>
          <Menu.Item key="11">
            <a href="#/SalaryLeave">
              <span>Амралтын тооцоолол</span>
            </a>
          </Menu.Item>
        </SubMenu>,
        <SubMenu
          key="sub1.3"
          popupClassName="SubMenu"
          title={
            <span>
              <Icon type="clock-circle" />
              <span>Цагийн бүртгэл</span>
            </span>
          }
        >
          <Menu.Item key="2">
            <a href="#/Home">
              <span>Цагийн мэдээ</span>
            </a>
          </Menu.Item>
          <Menu.Item key="3">
            <a href="#/TimeConfirm">
              <span>Цагийн баталгаажуулалт</span>
            </a>
          </Menu.Item>
          <Menu.Item key="4">
            <a href="#/TimeRequestHistory">
              <span>Цагийн хүсэлтийн түүх</span>
            </a>
          </Menu.Item>
          <Menu.Item key="12">
            <a href={`#/LeaveRequest/${this.state.cookieUser.EmpCode}`}>
              <span>Ээлжийн амралтын хүсэлт</span>
            </a>
          </Menu.Item>
          <Menu.Item key="13">
            <a href="#/EmpsLeave">
              <span>Ажилтнуудын ээлжийн амралт</span>
            </a>
          </Menu.Item>
        </SubMenu>,
        <SubMenu
          key="sub1.5"
          popupClassName="SubMenu"
          title={
            <span>
              <Icon type="file-text" />
              <span>Гэрээ</span>
            </span>
          }
        >
          <Menu.Item key="10">
            <a href="#/Reference">
              <span>Лавлагаа</span>
            </a>
          </Menu.Item>
        </SubMenu>,
      ];
    };

    const WHMenuRender = () => {
      var menuitems = [
        <Menu.Item key="4">
          <a href="#/InvtBalance">
            <span>Үлдэгдэлийн мэдээ</span>
          </a>
        </Menu.Item>,
        <Menu.Item key="5">
          <a href="#/TerminalPayment">
            <span>Харилцагчийн тооцоо</span>
          </a>
        </Menu.Item>,
      ];
      return [
        !this.state.collapsed && (
          <Menu.ItemGroup
            title={<span className="MenuItemGroupTitle">Агуулах</span>}
          />
        ),
        this.state.collapsed ? (
          <SubMenu
            key="sub2.1"
            popupClassName="SubMenu"
            title={
              <span>
                <Icon type="dropbox" />
                <span>Агуулах</span>
              </span>
            }
          >
            {menuitems}
          </SubMenu>
        ) : (
          menuitems
        ),
      ];
    };
    const ISMenuRender = () => {
      var menuitems = [
        <Menu.Item key="6">
          <a href="#/ContractSheet">
            <span>Баталгаа бүртгэх</span>
          </a>
        </Menu.Item>,
        <Menu.Item key="7">
          <a href="#/ContractSheetList">
            <span>Баталгааны лавлагаа</span>
          </a>
        </Menu.Item>,
      ];
      return [
        !this.state.collapsed && (
          <Menu.ItemGroup
            title={<span className="MenuItemGroupTitle">Даатгал</span>}
          />
        ),
        this.state.collapsed ? (
          <SubMenu
            key="sub3.1"
            popupClassName="SubMenu"
            title={
              <span>
                <Icon type="bank" />
                <span>Даатгал</span>
              </span>
            }
          >
            {menuitems}
          </SubMenu>
        ) : (
          menuitems
        ),
      ];
    };

    return (
      <Layout>
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
          <div className="logo1">
            {" "}
            <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />{" "}
            {!this.state.collapsed ? (
              <div className="LogoTitle">Ultimate</div>
            ) : null}
          </div>
          <Menu theme="dark" mode="inline" className="Menu">
            {this.state.moduls &&
              this.state.moduls.GrandParent &&
              this.state.moduls.GrandParent.map((grandParent) => {
                return [
                  <Menu.ItemGroup
                    title={
                      <span className="MenuItemGroupTitle">
                        {grandParent.Caption}
                      </span>
                    }
                  />,
                  this.state.moduls &&
                    this.state.moduls.Parent &&
                    this.state.moduls.Parent.filter((parent) => {
                      return parent.ParentMenuID === grandParent.MenuID;
                    }).map((parent) => {
                      return (
                        <SubMenu
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
                        </SubMenu>
                      );
                    }),
                ];
              })}
            {/* {this.state.cookieUser && this.state.cookieUser && this.state.cookieUser.moduls && this.state.cookieUser.moduls.includes('IsHR') ? HRMenuRender() : null}
            {this.state.cookieUser && this.state.cookieUser && this.state.cookieUser.moduls && this.state.cookieUser.moduls.includes('IsWH') ? WHMenuRender() : null}
            {this.state.cookieUser && this.state.cookieUser && this.state.cookieUser.moduls && this.state.cookieUser.moduls.includes('IsIN') ? ISMenuRender() : null} */}
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
                overlay={menu}
                overlayStyle={{ padding: 0, margin: 0 }}
                overlayClassName="customDropdown"
              >
                <div className="DropDownTitle">
                  {" "}
                  <span className="DropDownUser">{`${this.state.cookieUser.EmpFLName.slice(
                    0,
                    -1
                  )}`}</span>{" "}
                  <Avatar size="small" icon="user" />{" "}
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
                  <Switch>
                    <Route
                      path="/TimeRequestHistory"
                      component={TimeRequestHistory}
                    />
                    <Route path="/TimeConfirm" component={TimeConfirm} />
                    <Route path="/Home" component={Home} />
                    <Route path="/Login" component={Login} />
                    <Route path="/Dashboard" component={Dashboard} />
                    <Route
                      path="/InventoryDetail"
                      component={InventoryDetail}
                    />
                    <Route
                      path="/InventoryDetails/:id"
                      component={InventoryDetails}
                    />
                    <Route
                      path="/InvtBalance"
                      render={(props) => (
                        <InvtBalance {...props} onLoad={this.onLoad} />
                      )}
                    />
                    <Route
                      path="/TerminalPayment"
                      component={TerminalPayment}
                    />
                    <Route path="/ContractSheet" component={ContractSheet} />
                    <Route
                      path="/ContractSheetList"
                      component={ContractSheetList}
                    />
                    <Route path="/Employees" component={Employees} />
                    <Route path="/Profile/:EmpCode" component={Profile} />
                    <Route path="/Salaries" component={Salaries} />
                    <Route
                      path="/SalariesTable/:EmpCode"
                      component={SalariesTable}
                    />
                    <Route path="/Reference" component={Reference} />
                    <Route
                      path="/LeaveRequest/:EmpCode"
                      component={LeaveRequest}
                    />
                    <Route path="/SalaryLeave" component={SalaryLeave} />
                    <Route path="/EmpsLeave" component={EmpsLeave} />
                    <Route component={NotMatch} />
                  </Switch>
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
