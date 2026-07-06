import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  notification,
  Spin,
  Row,
  Col,
  Typography,
  Modal,
  Dropdown,
  Menu,
} from "antd";
import "./Document.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import PDFJs from "../insurance/PDFJs";
import PDFViewer from "../insurance/PDFViewer";

const dateFormat = "YYYY.MM.DD";
const { Text } = Typography;

var curIndex = -1;
export default class Time extends Component {
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
      queryID: "Web_document",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: this.state.queryID }
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
      .post("Get_DocumentFile", {
        token: this.state.LoggedSysuser.token,
        documentFileNo: record.DocumentFileNo,
        DepartmentID: record.DepartmentID,
        DocumentTypeID: record.DocumentTypeID,
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
      <Dropdown
        disabled={record.Reason == 0}
        overlay={
          <Menu>
            <Menu.Item key="0">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.onClickPrint(record);
                }}
              >
                Харах
                </Button>
                </Menu.Item>
          </Menu>
        }
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          type="ghost"
          shape="circle"
          icon="more"
          style={{ border: "none" }}
        />
      </Dropdown>
    );

    const addColumns = [
      {
        title: "Файлын нэр",
        width: 100,
        dataIndex: "Name",
        key: "x",
        align: "left",
        className: "column-header-left",
      },
      {
        title: "Тайлбар",
        width: 100,
        dataIndex: "Descr",
        key: "x",
        align: "left",
        className: "column-header-left",
      },
      {
        title: "Үйлдэл",
        width: 100,
        dataIndex: "",
        key: "x",
        align: "right",
        className: "column-header-right",
        render: (text, record, index) => dropDown(record, index),
      },
    ];

    return (
      <div style={{ margin: "27px" }}>
        <h3>Бичиг баримт</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Бичиг баримт /
          <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1
          )}`}</Text>
        </h4>
        <Spin spinning={this.state.loading}>
          <GridView
            QueryID={this.state.queryID}
            rowKey="DocumentFileNo"
            dataSource={this.state.filterResult}
            addColumns={addColumns}
          />

          {this.state.showReport && (
            <Modal
              visible={this.state.showReport}
              centered
              bodyStyle={{ height: "80vh" }}
              width="80vw"
              title="Хэвлэх"
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
