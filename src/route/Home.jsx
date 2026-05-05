import React from "react";
import {
  Icon,
  Table,
  notification,
  Button,
  Modal,
  TimePicker,
  Spin,
  Row,
  Col,
  Card,
  Statistic,
  Tabs,
  DatePicker,
  Input,
  Switch,
  Form,
  Popconfirm,
  Tooltip as ATooltip,
  Typography,
  Select,
} from "antd";
import moment from "moment";
import "./Home.css";
import { Sticky } from "react-sticky";
import cookie from "react-cookies";
import request from "@/insurance/PostRequest.js";
import Overt from "../hrm/Overtime";

function clog(a) {}
const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
//const { Header, Content, Footer, Sider } = Layout;
const { MonthPicker } = DatePicker;
const monthFormat = "YYYY.MM";
const dateFormat = "YYYY.MM.DD";

var date = new Date(),
  today =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Анхаар",
    description: "Ирээдүйд хуруу нөхөх боломжгүй.",
  });
};

var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var monthYear = year + "." + month;

// const operations = (
//   <div style={{ paddingTop: 8, paddingRight: 8 }}>
//     <MonthPicker
//       placeholder="Select Month"
//       defaultValue={moment(year + "." + month, monthFormat)}
//       format={monthFormat}
//       onChange={(a) => {
//         monthYear = moment(a).format(monthFormat);
//       }}
//     />
//   </div>
// );

// const renderTabBar = (props, DefaultTabBar) => (
//   <Sticky bottomOffset={80}>
//     {({ style }) => (
//       <DefaultTabBar
//         {...props}
//         style={{ ...style, margin: 0, zIndex: 1, background: "#fff" }}
//       />
//     )}
//   </Sticky>
// );

const formTailLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 32, offset: 0 },
};

class compon extends React.Component {
  constructor(props) {
    super(props);

    const cookieUser = cookie.load("LoggedSysuser");
    const LoggedSysuser = cookie.load("LoggedSysuser");
    this.state = {
      cookieUser,
      LoggedSysuser,
      bufferData: [],
      bufferData1: [],
      bufferData2: [],
      bufferData3: [],
      result: [],
    };
  }

  componentDidMount() {
    this.state.cookiedata = cookie.load("LoggedSysuser");
    this.funcs.init();
    this.getProfile();
  }

  onSuccess = (data) => {
    let config = {
      editAccount: false,
    };
    if (data) {
      let { result } = { ...this.state };
      Object.keys(data).forEach((key) => {
        result[key] = data[key];
      });
      config = { ...config, result };
    }
    this.setState(config);
  };

  handleSubmit = (e) => {
    const { form } = this.props;
    form.validateFields({ first: true }, (err, values) => {
      var BusinessObject = [];

      Object.entries(values).forEach(([key, value]) => {
        if (key.includes("Date")) value = value.format(dateFormat);
        BusinessObject.push({ FieldName: key, Value: value });
      });
      //  console.log(values.EndDate.format(dateFormat),values.BeginDate.format(dateFormat) );
      request
        .post("getTsTimeSummaryMonth", {
          token: this.state.cookiedata.token,
          pName: this.state.cookiedata.EmpCode,
          pPassword: "",
          pMonth: month,
          pYear: year,
          EndDate: values.EndDate.format(dateFormat),
          BeginDate: values.BeginDate.format(dateFormat),
        })
        .then(this.funcs.initSucc)
        .catch(this.funcs.initErr);
    });
  };

