import React, { Component } from "react";
import "ant-design-pro/dist/ant-design-pro.css";
import "antd/dist/antd.css";
import { Icon, notification, Divider} from "antd";
import cookie from "react-cookies";

import request from "../insurance/PostRequest";
import "./Dashboard.css";
import HrContent1 from "./HrContent1";
import HrContent3 from "./HRContent3";
import HrContent2 from "./HRContent2";

export default class HRDashboard extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: [],
      loading: false,
      LoggedSysuser,
      queryID: "HRM_001"
    };
  }

  componentDidMount() {
    this.getData()
  };

  getData = () => {
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: this.state.queryID }),
      })
      .then((res) => {
        console.log(res);
        
        const data = res.data;
        if (data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: data.retDesc,
          });
          return;
        }
        console.log(res.data.retData);
        
        this.setState({ baseData: res.data.retData, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleClick = () => {
    this.getData();
  };

  
  render() {

    return (
      <div  style={{ margin: "20px" }}>
        <div style={{display: 'flex', flexFlow: 'row', alignItems: 'center', margin: "0 20px" }}>
          <h3>Dashboard</h3> 
          {/* <p style={{ height: 25, marginLeft: 10}}>|</p> */}
          <Divider type="vertical"  style={{borderLeft: '2px solid gray', height: 25}}/>
          <Icon style={{ fontSize: '20px', marginLeft: 2}} spin={this.state.loading} type='sync' theme="outlined" onClick={this.handleClick}/>
        </div>
        <HrContent1 data={this.state.baseData.Table} data7={this.state.baseData.Table7} data8={this.state.baseData.Table8}/>
        <HrContent2 ageData={this.state.baseData.Table1} data1={this.state.baseData.Table2} data2={this.state.baseData.Table3}/>
        <HrContent3 data={this.state.baseData.Table4} data1={this.state.baseData.Table5} data2={this.state.baseData.Table6} data3={this.state.baseData.Table9}/>
      </div>
    );
  }
}