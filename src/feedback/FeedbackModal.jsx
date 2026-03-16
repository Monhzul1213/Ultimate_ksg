import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  Row,
  Col,
  notification,
  Spin,
  DatePicker,
} from "antd";
import React from "react";
import request from "./../insurance/PostRequest";
import cookie from "react-cookies";
import moment from "moment";
import "./FeedbackModal.css";

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = "YYYY.MM.DD";
class App extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      data: props.data,
      visible: props.visible,
      loading: false,
      LoggedSysuser,
      profile_image: undefined,
      queryID: "Web_FReq",
    };
  }

  handleOk = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      this.setState({ loading: true });
      let EmpRelax = [...this.state.data.EmpRelax];
      if (EmpRelax.length == 0)
        EmpRelax.push({ EmpCode: this.state.LoggedSysuser.EmpCode });
      Object.keys(values).forEach((key) => {
        if (moment.isMoment(values[key]))
          EmpRelax[0][key] = values[key].format(dateFormat);
        else EmpRelax[0][key] = values[key];
      });
      request
        .post("Execute_Query", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({ QueryID: this.state.queryID, EmpRelax }),
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
          this.setState({ loading: false });
          notification["success"]({
            message: "",
            description: "Амжилттай хадгаллаа.",
          });
          this.props.onSuccess(res.data.retData);
        });
      request
        .post("Send_Email", {
          token: this.state.LoggedSysuser.token,
          recipient: values.WorkMail,
          subject:
            values.EmpCode +
            " " +
            "кодтой ажилтан" +
            " " +
            values.EmpFName +
            " " +
            "хүсэлт илгээлээ - " +
            " " +
            values.Descr,
          body: values.ReqNote,
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
    });
  };

  handleCancel = (e) => {
    this.props.onSuccess();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const formLayount = {
      labelCol: 24,
      wrapperCol: 24,
    };
    const dateFormat = "YYYY.MM.DD";

    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];

    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 24 }, //≥576px
    };
    const greaterThan = [
      {
        validator: (rule, value, callback) => {
          if (
            this.state.data &&
            this.state.data.Relax &&
            this.state.data.Relax.length > 0 &&
            this.state.data.Relax[0].LeftRelaxDays >= value
          ) {
            callback();
            return;
          }
          callback("Үлдсэн амралтын хоногоос их хоног оруулсан байна.");
        },
        required: true,
      },
    ];
    return (
      <div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Хадгалах"
          footer={null}
          bodyStyle={{ padding: "30px" }}
        >
          <Spin spinning={this.state.loading} style={{ height: "100%" }}>
            <Form {...formLayount}>
              <h3
                align="center"
                style={{
                  marginBottom: "30px",
                  fontSize: "16pt",
                  fontFamily: "Arial",
                }}
              >
                <b>Хүсэлт нэмэх1</b>
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
                      Хүсэлт гаргасан огноо
                    </p>
                    {getFieldDecorator("CreateDate", {
                      initialValue: moment(today, dateFormat),
                    })(
                      <DatePicker
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        format={dateFormat}
                        disabled
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
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
                      Шийдвэрлүүлэх эцсийн хугацаа
                    </p>
                    {getFieldDecorator("EndDate", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0
                          ? moment(
                              this.state.data.EmpRelax[0].EndDate,
                              "YYYY.MM.DD"
                            )
                          : "",
                    })(
                      <DatePicker
                        size="large"
                        placeholder="Огноо сонгох"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        format={dateFormat}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
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
                      Хүсэлтийн зэрэг
                    </p>
                    {getFieldDecorator("Degree", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0
                          ? this.state.data.EmpRelax[0].DegreeName
                          : "",
                    })(
                      <Select
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      >
                        {this.state.data &&
                          this.state.data.Degree &&
                          this.state.data.Degree.map((item, index) => (
                            <Option key={item.ValueNum}>
                              {item.ValueStr1}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
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
                      Хүсэлтийн төрөл
                    </p>
                    {getFieldDecorator("FType", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0
                          ? this.state.data.EmpRelax[0].TypeName
                          : "",
                    })(
                      <Select
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      >
                        {this.state.data &&
                          this.state.data.Type &&
                          this.state.data.Type.map((item, index) => (
                            <Option key={item.ValueNum}>
                              {item.ValueStr1}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
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
                      Хүсэлтийн агуулга
                    </p>
                    {getFieldDecorator("Descr", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0
                          ? this.state.data.EmpRelax[0].FName
                          : "",
                    })(
                      <TextArea
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
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
                    {getFieldDecorator("ReqNote", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0
                          ? this.state.data.EmpRelax[0].ReqNote
                          : "",
                    })(
                      <TextArea
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
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
                      И-мэйл
                    </p>
                    {getFieldDecorator("WorkMail")(
                      <Select
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      >
                        {this.state.data &&
                          this.state.data.Email &&
                          this.state.data.Email.map((item, index) => (
                            <Option key={item.WorkMail}>{item.WorkMail}</Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {getFieldDecorator("RowStatus", {
                initialValue:
                  this.state.data &&
                  this.state.data.EmpRelax &&
                  this.state.data.EmpRelax[0]
                    ? this.state.data.EmpRelax[0].RowStatus
                    : "I",
              })(<Input type="hidden" />)}
              {getFieldDecorator("RowFID", {
                initialValue:
                  this.state.data &&
                  this.state.data.EmpRelax &&
                  this.state.data.EmpRelax[0] &&
                  this.state.data.EmpRelax[0].RowRecID,
              })(<Input type="hidden" />)}
              {getFieldDecorator("EmpCode", {
                initialValue: this.state.data && this.state.data.EmpCode,
              })(<Input type="hidden" />)}
              {getFieldDecorator("EmpFName", {
                initialValue: this.state.data && this.state.data.EmpFName,
              })(<Input type="hidden" />)}
              <Form.Item
                wrapperCol={{
                  xs: {
                    span: 24,
                    offset: 7,
                  },
                  sm: { span: 17, offset: 6 },
                }}
                style={{ marginBottom: "0px" }}
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={this.handleOk}
                  style={{
                    width: "250px",
                    height: "50px",
                    marginTop: "40px",
                    marginBottom: "0px",
                    background: "#0A5287",
                    border: "none",
                  }}
                >
                  <p style={{ marginBottom: "2px", fontSize: "14pt" }}>
                    <b>Хадгалах</b>
                  </p>
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

const WrappedDynamicRule = Form.create({ name: "dynamic_rule" })(App);

export default class RequestModal extends React.Component {
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
