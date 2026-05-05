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
} from "antd";
import "./LeaveRequest.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import Request from "./RequestModal";
import male from "@/image/male.png";
import female from "@/image/female.png";

const { Text } = Typography;
const dateFormat = "YYYY.MM.DD";
var curIndex = -1;
export default class LeaveRequest extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    var { EmpCode } = LoggedSysuser;

    this.state = {
      baseData: undefined,
      cookieUser,
      LoggedSysuser,
      EmpCode,
      loading: false,
      queryID: "Web_hrRelaxRequest",
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
    if (
      this.state.filterResult &&
      this.state.filterResult.Table &&
      this.state.filterResult.Table.length > 0 &&
      this.state.filterResult.Table[0].LeftRelaxDays <= 0
    ) {
      this.setState({
        editRequest: false,
        requestResult: record ? [record] : [],
      });
      return message.info("Амралт эдлэх хоног дууссан байна.");
    } else curIndex = index;
    this.setState({
      editRequest: true,
      requestResult: record ? [record] : [],
    });
  };

  onSuccess = (data) => {
    this.setState({ editRequest: false });
    if (data && data.Table && data.Table.length > 0)
      this.filter({ RowRecID: data.Table[0].RowRecID }, true);
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
        key: "x",
        align: "right",
        className: "column-header-left",
        render: (text, record, index) => dropDown(record, index),
      },
    ];

    const customRender = (text, record, fieldName) => {
      if (fieldName == "EmpName") {
        if (record.Status === 2)
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
                  record.ConfirmEmpCode +
                  ".jpg?" +
                  Date.now()
                }
              />
              <span style={{ marginLeft: "10px", fontSize: "11pt" }}>
                {record.ConfirmEmpName}
              </span>
            </div>
          );
        else if (record.Status === 1)
          return (
            <div>
              <Avatar
                icon={
                  <img
                    src={`${record.AgreeEmpGender}` === "M" ? male : female}
                  />
                }
                src={
                  request.host +
                  "avatars/" +
                  record.AgreeEmpCode +
                  ".jpg?" +
                  Date.now()
                }
              />
              <span style={{ marginLeft: "10px", fontSize: "11pt" }}>
                {record.AgreeEmpName}
              </span>
            </div>
          );
        else return null;
      } else {
        switch (record.Status) {
          case 0:
            return (
              <Tag color="#A57EE3">
                {this.state.filterResult &&
                  this.state.filterResult.Table3 &&
                  this.state.filterResult.Table3[0].ValueStr1}
              </Tag>
            );
          case 1:
            return (
              <Tag color="#87d068">
                {this.state.filterResult &&
                  this.state.filterResult.Table3 &&
                  this.state.filterResult.Table3[1].ValueStr1}
              </Tag>
            );
          case 2:
            return (
              <Tag color="#108ee9">
                {this.state.filterResult &&
                  this.state.filterResult.Table3 &&
                  this.state.filterResult.Table3[2].ValueStr1}
              </Tag>
            );
          // case 4:
          //   return (
          //     <Tag color="#f50">
          //       {this.state.filterResult &&
          //         this.state.filterResult.Table3 &&
          //         this.state.filterResult.Table3[3].ValueStr1}
          //     </Tag>
          //   );
        }
      }
    };
    return (
      <div style={{ margin: "27px" }}>
        <h3>Ээлжийн амралтын хүсэлт</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цагийн бүртгэл /{" "}
          <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1
          )}`}</Text>
        </h4>
        <div className="Request">
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
              }}
            >
              Хүсэлт нэмэх
            </b>
          </Button>
        </div>
        <Spin spinning={this.state.loading}>
          <Row gutter={[20, 20]} style={{ marginBottom: "10px" }}>
            <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
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
                      Ээлжийн амралтын цикл
                    </p>
                  </Row>
                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "13pt", marginTop: "6px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                          this.state.filterResult.Table &&
                          this.state.filterResult.Table.length > 0 &&
                          this.state.filterResult.Table[0].RelaxDate}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
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
                      Сүүлд амралт авсан огноо
                    </p>
                  </Row>

                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "13pt", marginTop: "6px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                        this.state.filterResult.Table &&
                        this.state.filterResult.Table.length > 0 &&
                        this.state.filterResult.Table[0].LastRelaxBegin
                          ? moment(
                              this.state.filterResult.Table[0].LastRelaxBegin
                            ).format(dateFormat)
                          : ""}{" "}
                        -{" "}
                        {this.state.filterResult &&
                        this.state.filterResult.Table &&
                        this.state.filterResult.Table.length > 0 &&
                        this.state.filterResult.Table[0].LastRelaxEnd
                          ? moment(
                              this.state.filterResult.Table[0].LastRelaxEnd
                            ).format(dateFormat)
                          : ""}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
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
                      Нийт амралтын хоногийн эрх
                    </p>
                  </Row>
                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "13pt", marginTop: "6px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                          this.state.filterResult.Table &&
                          this.state.filterResult.Table.length > 0 &&
                          this.state.filterResult.Table[0].RelaxDayCount}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
              <Card
                bodyStyle={{ height: "80px", padding: "10px" }}
                style={{ borderRadius: "8px" }}
              >
                <Row style={{ width: "100%" }}>
                  <Row>
                    <p
                      style={{ fontSize: "10pt", marginBottom: "0px" }}
                      align="center"
                    >
                      Үлдсэн амралтын хоног
                    </p>
                  </Row>
                  <Row>
                    <h4
                      align="center"
                      style={{ fontSize: "13pt", marginTop: "6px" }}
                    >
                      <b>
                        {this.state.filterResult &&
                          this.state.filterResult.Table &&
                          this.state.filterResult.Table.length > 0 &&
                          this.state.filterResult.Table[0].LeftRelaxDays}
                      </b>
                    </h4>
                  </Row>
                </Row>
              </Card>
            </Col>
          </Row>

          <GridView
            QueryID={this.state.queryID}
            rowKey="RowRecID"
            dataSource={
              this.state.filterResult && this.state.filterResult.Table1
            }
            renderColumns={["Status", "EmpName"]}
            customRender={customRender}
            addColumns={addColumns}
          />
        </Spin>
        {this.state.editRequest && (
          <Request
            visible={true}
            data={{
              EmpCode: this.state.EmpCode,
              Relax: this.state.filterResult.Table,
              EmpRelax: this.state.requestResult,
              RelaxDays: this.state.filterResult.Table2,
            }}
            onSuccess={this.onSuccess}
          />
        )}
      </div>
    );
  }
}