  getProfile() {
    this.setState({ loading: true });
    request
      .post(
        "Employees_Initialize",
        {
          token: this.state.LoggedSysuser.token,
          EmpCode: this.state.cookieUser.EmpCode,
        },
        {
          screen: "Home",
        },
      )
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
        this.setState({ result: data && data.retData.Home });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  check = () => {
    this.props.form.validateFields();
  };

  reload = () => {
    this.setState({
      reload: this.state.reload + 1,
    });
  };
  funcs = {
    changeTime: () => {
      setTimeout(() => {
        // this.table.data[this.state.activeEmployee.key].CheckIn = this.state.CheckIn;
        // this.table.data[this.state.activeEmployee.key].CheckOut = this.state.CheckOut;
        this.setState({
          visible: false,
          modalLoading: false,
        });

        if (this.state.CheckIn === "" || this.state.CheckIn === null) {
          this.setState({
            CheckIn: this.state.OnDuty,
          });
        }
        if (this.state.CheckOut === "" || this.state.CheckOut === null) {
          this.setState({
            CheckOut: this.state.OffDuty,
          });
        }
        request
          .post("ModifyhrEmpAcceptFinger", {
            token: this.state.cookiedata.token,
            pName: this.state.cookiedata.EmpCode,
            pPassword: "Azzaya123",
            pEmpCode: this.table.data[this.state.activeEmployee.key].EmpCode,
            pDepartmentID:
              this.table.data[this.state.activeEmployee.key].DepartmentID,
            pSheetDate:
              this.table.data[this.state.activeEmployee.key].SheetDate,
            pCheckIn: this.state.CheckIn,
            pCheckOut: this.state.CheckOut,
            pReason: this.state.reason,
            pReasonID: this.state.reasonID,
            pOvertime: this.state.overtime,
            pIsfullday: this.state.isfullday,
            pIswithwage: this.state.iswithwage,
            pIsExcused: this.state.IsExcused,
            pIsCheckIn: this.state.isCheckInStatus,
            pIsCheckOut: this.state.isCheckOutStatus,
            pIsSendEmail: this.state.isSendEmail,
          })
          .then(this.funcs.initSuccReq)
          .catch(this.funcs.initErr);
      }, 2000);
    },
    initSuccReq: (data) => {
      if (data.data.retType == 0) {
        this.table.data[this.state.activeEmployee.key].Pending = "Pending";
        this.funcs.init();

        this.setState({
          isCheckInStatus: true,
          isCheckOutStatus: true,
          iswithwage: false,
          isfullday: false,
          overtime: 0,
          IsExcused: "F",
          reason: "",
          reasonID: "",
        });
      } else {
        notification["error"]({
          message: "Анхаар",
          description: data.data.retDesc,
        });
      }
    },
    handleOk: () => {
      this.setState({ visible: false });
    },
    handeCancel: () => {
      this.setState({ visible: false });
    },

    init: () => {
      this.setState({ loading: true, CheckIn: "", CheckOut: "" });
      request
        .post("getTsTimeSummaryMonth", {
          token: this.state.cookiedata.token,
          pName: this.state.cookiedata.EmpCode,
          pPassword: "",
          pMonth: month,
          pYear: year,
          EndDate: "",
          BeginDate: "",
        })
        .then(this.funcs.initSucc)
        .catch(this.funcs.initErr);
    },
    initSucc: (data) => {
      if (data.data.retType == 0) {
        this.setState({
          MonthTotalWorkMinute:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].AllWorkTime,
          TodayWorkingHours:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].TodayWorkingHours,
          TotalLostMinute:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].TotalLostMinute,
          TodayLostingHours:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].TodayLostingHours,
          TotalIluuTsag:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].TotalIluuTsag,
          TotalTasalsan1:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].TotalWorkDay,
          TotalTasalsan2:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].TotalWorkedDay,
          CurrentDate:
            data.data.retData.Table[0] &&
            data.data.retData.Table[0].CurrentDate,
          bufferData: data.data.retData.Table2,
          bufferData1: data.data.retData.Table3,
          bufferData2: data.data.retData.Table4,
          bufferData3: data.data.retData.Table5,
        });
        this.table.data = data.data.retData.Table1;
        this.table.data.map((a, i) => {
          a.key = i;
          return a;
        });
        this.dataChart.data = data.data.retData.Table1;
      } else {
        notification["error"]({
          message: "Анхаар",
          description: data.data.retDesc,
        });
      }
      this.setState({
        loading: false,
      });
    },
    initErr: (data) => {
      notification["error"]({
        message: "Анхаар",
        description: data.retDescr,
      });
      this.setState({
        loading: false,
        isCheckInStatus: true,
        isCheckOutStatus: true,
        iswithwage: false,
        isfullday: false,
        overtime: 0,
        IsExcused: "F",
      });
    },
  };

  state = {
    loading: true,
    reload: 0,
    visible: false,
    editAccount: false,
    modalLoading: false,
    activeEmployee: {},
    pickedMonth: year + "." + month,
    MonthTotalWorkMinute: 0,
    TodayWorkingHours: 0,
    TotalLostMinute: 0,
    TodayLostingHours: 0,
    TotalIluuTsag: 0,
    TotalTasalsan1: 0,
    TotalTasalsan2: 0,
    CurrentDate: "",
    cookiedata: "",
    reason: "",
    reasonID: "",
    overtime: 0,
    iswithwage: false,
    isfullday: false,
    CheckIn: "09:00",
    CheckOut: "18:00",
    OnDuty: "09:00",
    OffDuty: "18:00",
    IsExcused: "F",
    currSheetDate: "",
    emptyValue: "",
    isCheckInStatus: true,
    isCheckOutStatus: true,
    activeTab: "1",
    isSendEmail: false,
  };

  table = {
    columns: [
      {
        key: "SheetDate",
        dataIndex: "SheetDate",
        title: "Огноо",
        align: "center",
      },
      {
        key: "DayOfWeek",
        dataIndex: "DayOfWeek",
        title: "Гараг",
        align: "center",
      },
      {
        key: "OnDuty",
        dataIndex: "OnDuty",
        title: "Ирэх ёстой",
        align: "center",
      },
      {
        key: "OffDuty",
        dataIndex: "OffDuty",
        title: "Явах ёстой",
        align: "center",
      },
      {
        key: "CheckIn",
        dataIndex: "CheckIn",
        title: "Ирсэн",
        align: "center",
        render: (text) => <font color="#1890ff">{text}</font>,
      },
      {
        key: "CheckOut",
        dataIndex: "CheckOut",
        title: "Явсан",
        align: "center",
        render: (text) => <font color="#1890ff">{text}</font>,
      },
      {
        key: "TotalWorkDuty",
        dataIndex: "TotalWorkDuty",
        title: "Ажлын цаг",
        align: "center",
      },
      {
        key: "TotalWorkMinute",
        dataIndex: "TotalWorkMinute",
        title: "Ажилласан цаг",
        align: "center",
      },
      // {
      //   key: "TotalWorkMinute1",
      //   dataIndex: "TotalWorkMinute1",
      //   title: "Ажилласан цаг(Шөнийн)",
      //   align: "center",
      // },
      {
        key: "TotalLostMinute",
        dataIndex: "TotalLostMinute",
        title: "Хоцорсон минут",
        align: "center",
        render: (text) => <font color="#cf1322">{text}</font>,
      },
      {
        key: "OverTimeMinute",
        dataIndex: "OverTimeMinute",
        title: "Илүү цаг",
        align: "center",
      },
      // {
      //   key: "TotalRestDay",
      //   dataIndex: "TotalRestDay",
      //   title: "Ээлжийн амралт",
      //   align: "center",
      //   render: (text) =>
      //     text == 1 ? (
      //       <Tag color="green">Ээлжийн амралттай</Tag>
      //     ) : (
      //       <Tag color="green" />
      //     ),
      // },
      {
        key: "ReasonDescr",
        dataIndex: "ReasonDescr",
        title: "Шалтгаан",
        align: "center",
        width: 220, // хүссэн хэмжээгээ тохируулж болно
        render: (text) => (
          <ATooltip
            title={text}
            placement="left" // ⬅️ tooltip-ийг зүүн талаас гаргана
            overlayStyle={{ maxWidth: 400 }} // урт текст эвтэйхэн харагдана
          >
            <div className="reason-cell">{text}</div>
          </ATooltip>
        ),
      },
      {
        key: "Pending",
        dataIndex: "Pending",
        title: "Нөхөх",
        align: "center",
        render: (a, i) => {
          console.log(a, i);
          return (
            <Button
              disabled={a === "Cancel" ? true : false}
              type={a === "Pending" ? "danger" : "primary"}
              onClick={() => {
                if (a === "Pending") {
                  return false;
                }

                // else if (i.TotalRestDay == "1"){
                // return message.warning("Ээлжийн амралттай өдрүүдэд хүсэлт хүсэх боломжгүй.");
                // }
                this.setState({
                  modalLoading: false,
                  visible: true,
                  activeEmployee: i,
                  CheckIn: i.CheckIn,
                  CheckOut: i.CheckOut,
                  OnDuty: i.OnDuty,
                  OffDuty: i.OffDuty,
                  currSheetDate: i.SheetDate,
                  isCheckInStatus: false,
                  isCheckOutStatus: false,
                  isSendEmail: false,
                });
              }}
            >
              {a}
            </Button>
          );
        },
      },
    ],
    data: [],
  };

  dataChart = { data: [] };

  scale = {
    TotalWorkMinute: {
      min: 0,
    },
  };

  handleTabChange = (key) => {
    const { form } = this.props;

    this.setState({
      activeTab: key,
      reason: "",
      reasonID: "",
      CheckIn: this.state.OnDuty || null,
      CheckOut: this.state.OffDuty || null,
      isCheckInStatus: true,
      isCheckOutStatus: true,
      iswithwage: false,
      isfullday: false,
      overtime: 0,
      IsExcused: key === "3" ? "W" : "F",
    });

    form.resetFields(["reasonID", "reasonName", "reasonID2", "reason2"]);
  };
  render() {
    const { bufferData, result, bufferData1, bufferData2, bufferData3 } =
      this.state;
    let chartIns = null;
    const { getFieldDecorator } = this.props.form;

    const chkemail = (
      <div>
        <ATooltip title="Яаралтай батлуулах хүсэлт бол үүнийг дарж имэйл илгээнэ!">
          <small style={{ paddingRight: 180 }}>
            {this.state.currSheetDate + " өдөр"}
          </small>
          <Switch
            size="default"
            checkedChildren={<Icon type="mail" />}
            unCheckedChildren={<Icon type="mail" />}
            onChange={(checked) => {
              this.setState({ isSendEmail: checked });
            }}
          ></Switch>
        </ATooltip>
      </div>
    );

    return (
      <Form onSubmit={this.handleSubmit}>
        <div>
          <div className="app">
            <div style={{ margin: "27px" }}>
              <h3>Цагийн мэдээ</h3>
              <h4>
                Хүний нөөц / Цагийн бүртгэл /
                <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
                  0,
                  -1,
                )}`}</Text>
              </h4>
              <div></div>
            </div>
            <div className="row">
              <div className="column">
                <Card
                  headStyle={{
                    color: "black",
                    weight: "bold",
                    fontSize: 30,
                  }}
                  style={{ minHeight: "180px" }}
                >
                  <Statistic
                    title="Aжилласан цаг"
                    value={
                      this.state.MonthTotalWorkMinute &&
                      this.state.MonthTotalWorkMinute > 0
                        ? this.state.MonthTotalWorkMinute
                        : ""
                    }
                    precision={2}
                    prefix={<div className="prefix">Нийт</div>}
                    valueStyle={{
                      color: "#3f8600",
                      weight: "bold",
                      fontSize: 38,
                      paddingLeft: 15,
                      position: "absolute",
                    }}
                    padding={0}
                  />
                  <div
                    className="CardValueRow"
                    style={{
                      bottom: "30px",
                      position: "absolute",
                    }}
                  >
                    <div className="CardValueColumn">Өнөөдөр</div>
                    <div className="CardValueColumn">
                      {this.state.TodayWorkingHours}
                    </div>
                  </div>
                </Card>
              </div>
              <div className="column">
                <Card
                  headStyle={{ color: "black", weight: "bold", fontSize: 30 }}
                  style={{ minHeight: "180px" }}
                >
                  <Statistic
                    title="Нийт хоцролт (минут)"
                    value={
                      this.state.TotalLostMinute &&
                      this.state.TotalLostMinute > 0
                        ? this.state.TotalLostMinute
                        : ""
                    }
                    precision={2}
                    prefix={<div className="prefix">Нийт</div>}
                    valueStyle={{
                      color: "#cf1322",
                      weight: "bold",
                      fontSize: 38,
                      paddingLeft: 15,
                      position: "absolute",
                    }}
                    padding={0}
                  />
                  <div
                    className="CardValueRow"
                    style={{
                      bottom: "30px",
                      position: "absolute",
                    }}
                  >
                    <div className="CardValueColumn">Өнөөдөр</div>
                    <div className="CardValueColumn">
                      {this.state.TodayLostingHours}
                    </div>
                  </div>
                </Card>
              </div>
              <div className="column">
                <Card
                  headStyle={{ color: "black", weight: "bold", fontSize: 30 }}
                  style={{ minHeight: "180px" }}
                >
                  <Statistic
                    title="Нийт илүү цаг"
                    value={
                      this.state.TotalIluuTsag && this.state.TotalIluuTsag > 0
                        ? this.state.TotalIluuTsag
                        : ""
                    }
                    precision={2}
                    prefix={<div className="prefix">Нийт</div>}
                    valueStyle={{
                      color: "#3f8600",
                      weight: "bold",
                      fontSize: 38,
                      paddingLeft: 15,
                      position: "absolute",
                    }}
                    padding={0}
                  />

                  <div
                    className="CardValueRow"
                    style={{
                      bottom: "30px",
                      position: "absolute",
                    }}
                  >
                    <div className="CardValueColumn">Өнөөдөр</div>
                    <div className="CardValueColumn">0.00</div>
                  </div>
                </Card>
              </div>
              <div className="column">
                <Card
                  headStyle={{ color: "black", weight: "bold", fontSize: 30 }}
                  style={{ minHeight: "180px" }}
                >
                  <Statistic
                    title="Ажлын хоног"
                    value={
                      this.state.TotalTasalsan2 && this.state.TotalTasalsan2 > 0
                        ? this.state.TotalTasalsan2
                        : ""
                    }
                    precision={0}
                    prefix={<div className="prefix">Нийт</div>}
                    valueStyle={{
                      color: "#3f8600",
                      weight: "bold",
                      fontSize: 38,
                      paddingLeft: 15,
                      position: "absolute",
                    }}
                    padding={0}
                  />
                  <div
                    className="CardValueRow"
                    style={{
                      bottom: "30px",
                      position: "absolute",
                    }}
                  >
                    <div className="CardValueColumnWork">Ажиллах</div>
                    <div className="CardValueColumn">
                      {this.state.TotalTasalsan1}
                    </div>
                  </div>
                </Card>
              </div>
              <Row
                gutter={[23, 0]}
                style={{ marginLeft: 0.5, marginRight: 0.5 }}
              >
                <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    {getFieldDecorator("BeginDate", {
                      initialValue: moment([moment().year(), moment().month()]),
                    })(
                      <DatePicker
                        placeholder="Эхлэх огноо"
                        style={{ width: "100%" }}
                        className="date-picker"
                        allowClear={false}
                        format={dateFormat}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    {getFieldDecorator("EndDate", {
                      initialValue: moment(today, dateFormat),
                    })(
                      <DatePicker
                        placeholder="Дуусах огноо"
                        style={{ width: "100%" }}
                        className="date-picker"
                        allowClear={false}
                        format={dateFormat}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                  xl={{ span: 6 }}
                  xxl={{ span: 6 }}
                >
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.handleSubmit();
                        this.setState({ loading: true });
                      }}
                      style={{
                        fontWeight: "bold",
                        background: "#0A5287",
                        borderWidth: "0px",
                        height: "52px",
                      }}
                      block
                    >
                      ХАЙХ
                    </Button>
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                  xl={{ span: 6 }}
                  xxl={{ span: 6 }}
                >
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({ editAccount: true });
                      }}
                      style={{
                        fontWeight: "bold",
                        background: "#3f8600",
                        borderWidth: "0px",
                        height: "52px",
                      }}
                      block
                    >
                      Илүү цагийн хүсэлт
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          {/*   <StickyContainer>
            <Tabs
              defaultActiveKey="1"
              renderTabBar={renderTabBar}
              className="timeSheetDiagram" //tabBarExtraContent={operations}
              size={"large"}
            >
              <TabPane
                tab="Ажилласан цаг"
                key="1"
                style={{ height: 330 }}
                style={{ background: "#fff" }}
              >
                <div className="chartDesc">
                  x - тэнхлэг өдөр, у - тэнхлэг цаг
                </div>
                <Chart
                  height={300}
                  data={this.dataChart.data}
                  scale={this.scale}
                  padding={40}
                >
                  <Axis name="SheetDay" />
                  <Axis name="TotalWorkMinute" />
                  <Tooltip
                    crosshairs={{
                      type: "x",
                    }}
                  />
                  <Geom type="interval" position="SheetDay*TotalWorkMinute" />
                </Chart>
              </TabPane>
            </Tabs>
          </StickyContainer> */}
          <div className="tablegrid">
            <Tabs
              defaultActiveKey="1"
              size={"large"}
              style={{ background: "#fff" }}
            >
              <TabPane
                tab="Ажилласан цагийн дэлгэрэнгүй"
                key="1"
                style={{
                  background: "#fff",
                  // height: 330,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingBottom: 16,
                }}
              >
                <Table
                  columns={this.table.columns}
                  dataSource={this.table.data}
                  bordered={true}
                  loading={this.state.loading}
                  className={
                    "table-head-withborder" + this.props.className
                      ? " " + this.props.className
                      : ""
                  }
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "table-row-even" : "table-row-odd"
                  }
                  size={this.props.size ? this.props.size : "default"}
                  scroll={{ x: "max-content" }}
                  pagination={{ position: "none", pageSize: 46 }}
                />
              </TabPane>
            </Tabs>
          </div>
          <Modal
            calssName="dateModal"
            width={400}
            footer={false}
            centered={true}
            title={chkemail}
            visible={this.state.visible}
            onOk={this.funcs.handleOk}
            onCancel={this.funcs.handeCancel}
            destroyOnClose={true}
          >
            <Tabs
              destroyInactiveTabPane
              defaultActiveKey={this.state.activeTab}
              onChange={this.handleTabChange}
            >
              <TabPane tab="Хуруу нөхөх" key="1">
                <div className="dateContainer">
                  <div className="timePicker">
                    <div className="timePickerTitle">
                      Ирсэн цаг
                      <Switch
                        size="small"
                        onChange={(checked) => {
                          this.setState({
                            isCheckInStatus: checked,
                          });
                        }}
                      ></Switch>
                    </div>
                    <div>
                      <TimePicker
                        allowClear={false}
                        defaultValue={moment(this.state.OnDuty, "HH:mm")}
                        disabled={!this.state.isCheckInStatus}
                        value={moment(
                          this.state.CheckIn && this.state.CheckIn.length > 0
                            ? this.state.CheckIn === null
                              ? this.state.OnDuty
                              : this.state.CheckIn
                            : this.state.OnDuty === null
                              ? moment().startOf("date")
                              : this.state.OnDuty,
                          "HH:mm",
                        )}
                        placeholder="Ирсэн цаг"
                        format={"HH:mm"}
                        onChange={(a) => {
                          a = moment(a).format("HH:mm");
                          this.setState({
                            CheckIn: a,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="timePicker">
                    <div className="timePickerTitle">
                      Явсан цаг
                      <Switch
                        size="small"
                        onChange={(checked) => {
                          this.setState({
                            isCheckOutStatus: checked,
                          });
                        }}
                      ></Switch>
                    </div>
                    <div>
                      <TimePicker
                        allowClear={false}
                        defaultValue={moment(this.state.OffDuty, "HH:mm")}
                        disabled={!this.state.isCheckOutStatus}
                        value={moment(
                          this.state.CheckOut && this.state.CheckOut.length > 0
                            ? this.state.CheckOut === null
                              ? this.state.OffDuty
                              : this.state.CheckOut
                            : this.state.OffDuty === null
                              ? moment().startOf("date")
                              : this.state.OffDuty,
                          "HH:mm",
                        )}
                        format={"HH:mm"}
                        onChange={(a) => {
                          a = moment(a).format("HH:mm");
                          this.setState({
                            CheckOut: a,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Form.Item {...formTailLayout}>
                  <div className="timeReasonTitle1">
                    {getFieldDecorator("reasonID", {
                      rules: [
                        {
                          required: true,
                          message: "Шалтгаан сонгоно уу!",
                        },
                      ],
                    })(
                      <Select
                        allowClear={true}
                        style={{ width: "100%" }}
                        placeholder="Шалтгаан сонгох"
                        onChange={(value) => {
                          this.setState({
                            reasonID: value,
                          });
                        }}
                      >
                        {bufferData
                          .filter((item) =>
                            ["01", "02", "03", "04", "06", "07", "08"].includes(
                              String(item.ReasonID).padStart(2, "0"),
                            ),
                          )
                          .map((item) => {
                            const id = String(item.ReasonID).padStart(2, "0");
                            return (
                              <Option key={id} value={id}>
                                {id} - {item.Descr}
                              </Option>
                            );
                          })}
                      </Select>,
                    )}
                  </div>
                </Form.Item>
                <Form.Item {...formTailLayout} className="formItem">
                  <div className="timeReasonTitle">
                    {getFieldDecorator("reasonName", {
                      rules: [
                        {
                          required: true,
                          message: "Шалтгаан оруулна уу!",
                        },
                      ],
                    })(
                      <TextArea
                        className="ReasonArea"
                        rows={4}
                        placeholder="Шалтгаан"
                        onChange={(a) => {
                          this.setState({
                            reason: a.target.value,
                          });
                        }}
                      />,
                    )}
                  </div>
                </Form.Item>
                <div className="timePickerButton">
                  <Popconfirm
                    placement="top"
                    title={
                      "Оруулсан мэдээлэл зөв үү? Илгээсэн мэдээллийг засварлах боломжгүй."
                    }
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => {
                      if (
                        (this.state.reason === "" &&
                          this.state.reasonID === "") ||
                        (this.state.isCheckInStatus === false &&
                          this.state.isCheckOutStatus === false)
                      ) {
                        this.check();
                        return;
                      }

                      if (this.state.currSheetDate > this.state.CurrentDate) {
                        openNotificationWithIcon("warning");
                        return;
                      }
                      this.setState({
                        modalLoading: true,
                        overtime: 0,
                        isfullday: "",
                        iswithwage: "",
                        IsExcused: "F",
                      });

                      this.funcs.changeTime();
                    }}
                  >
                    <Button type="primary">Илгээх</Button>
                  </Popconfirm>
                </div>
                <div
                  className="dateLoading"
                  active={this.state.modalLoading ? "1" : "0"}
                >
                  <Spin />
                </div>
              </TabPane>
              {/* <TabPane tab="Илүү цаг" key="2">
                <div className="dateContainer">
                  <div className="timePicker">
                    <div className="timePickerTitle">Ирсэн цаг</div>
                    <div>
                      <TimePicker
                      allowClear={false}
                        defaultValue={moment(this.state.OnDuty, "HH:mm")}
                        value={moment(
                          this.state.CheckIn && this.state.CheckIn.length > 0 ? 
                            this.state.CheckIn === null
                            ? this.state.OnDuty
                            : this.state.CheckIn
                          : this.state.OnDuty === null
                          ? moment().startOf('date') : this.state.OnDuty,
                          "HH:mm"
                        )}
                        format={"HH:mm"}
                        onChange={(a) => {
                          a = moment(a).format("HH:mm");
                          this.setState({
                            CheckIn: a,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="timePicker">
                    <div className="timePickerTitle">Явсан цаг</div>
                    <div>
                      <TimePicker
                        allowClear={false}
                        defaultValue={moment(this.state.OffDuty, "HH:mm")}
                        value={moment(
                        this.state.CheckOut && this.state.CheckOut.length > 0 ? 
                            this.state.CheckOut === null
                            ? this.state.OffDuty
                            : this.state.CheckOut
                          : this.state.OffDuty === null
                          ? moment().startOf('date') : this.state.OffDuty,
                          "HH:mm"
                        )}
                        format={"HH:mm"}
                        onChange={(a) => {
                          a = moment(a).format("HH:mm");
                          this.setState({
                            CheckOut: a,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                 <div className="overtime">
                  <div className="overtimeTitle">Илүү цаг (минут) :</div>
                  <InputNumber
                    className="overtimeValue"
                    autoFocus={true}
                    min={0}
                    max={1000}
                    defaultValue={0}
                    onChange={(value) => {
                      this.setState({
                        overtime: value,
                      });
                    }}
                  />
                </div> 
                <Form.Item {...formTailLayout}>
                  <div className="timeReasonTitle1">
                    {getFieldDecorator("reasonID1", {
                      rules: [
                        {
                          required: true,
                          message: "Шалтгаан сонгоно уу!",
                        },
                      ],
                    }
                    )(
                      <Select
                        allowClear={true}
                        style={{ width: '100%' }}
                        placeholder="Шалтгаан сонгох"
                        onChange={(value) => {
                          this.setState({
                            reasonID: value,
                          });
                        }}
                      >
                        {bufferData.map((item) => (
                          <Option key={item.ReasonID}>
                            {item.ReasonID} - {item.Descr}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </Form.Item>
                <Form.Item {...formTailLayout} className="formItem">
                  <div className="timeReasonTitle">
                    {getFieldDecorator("reason1", {
                      rules: [
                        {
                          required: (this.state.activeTab = 2 ? true : false),
                          message: "Шалтгаан оруулна уу!",
                        },
                      ],
                    })(
                      <TextArea
                        className="ReasonArea"
                        placeholder="Тайлбар"
                        onChange={(a) => {
                          this.setState({
                            reason: a.target.value,
                          });
                        }}
                      />
                    )}
                  </div>
                </Form.Item>
                <div className="timePickerButton">
                  <Popconfirm
                    placement="top"
                    title={
                      "Оруулсан мэдээлэл зөв үү? Илгээсэн мэдээллийг засварлах боломжгүй."
                    }
                    onConfirm
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => {
                      // if (this.state.overtime === 0) {
                      //   return;
                      // }
                      if (this.state.reason === "" && this.state.reasonID === "") {
                        this.check();
                        return;
                      }
                      this.setState({
                        isCheckInStatus: false,
                        isCheckOutStatus: false,
                        modalLoading: true,
                        isfullday: "",
                        iswithwage: "",
                        IsExcused: "O",
                      });
                      this.funcs.changeTime();
                    }}
                  >
                    <Button type="primary">Илгээх</Button>
                  </Popconfirm>
                </div>
                <div
                  className="dateLoading"
                  active={this.state.modalLoading ? "1" : "0"}
                >
                  <Spin />
                </div>
              </TabPane> */}
              <TabPane tab="Чөлөө" key="3">
                <div className="dateContainer">
                  <div className="timePicker">
                    <div className="timePickerTitle">Эхлэх цаг</div>
                    <div>
                      <TimePicker
                        allowClear={false}
                        defaultValue={moment(this.state.OnDuty, "HH:mm")}
                        disabled={this.state.isfullday}
                        value={moment(
                          this.state.CheckIn && this.state.CheckIn.length > 0
                            ? this.state.CheckIn === null
                              ? this.state.OnDuty
                              : this.state.CheckIn
                            : this.state.OnDuty === null
                              ? moment().startOf("date")
                              : this.state.OnDuty,
                          "HH:mm",
                        )}
                        format={"HH:mm"}
                        onChange={(a) => {
                          a = moment(a).format("HH:mm");
                          this.setState({
                            CheckIn: a,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="timePicker">
                    <div className="timePickerTitle">Дуусах цаг</div>
                    <div>
                      <TimePicker
                        allowClear={false}
                        defaultValue={moment(this.state.OffDuty, "HH:mm")}
                        disabled={this.state.isfullday}
                        value={moment(
                          this.state.CheckOut && this.state.CheckOut.length > 0
                            ? this.state.CheckOut === null
                              ? this.state.OffDuty
                              : this.state.CheckOut
                            : this.state.OffDuty === null
                              ? moment().startOf("date")
                              : this.state.OffDuty,
                          "HH:mm",
                        )}
                        format={"HH:mm"}
                        onChange={(a) => {
                          a = moment(a).format("HH:mm");
                          this.setState({
                            CheckOut: a,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="overtime">
                  <div className="Checkbox">
                    Цалинтай эсэх :{" "}
                    <Switch
                      size="small"
                      disabled
                      onChange={(checked) => {
                        this.setState({
                          iswithwage: checked,
                        });
                      }}
                    ></Switch>
                  </div>
                  <div className="CheckboxFullDay">
                    Бүтэн өдөр :{" "}
                    <Switch
                      size="small"
                      onChange={(checked) => {
                        this.setState({
                          isfullday: checked,
                        });
                      }}
                    ></Switch>{" "}
                  </div>
                </div>
                <Form.Item {...formTailLayout}>
                  <div className="timeReasonTitle1">
                    {getFieldDecorator("reasonID2", {
                      rules: [
                        {
                          required: true,
                          message: "Шалтгаан сонгоно уу!",
                        },
                      ],
                    })(
                      <Select
                        allowClear={true}
                        style={{ width: "100%" }}
                        placeholder="Шалтгаан сонгох"
                        onChange={(value) => {
                          this.setState({
                            reasonID: value,
                          });
                        }}
                      >
                        {bufferData
                          .filter((item) =>
                            ["09", "10", "11", "12", "15", "16", "17"].includes(
                              String(item.ReasonID).padStart(2, "0"),
                            ),
                          )
                          .map((item) => (
                            <Option
                              key={String(item.ReasonID).padStart(2, "0")}
                              value={String(item.ReasonID).padStart(2, "0")} // ✅ reasonID-г яг иймээр авна
                            >
                              {String(item.ReasonID).padStart(2, "0")} -{" "}
                              {item.Descr}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </div>
                </Form.Item>
                <Form.Item {...formTailLayout} className="formItem">
                  <div className="timeReasonTitle">
                    {getFieldDecorator("reason2", {
                      rules: [
                        {
                          required: (this.state.activeTab === "3" ? true : false),
                          message: "Шалтгаан оруулна уу!",
                        },
                      ],
                    })(
                      <TextArea
                        className="ReasonArea"
                        placeholder="Тайлбар"
                        onChange={(a) => {
                          this.setState({
                            reason: a.target.value,
                          });
                        }}
                      />,
                    )}
                  </div>
                </Form.Item>
                <div className="timePickerButton">
                  <Popconfirm
                    placement="top"
                    title={
                      "Оруулсан мэдээлэл зөв үү? Илгээсэн мэдээллийг засварлах боломжгүй."
                    }
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => {
                      if (
                        this.state.reason === "" &&
                        this.state.reasonID === ""
                      ) {
                        this.check();
                        return;
                      }
                      this.setState({
                        modalLoading: true,
                        overtime: 0,
                        IsExcused: "W",
                        isCheckInStatus: true,
                        isCheckOutStatus: true,
                      });

                      if (this.state.isfullday == true) {
                        this.setState({
                          CheckOut: this.state.OffDuty,
                          CheckIn: this.state.OnDuty,
                        });
                      }
                      this.funcs.changeTime();
                    }}
                  >
                    <Button type="primary">Илгээх</Button>
                  </Popconfirm>
                </div>
                <div
                  className="dateLoading"
                  active={this.state.modalLoading ? "1" : "0"}
                >
                  <Spin />
                </div>
              </TabPane>
            </Tabs>
          </Modal>
        </div>
        {this.state.editAccount && (
          <Overt
            data={{
              CheckOut: this.state.CheckOut,
              CheckIn: this.state.CheckIn,
              OnDuty: this.state.OnDuty,
              OffDuty: this.state.OffDuty,
            }}
            visible={this.state.editAccount}
            onSuccess={this.onSuccess}
          />
        )}
      </Form>
    );
  }
}
const WrappedHomeForm = Form.create({ name: "Home" })(compon);

export default WrappedHomeForm;
