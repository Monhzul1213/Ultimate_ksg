import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Modal,
  Row,
  Col,
  notification,
  Avatar,
  Spin,
  DatePicker,
  Upload,
  message,
  Icon,
} from "antd";
import React from "react";
import request from "./../insurance/PostRequest";
import cookie from "react-cookies";
import moment from "moment";
import "./ProfileFullEditModal.css";

const { Option } = Select;
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
      queryID: "Web_EmployeesRelax",
    };
  }

  handleOk = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      this.setState({ loading: true });
      let EmpRelax = [...this.state.data.EmpRelax];
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
    var EmpRelax;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const formLayount = {
      labelCol: 24,
      wrapperCol: 24,
    };

    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];

    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 24 }, //≥576px
    };

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
                <b>Хүсэлт шийдвэрлэх</b>
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
                      Амралт эдлэх ажлын хоног
                    </p>
                    {getFieldDecorator("RelaxDayCount", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0 &&
                        this.state.data.EmpRelax[0].RelaxDayCount,
                    })(
                      <Input
                        size="large"
                        disabled
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
                      Эхлэх онгоо
                    </p>
                    {getFieldDecorator("BeginDate", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0 &&
                        moment(
                          this.state.data.EmpRelax[0].BeginDate,
                          "YYYY-MM-DDTHH:mm:ss.sssZ"
                        ),
                    })(
                      <DatePicker
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        onChange={this.onChangeBeginDate}
                        disabled
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
                      Дуусах огноо
                    </p>
                    {getFieldDecorator("EndDate", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpRelax &&
                        this.state.data.EmpRelax.length > 0 &&
                        moment(
                          this.state.data.EmpRelax[0].EndDate,
                          "YYYY-MM-DDTHH:mm:ss.sssZ"
                        ),
                    })(
                      <DatePicker
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        disabled
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
                      Статус сонгох
                    </p>
                    <div className="select-fontsize">
                      {getFieldDecorator("Status", {
                        initialValue:
                          this.state.data &&
                          this.state.data.EmpRelax &&
                          this.state.data.EmpRelax[0] &&
                          this.state.data.EmpRelax[0].Status.toString(),
                      })(
                        <Select
                          size="large"
                          style={{ marginBottom: "8px" }}
                          onChange={() => {
                            const RowStatus =
                              this.props.form.getFieldValue("RowStatus");
                            if (RowStatus !== "I")
                              this.props.form.setFieldsValue({
                                RowStatus: "U",
                              });
                          }}
                        >
                          {this.state.data &&
                            this.state.data.Relax &&
                            this.state.data.Relax.map((item, index) => (
                              <Option key={item.ValueNum}>
                                {item.ValueStr1}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </div>
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
                    {getFieldDecorator("Note")(
                      <Input
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        onChange={() => {
                          const RowStatus =
                            this.props.form.getFieldValue("RowStatus");
                          if (RowStatus !== "I")
                            this.props.form.setFieldsValue({ RowStatus: "U" });
                        }}
                      />
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
              {getFieldDecorator("RowRecID", {
                initialValue:
                  this.state.data &&
                  this.state.data.EmpRelax &&
                  this.state.data.EmpRelax[0] &&
                  this.state.data.EmpRelax[0].RowRecID,
              })(<Input type="hidden" />)}
              {getFieldDecorator("EmpCode", {
                initialValue:
                  this.state.data &&
                  this.state.data.EmpRelax &&
                  this.state.data.EmpRelax[0].EmpCode,
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

export default class EmpsLeaveModal extends React.Component {
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
