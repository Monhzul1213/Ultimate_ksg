import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Modal,
  Row,
  Col,
  Spin,
  notification,
  TimePicker,
  Select,
} from "antd";
import React from "react";
import request from "./../insurance/PostRequest";
import cookie from "react-cookies";
import "./AccountEditModal.css";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const dateFormat = "YYYY.MM.DD";
class App extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      data: props.data,
      visible: props.visible,
      loading: false,
      LoggedSysuser,
      cookieUser,
      shdate: "",
      queryID: "uspts_UPDATE_Overtime_INOUTTime",
      dataEmail: [],
    };
  }

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "Web_Feedback" }),
      })
      .then((res) => {
        const data = res.data;

        const emailData = data;
        this.setState({ dataEmail: emailData });
      });
  }

  handleSelectChange = (value, update) => {
    console.log(value);
    this.setState({ shdate: moment(value).format(dateFormat) });

    var BusinessObject = [];

    BusinessObject.push({
      FieldName: "SheetDate",
      Value: moment(value).format(dateFormat),
    });
    BusinessObject.push({
      FieldName: "EmpCode",
      Value: this.state.cookieUser.EmpCode,
    });
    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: this.state.queryID, BusinessObject },
          replacer
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
        if (update) {
          if (
            data.retData &&
            data.retData.Table &&
            data.retData.Table.length > 0
          ) {
            if (this.state.filterResult) {
              filterResult = [...this.state.filterResult];
              Object.keys(data.retData.Table[0]).forEach((key) => {
                filterResult[curIndex][key] = data.retData.Table[0][key];
              });
            } else filterResult = data.retData.Table;
          }
        } else
          filterResult =
            data.retData && data.retData.Table ? data.retData.Table : [];
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

  handleOk = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      console.log(values);
      if (errors) return;

      var Table = [];
      Table.push({
        EmpCode: this.state.cookieUser.EmpCode,
        SheetDate: this.state.shdate,
        CheckInTime: moment(values.CheckInTime).format("HH:mm"),
        CheckOutTime: moment(values.CheckOutTime).format("HH:mm"),
        Reason: values.reasondescr,
        CheckIn: "N",
        CheckOut: "N",
        IsExcused: "O",
        UserID: this.state.cookieUser.EmpCode,
      });
      request
        .post("Execute_Query", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            QueryID: "usphr_U_hrEmpAcceptFinger_MobileService",
            Table,
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

          form.resetFields();
          notification["success"]({
            message: "",
            description: "Амжилттай хадгаллаа.",
          });

          request
            .post("Send_Email", {
              token: this.state.LoggedSysuser.token,
              recipient: "nanzaddorj@ultimate.mn",
              subject:
                this.state.cookieUser.EmpCode +
                " " +
                "кодтой ажилтан" +
                " " +
                this.state.cookieUser.EmpFName +
                " " +
                "хүсэлт илгээлээ.",
              body: values.reasondescr,
            })
            .then((res) => {
              const data = res.data;
              if (data.retType !== 0) {
                this.setState({ loading: false });
                notification["error"]({
                  message: "Анхаар",
                  description: "data.retDesc",
                });
                return;
              }
              this.setState({ loading: false });
              notification["success"]({
                message: "",
                description: "Амжилттай мэйл илгээлээ.",
              });
            })
            .catch((error) => {
              this.setState({ loading: false });
              console.error(error);
            });

          this.setState({ visible: false, shdate: "" });
          this.props.onSuccess(res.data.retData);
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    });
  };

  handleCancel = (e) => {
    this.props.onSuccess();
  };

  render() {
    console.log(this.state.filterResult);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const formLayount = {
      labelCol: 24,
      wrapperCol: 24,
    };

    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 12 }, //≥576px
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];

    return (
      <div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Илгээх"
          cancelText="Болих"
          width="500px"
          bodyStyle={{ padding: "30px" }}
        >
          <Spin spinning={this.state.loading} style={{ height: "100%" }}>
            <Form {...formLayount}>
              <h3
                align="center"
                style={{ marginBottom: "20px", fontSize: "16pt" }}
              >
                <b>Илүү цагийн хүсэлт</b>
              </h3>
              <Row gutter={35} type="flex">
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Ажилласан өдөр
                    </p>
                    {getFieldDecorator("sheetdate", { rules: required })(
                      <DatePicker
                        placeholder="Ажилласан өдөр"
                        onChange={this.handleSelectChange}
                        style={{
                          width: "100%",
                          fontSize: "13pt",
                          ontFamily: "Arial",
                        }}
                        size="large"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Ирсэн цаг
                    </p>
                    {getFieldDecorator("CheckInTime", {
                      initialValue: moment(
                        this.state.data &&
                          this.state.filterResult &&
                          this.state.filterResult.length > 0
                          ? this.state.filterResult[0].OutTime
                          : moment("09:00", "HH:mm"),
                        "HH:mm"
                      ),
                      rules: required,
                    })(
                      <TimePicker
                        placeholder="Ирсэн цаг"
                        format={"HH:mm"}
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[35]}>
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Явсан цаг
                    </p>
                    {getFieldDecorator("CheckOutTime", {
                      initialValue: moment(
                        this.state.data &&
                          this.state.filterResult &&
                          this.state.filterResult.length > 0
                          ? this.state.filterResult[0].OutTime
                          : moment("18:00", "HH:mm"),
                        "HH:mm"
                      ),
                      rules: required,
                    })(
                      <TimePicker
                        placeholder="Явсан цаг"
                        format={"HH:mm"}
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Тайлбар
                    </p>
                    {getFieldDecorator("reasondescr", { rules: required })(
                      <TextArea
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                          height: "40px",
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[100]}>
                <Col>
                  <Form.Item>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      И-мэйл
                    </p>
                    {getFieldDecorator("WorkMail")(
                      <Select
                        size="large"
                        placeholder="Имэйл хаяг"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      >
                        {(this.state &&
                        this.state.dataEmail &&
                        this.state.dataEmail.retData &&
                        Array.isArray(this.state.dataEmail.retData.Table)
                          ? this.state.dataEmail.retData.Table
                          : []
                        ).map((item, index) => (
                          <Option
                            key={(item && item.WorkMail) || index}
                            value={(item && item.WorkMail) || ""}
                          >
                            {(item && item.WorkMail) || ""}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

const WrappedDynamicRule = Form.create({ name: "dynamic_rule" })(App);

var curIndex = -1;

export default class Overtaime extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <WrappedDynamicRule
        data={this.props.data}
        visible={this.props.visible}
        onSuccess={this.props.onSuccess}
      />
    );
  }
}
