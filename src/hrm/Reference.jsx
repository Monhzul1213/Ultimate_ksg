import React, { Component } from "react";
import { Select, DatePicker, notification, Spin, Typography } from "antd";
import "./Reference.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import PDFJs from "../insurance/PDFJs";
import PDFViewer from "../insurance/PDFViewer";

const { Text } = Typography;

export default class Reference extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    var { EmpCode } = LoggedSysuser;

    this.state = {
      baseData: undefined,
      cookieUser,
      LoggedSysuser,
      loading: false,
      EmpCode,
      queryID: "Web_Reference",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: this.state.queryID,
          BusinessObject: { EmpCode: this.state.EmpCode },
        }),
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
          filterResult: data.retData && data.retData.Table,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  render() {
    return (
      <div style={{ margin: "27px" }}>
        <h3>Гэрээний лавлагаа</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Гэрээ /{" "}
          <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1
          )}`}</Text>
        </h4>

        <Spin spinning={this.state.loading}>
          <GridView
            QueryID={this.state.queryID}
            rowKey="RowRecID"
            dataSource={this.state.filterResult}
          />
        </Spin>
      </div>
    );
  }
}
