import React, { Component } from "react";
import {
  Button,
  notification,
  Spin,
  Typography,
  Modal,
  Dropdown,
  Menu,
} from "antd";
import "./EmployeeDoc.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import PDFJs from "../insurance/PDFJs";
import PDFViewer from "../insurance/PDFViewer";

const { Text } = Typography;

export default class EmployeeDoc extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    var { EmpCode } = LoggedSysuser;
    this.state = {
      baseData: undefined,
      loading: true,
      EmpCode,
      cookieUser,
      LoggedSysuser,
      queryID: "Web_employeeDoc",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    var BusinessObject = [];
    BusinessObject.push({ FieldName: "EmpCode", Value: this.props.EmpCode });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: this.state.queryID, BusinessObject }
        ),
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
        var filterResult = [];
          filterResult = data.retData && data.retData.Table ? data.retData.Table : [];
        this.setState({
          filterResult,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };
    onCancelReport = () => {
    this.setState({ showReport: false });
  };
  onClickPrint = (record) => {
    this.setState({ loading: true });
    request
      .post("Get_EmpDocument", {
        token: this.state.LoggedSysuser.token,
        empDocID: record.EmpDocID,
        empCode:  this.state.EmpCode
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
        if (!res.data.retData) return;

        const reportUrl = encodeURIComponent(
          request.host + "get_inPICount.asmx/Get_Report?key=" + res.data.retData
        );
        this.setState({ showReport: true, reportUrl, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };
  render() {
    const dropDown = (record, index) => (
        <Button
          type="ghost"
          shape="circle"
          icon="eye"
                style={{ border: "none", color: "#18a6e4" }}
                onClick={() => {
                  this.onClickPrint(record);
                }}
        />
    );

    const addColumns = [
      {
        title: "Үйлдэл",
        width: 100,
        dataIndex: "",
        key: "x",
        align: "center",
        className: "column-header-left",
        render: (text, record, index) => dropDown(record, index),
      },
    ];

    return (
      <div style={{ marginTop: "15px" }}>
        <Spin spinning={this.state.loading}>
          <GridView
            QueryID={this.state.queryID}
            rowKey="EmpDocID"
            dataSource={this.state.filterResult}
            addColumns={addColumns}
          />

          {this.state.showReport && (
            <Modal
              visible={this.state.showReport}
              centered
              bodyStyle={{ height: "80vh" }}
              width="80vw"
              footer={null}
              destroyOnClose
              onCancel={this.onCancelReport}
            >
            <PDFViewer backend={PDFJs} src={this.state.reportUrl} />
            </Modal>
          )}
        </Spin>
      </div>
    );
  }
}
