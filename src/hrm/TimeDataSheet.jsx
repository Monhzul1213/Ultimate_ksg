import React from "react";
import {
  Typography,
  Card,
  Input,
  Row,
  Col,
  Form,
  Button,
  Upload,
  notification,
  Spin,
  Tag,
} from "antd";
import request from "./../insurance/PostRequest";
import "./LoginPasswordChange.css";
import cookie from "react-cookies";
import moment from "moment";

const monthFormat = "YYYY.MM";
const dateFormat = "YYYY.MM.DD";
const datetimeFormat = "YYYY.MM.DD H:MM";

var date = new Date(),
  today =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var monthYear = year + "." + month;

const { Text } = Typography;
class TimeDataSheet extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");

    this.state = {
      data: props.data,
      visible: props.visible,
      loading: false,
      LoggedSysuser,
      profile_image: undefined,
      confirmDirty: false,
      cookieUser,
      bufferData: [],
      bufferData1: [],
      bufferData2: [],
      bufferData3: [],
    };
  }

  componentDidMount() {
    request
      .post("getTsTimeSummaryMonth", {
        token: this.state.LoggedSysuser.token,
        pName: this.state.LoggedSysuser.EmpCode,
        pPassword: "",
        pMonth: month,
        pYear: year,
        EndDate: "",
        BeginDate: "",
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
          bufferData1: data.retData.Table3,
          bufferData2: data.retData.Table4,
          bufferData3: data.retData.Table5,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  timeSheetIn = () => {
    this.setState({ loading: true });
    var tsTimeDataSheet = [];
    tsTimeDataSheet.push({
      EmpCode: this.state.cookieUser.EmpCode,
      SheetDate: moment(today, dateFormat),
      SheetPeriod: moment().get("year") + (date.getMonth() + 1),
      TimeInOut: moment(today, datetimeFormat),
      SheetYear: moment().get("year"),
      SheetMonth: date.getMonth() + 1,
      SheetDay: moment().get("date"),
      SheetHour: moment().get("hour"),
      SheetMinute: moment().get("minute"),
      InOutCheck: "1",
    });

    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "TS_044",
          tsTimeDataSheet,
        }),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
          });
          return;
        }
        notification["success"]({
          message: "Амжилттай хадгаллаа.",
          description: "",
        });
        this.componentDidMount();
        this.setState({
          loading: false,
          visible: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };
  timeSheetOut = () => {
    this.setState({ loading: true });
    var tsTimeDataSheet = [];
    tsTimeDataSheet.push({
      EmpCode: this.state.cookieUser.EmpCode,
      SheetDate: moment(today, dateFormat),
      SheetPeriod: moment().get("year") + (date.getMonth() + 1),
      TimeInOut: moment(today, datetimeFormat),
      SheetYear: moment().get("year"),
      SheetMonth: date.getMonth() + 1,
      SheetDay: moment().get("date"),
      SheetHour: moment().get("hour"),
      SheetMinute: moment().get("minute"),
      InOutCheck: "0",
    });

    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "TS_044",
          tsTimeDataSheet,
        }),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
          });
          return;
        }
        notification["success"]({
          message: "Амжилттай хадгаллаа.",
          description: "",
        });
        this.componentDidMount();
        this.setState({
          loading: false,
          visible: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { bufferData1, bufferData2, LoggedSysuser, cookieUser } = this.state;
    console.log(bufferData2);
    const formLayount = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      labelAlign: "left",
    };
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    return (
      <div style={{ margin: "27px" }}>
        <h3>Цаг бүртгэх</h3>
        <h4 style={{ marginBottom: "25px" }}>
          Хүний нөөц / Цагийн бүртгэл / <Text color="#6b747b">Цаг бүртгэх</Text>
        </h4>
        <div>
          <Spin spinning={this.state.loading}>
            <Card>
              <Form {...formLayount}>
                <Row gutter={12}>
                  <Col>
                    <h5>
                      <Tag color="blue" className="tag-height">
                        {" "}
                        Ирсэн цаг:{" "}
                        {`${
                          moment(
                            bufferData2[0] && bufferData2[0].SheetDate
                          ).format("MMMM Do YYYY") ==
                            moment().format("MMMM Do YYYY") &&
                          bufferData2[0] &&
                          bufferData2[0].SheetDate.length > 0
                            ? bufferData2[0] && bufferData2[0].TimeInOut
                            : ""
                        }`}
                      </Tag>
                    </h5>
                    {/* </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}> */}
                    <h5>
                      <Tag color="red" className="tag-height">
                        {" "}
                        Явсан цаг :{" "}
                        {`${
                          moment(
                            bufferData1[0] && bufferData1[0].SheetDate
                          ).format("MMMM Do YYYY") ==
                            moment().format("MMMM Do YYYY") &&
                          bufferData1[0] &&
                          bufferData1[0].SheetDate.length > 0
                            ? bufferData1[0] && bufferData1[0].TimeInOut
                            : ""
                        }`}
                      </Tag>
                    </h5>
                    {/* </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>  */}
                    {this.state.bufferData3[0] &&
                    this.state.bufferData3[0].InOut === "1" ? (
                      <div className="checkButton">
                        <Button
                          type="danger"
                          style={{
                            background: "#0A5287",
                            height: "43px",
                            width: "165px",
                            border: "none",
                            paddingBottom: "3px",
                            background: "#ff4d4f",
                          }}
                          onClick={() => {
                            this.timeSheetOut();
                          }}
                        >
                          {" "}
                          <b style={{ fontSize: "14px", marginLeft: "4px" }}>
                            Явсан
                          </b>
                        </Button>
                      </div>
                    ) : (
                      <div className="checkButton1">
                        <Button
                          type="primary"
                          style={{
                            background: "#0A5287",
                            border: "none",
                            height: "43px",
                            width: "165px",
                            paddingBottom: "3px",
                          }}
                          onClick={() => {
                            this.timeSheetIn();
                          }}
                        >
                          {" "}
                          <b style={{ fontSize: "14px", marginLeft: "4px" }}>
                            Ирсэн
                          </b>
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
              </Form>
            </Card>
          </Spin>
        </div>
      </div>
    );
  }
}
const EditableFormTable = Form.create()(TimeDataSheet);
export default EditableFormTable;
