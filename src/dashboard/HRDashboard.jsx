import React, { Component } from "react";
import "ant-design-pro/dist/ant-design-pro.css";
import "antd/dist/antd.css";
import { Icon, notification, Divider } from "antd";
import cookie from "react-cookies";

import request from "../insurance/PostRequest";
import "./Dashboard.css";
import HrContent1 from "./HrContent1";
import HrContent2 from "./HRContent2";
import HrContent3 from "./HRContent3";
import HrContent4 from "./HRContent4";
import HrContent5 from "./HRContent5";
import HrContent6 from "./HRContent6";
import HrContent7 from "./HRContent7";
import HrContent8 from "./HRContent8";

export default class HRDashboard extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: [],
      loading: false,
      LoggedSysuser,
      queryID: "HRM_001",
      lastUpdated: null
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: this.state.queryID }),
      })
      .then((res) => {        
        const data = res.data;
        if (data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: data.retDesc,
          });
          return;
        }

        this.setState({
          baseData: res.data.retData,
          loading: false,
          lastUpdated: new Date()
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  handleClick = () => {
    this.getData();
  };

  render() {
    const { lastUpdated, baseData, loading } = this.state;

    const formattedLastUpdated = lastUpdated
      ? `${lastUpdated.getFullYear()}-${String(lastUpdated.getMonth() + 1).padStart(2, "0")}-${String(lastUpdated.getDate()).padStart(2, "0")} ${String(lastUpdated.getHours()).padStart(2, "0")}:${String(lastUpdated.getMinutes()).padStart(2, "0")}:${String(lastUpdated.getSeconds()).padStart(2, "0")}`
      : "";

    return (
      <div className="hr-dashboard-page">
        <div className="dashboard-topbar">
          <h3 className="dashboard-title">Dashboard</h3>
          <Divider type="vertical" className="dashboard-divider" />
          <Icon
            className="dashboard-refresh"
            spin={loading}
            type="sync"
            theme="outlined"
            onClick={this.handleClick}
          />
          {formattedLastUpdated ? (
            <span className="dashboard-updated-text">
              Сүүлд шинэчилсэн: {formattedLastUpdated}
            </span>
          ) : null}
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-section-title-row">
                <Icon type="team" className="dashboard-section-icon" />
                <span className="dashboard-section-title">Ажилтны мэдээлэл</span>
              </div>              
              <div className="dashboard-section-desc">
                Ерөнхий үзүүлэлт, ажилласан хугацаа, насны бүтэц, хэлтсийн мэдээлэл
              </div>
            </div>
          </div>

          <HrContent1 data={baseData.Table} data1={baseData.Table13} data2={baseData.Table14} />
          <HrContent2
            data={baseData.Table}
            data1={baseData.Table1}
            data2={baseData.Table2}
            reportData={baseData.Table19}
          />
          <HrContent3
            ageData={baseData.Table3}
            data={baseData.Table4}
            data1={baseData.Table20}
          />
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-section-title-row">
                <Icon type="calendar" className="dashboard-section-icon" />
                <span className="dashboard-section-title">Ирцийн мэдээлэл</span>
              </div>
              <div className="dashboard-section-desc">
                Өнөөдрийн ирц, сар жилийн үзүүлэлт, хөдөлгөөний статистик
              </div>
            </div>
          </div>

          <HrContent4
            data={baseData.Table5}
            data1={baseData.Table6}
            data2={baseData.Table7}
            data3={baseData.Table8}
            reportData1={baseData.Table16}
            reportData2={baseData.Table17}
            reportData3={baseData.Table18}
          />
          <HrContent5 data={baseData.Table9} />
          <HrContent6 data={baseData.Table10} />
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <div className="dashboard-section-title-row">
                <Icon type="wallet" className="dashboard-section-icon" />
                <span className="dashboard-section-title">Цалингийн мэдээлэл</span>
              </div>
              <div className="dashboard-section-desc">
                Цалингийн тайлан, нэмэгдэл, суутгалын мэдээлэл
              </div>
            </div>
          </div>

          <HrContent7 data={baseData.Table11} />
          <HrContent8 data={baseData.Table12} />
        </div>
      </div>
    );
  }
}