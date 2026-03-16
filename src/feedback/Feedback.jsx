import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Button,
  notification,
  Spin,
  Menu,
  Dropdown,
  Row,
  Col,
  Avatar,
  Card,
  Typography,
  Tag,
  message,
  Table,
} from "antd";
import "./Feedback.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridViewReq";
import male from "@/image/male.png";
import female from "@/image/female.png";
import FModal from "./FeedbackModal";

const { Text } = Typography;
const dateFormat = "YYYY.MM.DD";
var curIndex = -1;
export default class Feedback extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    var { EmpCode, EmpFName } = LoggedSysuser;

    this.state = {
      baseData: undefined,
      cookieUser,
      LoggedSysuser,
      EmpCode,
      EmpFName,
      loading: false,
      queryID: "Web_Feedback",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.filter();
  }

  filter = (update) => {
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
        var filterResult = [];
        if (update) {
          if (
            data.retData &&
            data.retData.Table1 &&
            data.retData.Table1.length > 0
          ) {
            if (
              this.state.filterResult &&
              this.state.filterResult.Table1 &&
              curIndex
            ) {
              filterResult = [...this.state.filterResult];
              Object.keys(data.retData.Table1[0]).forEach((key) => {
                filterResult.Table1[curIndex][key] =
                  data.retData.Table1[0][key];
              });
            } else filterResult = data.retData;
          }
        } else filterResult = data.retData && data.retData ? data.retData : [];
        this.setState({ filterResult, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  getRequest = (record, index) => {
    this.setState({
      editRequest: true,
      requestResult: record ? [record] : [],
    });
  };

  onSuccess = (data) => {
    this.setState({ editRequest: false });
    if (data && data.Table && data.Table.length > 0)
      this.filter({ RowFID: data.Table[0].RowFID }, true);
  };

  render() {
    const dropDown = (record, index) => (
      <Dropdown
        disabled={record.Status > 0}
        overlay={
          <Menu>
            <Menu.Item key="0">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.getRequest(record, index);
                }}
              >
                Засах
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
        title: "Үйлдэл",
        width: 100,
        dataIndex: "",
        fixed: "right",
        key: "x",
        className: "column-header-left",
        render: (text, record, index) => dropDown(record, index),
      },
    ];
    const customRender = (text, record, fieldName) => {
      if (fieldName == "OrderEmpCode") {
        return (
          <div>
            <Avatar
              icon={
                <img
                  src={`${record.ConfirmEmpGender}` === "M" ? male : female}
                />
              }
              src={
                request.host +
                "avatars/" +
                record.OrderEmpCode +
                ".jpg?" +
                Date.now()
              }
            />
            <span style={{ marginLeft: "10px", fontSize: "11pt" }}>
              {record.OrderEmpCode}
            </span>
          </div>
        );
      } else if (fieldName == "DegreeName") {
        switch (record.DegreeName) {
          case "Яаралтай":
            return <Tag className="dot" color="#ff0000" />;
          case "Хэвийн":
            return <Tag className="dot" color="#2ADDC6" />;
        }
      } else {
        switch (record.Status) {
          case 0:
            return (
              <Tag color="#A57EE3">
                {this.state.filterResult &&
                  this.state.filterResult.Table1 &&
                  this.state.filterResult.Table1[0].ValueStr1}
              </Tag>
            );
          case 2:
            return (
              <Tag color="#87d068">
                {this.state.filterResult &&
                  this.state.filterResult.Table1 &&
                  this.state.filterResult.Table1[1].ValueStr1}
              </Tag>
            );
          case 4:
            return (
              <Tag color="#f50">
                {this.state.filterResult &&
                  this.state.filterResult.Table1 &&
                  this.state.filterResult.Table1[2].ValueStr1}
              </Tag>
            );
          case 5:
            return (
              <Tag color="#108ee9">
                {this.state.filterResult &&
                  this.state.filterResult.Table1 &&
                  this.state.filterResult.Table1[3].ValueStr1}
              </Tag>
            );
        }
      }
    };
    return (
      <div style={{ margin: "27px" }}>
        <h3>Хүсэлт гаргах</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Хүсэлт /
          <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1
          )}`}</Text>
        </h4>
        <div style={{ position: "absolute", top: "20px", right: "27px" }}>
          <Button
            type="primary"
            shape="round"
            style={{
              background: "#0A5287",
              border: "none",
              height: "37px",
              paddingBottom: "3px",
            }}
            icon="plus"
            onClick={() => {
              this.getRequest();
            }}
          >
            <b
              style={{
                fontSize: "14px",
                marginLeft: "4px",
                background: "#0A5287",
              }}
            >
              Хүсэлт нэмэх
            </b>
          </Button>
        </div>
        <Spin spinning={this.state.loading}>
          <Row gutter={[20, 20]} style={{ marginBottom: "10px" }}>
            <Col xs={24} sm={24} md={12} lg={6} xxl={6}>
              <Card
                bodyStyle={{ height: "80px", padding: "10px" }}
                style={{ borderRadius: "8px", background: "" }}
              >
                <Row>
                  <Row>
                    <p
                      style={{ fontSize: "10pt", marginBottom: "0px" }}
                      align="center"
                    >
                      Шийдвэрлэгдсэн хүсэлтийн тоо
                    </p>
                  </Row>
                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "20pt", marginTop: "1px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                          this.state.filterResult.Table8 &&
                          this.state.filterResult.Table8[0].CCount}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xxl={6}>
              <Card
                bodyStyle={{ height: "80px", padding: "10px" }}
                style={{ borderRadius: "8px", background: "" }}
              >
                <Row>
                  <Row>
                    <p
                      style={{ fontSize: "10pt", marginBottom: "0px" }}
                      align="center"
                    >
                      Хүлээн авсан хүсэлтийн тоо
                    </p>
                  </Row>
                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "20pt", marginTop: "1px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                          this.state.filterResult.Table3 &&
                          this.state.filterResult.Table3[0].ApproveCount}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xxl={6}>
              <Card
                bodyStyle={{ height: "80px", padding: "10px" }}
                style={{ borderRadius: "8px" }}
              >
                <Row>
                  <Row>
                    <p
                      style={{ fontSize: "10pt", marginBottom: "0px" }}
                      align="center"
                    >
                      Хүлээгдэж буй хүсэлтийн тоо
                    </p>
                  </Row>

                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "20pt", marginTop: "1px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                          this.state.filterResult.Table2 &&
                          this.state.filterResult.Table2[0].RequestCount}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xxl={6}>
              <Card
                bodyStyle={{ height: "80px", padding: "10px" }}
                style={{ borderRadius: "8px" }}
              >
                <Row>
                  <Row>
                    <p
                      style={{ fontSize: "10pt", marginBottom: "0px" }}
                      align="center"
                    >
                      Цуцлагдсан хүсэлтийн тоо
                    </p>
                  </Row>
                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "20pt", marginTop: "1px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                          this.state.filterResult.Table4 &&
                          this.state.filterResult.Table4[0].VoidCount}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
          </Row>

          <GridView
            QueryID={this.state.queryID}
            rowKey="RowFID"
            dataSource={
              this.state.filterResult && this.state.filterResult.Table
            }
            renderColumns={["Status", "OrderEmpCode", "DegreeName"]}
            customRender={customRender}
            addColumns={addColumns}
          />
        </Spin>
        {this.state.editRequest && (
          <FModal
            visible={true}
            data={{
              EmpCode: this.state.EmpCode,
              EmpFName: this.state.EmpFName,
              Degree: this.state.filterResult.Table5,
              Type: this.state.filterResult.Table6,
              EmpRelax: this.state.requestResult,
              Email: this.state.filterResult.Table7,
            }}
            onSuccess={this.onSuccess}
          />
        )}
      </div>
    );
  }
}
