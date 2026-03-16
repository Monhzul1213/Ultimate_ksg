import React from "react";
import {
  Form,
  Input,
  Icon,
  Button,
  Modal,
  Card,
  Col,
  Row,
  Select,
  Spin,
  DatePicker,
  notification,
} from "antd";
import moment from "moment";
import "./EmployeePhysicalEditModal.css";
import request from "./../insurance/PostRequest";
import cookie from "react-cookies";

const { Option } = Select;

class App extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      data: props.data,
      visible: props.visible,
      loading: false,
      LoggedSysuser,
    };
  }
  handleOk = (e) => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const { names } = values;
        this.setState({ loading: true });
        request
          .post("Profile_Modify", {
            token: this.state.LoggedSysuser.token,
            json: JSON.stringify({
              BusinessObject: { ProfileType: "Education" },
              Education: names,
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
            this.setState({ visible: false });
            this.props.onSuccess(res.data.retData);
          })
          .catch((error) => {
            this.setState({ loading: false });
            console.error(error);
          });
      }
    });
  };

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");

    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({ [`names[${k}].RowStatus`]: "D" });
  };

  add = () => {
    const { form } = this.props;
    const { keys, names } = form.getFieldsValue();
    const nextKeys = keys.concat(keys.length);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleCancel = (e) => {
    this.props.onSuccess();
  };

  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;

    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 12 }, //≥576px
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 8 },
      },
    };

    const dateFormat = "YYYY.MM.DD";

    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];

    const data = {
      keys:
        this.state.data && this.state.data.Education
          ? this.state.data.Education.map((item, index) => index)
          : [],
      names:
        this.state.data && this.state.data.Education
          ? this.state.data.Education
          : [],
    };

    getFieldDecorator("keys", { initialValue: data.keys });
    const { keys, names } = getFieldsValue();

    const formItems = keys.map((k, index) => {
      const RowStatus = names && names[k] && names[k].RowStatus;
      return (
        <Card key={k} style={{ margin: "2px", marginTop: "20px" }}>
          <Form.Item
            key={k}
            style={{
              marginBottom: "0px",
              display: RowStatus === "D" ? "none" : "block",
            }}
          >
            <h3 style={{ marginBottom: "15px", fontSize: "14pt" }}>
              Боловсролын мэдээлэл
              <a className="delete-icon">
                <i className="card-title">
                  <Icon
                    style={{ color: "#ff3300" }}
                    type="delete"
                    onClick={() => this.remove(k)}
                  />
                </i>
              </a>
            </h3>
            <Row gutter={[25, 30]} type="flex">
              <Col {...columnConfig}>
                {getFieldDecorator(`names[${k}].SchoolName`, {
                  initialValue:
                    data.names && data.names[k] && data.names[k].SchoolName,
                  rules: RowStatus === "D" ? [] : required,
                })(
                  <Input
                    placeholder="Сургуулийн нэр"
                    size="large"
                    style={{ fontSize: "13pt", fontFamily: "Arial" }}
                    onChange={() => {
                      const RowStatus = this.props.form.getFieldValue(
                        `names[${k}].RowStatus`
                      );
                      if (RowStatus !== "I")
                        this.props.form.setFieldsValue({
                          [`names[${k}].RowStatus`]: "U",
                        });
                    }}
                  />
                )}
              </Col>
              <Col {...columnConfig}>
                {getFieldDecorator(`names[${k}].ProfessionID`, {
                  initialValue:
                    data.names && data.names[k] && data.names[k].ProfessionID,
                  rules: RowStatus === "D" ? [] : required,
                })(
                  <Select
                    placeholder="Эзэмшсэн мэргэжил"
                    size="large"
                    style={{ fontSize: "13pt", fontFamily: "Arial" }}
                    onChange={() => {
                      const RowStatus = this.props.form.getFieldValue(
                        `names[${k}].RowStatus`
                      );
                      if (RowStatus !== "I")
                        this.props.form.setFieldsValue({
                          [`names[${k}].RowStatus`]: "U",
                        });
                    }}
                  >
                    {this.state.data &&
                      this.state.data.Profession &&
                      this.state.data.Profession.map((item, index) => (
                        <Option key={item.ProfessionID}>{item.Descr}</Option>
                      ))}
                  </Select>
                )}
              </Col>
            </Row>
            <Row gutter={[25, 30]} type="flex">
              <Col {...columnConfig}>
                {getFieldDecorator(`names[${k}].DegreeID`, {
                  initialValue:
                    data.names && data.names[k] && data.names[k].DegreeID,
                  rules: RowStatus === "D" ? [] : required,
                })(
                  <Select
                    placeholder="Зэрэг"
                    size="large"
                    style={{ fontSize: "13pt", fontFamily: "Arial" }}
                    onChange={() => {
                      const RowStatus = this.props.form.getFieldValue(
                        `names[${k}].RowStatus`
                      );
                      if (RowStatus !== "I")
                        this.props.form.setFieldsValue({
                          [`names[${k}].RowStatus`]: "U",
                        });
                    }}
                  >
                    {this.state.data &&
                      this.state.data.Degree &&
                      this.state.data.Degree.map((item, index) => (
                        <Option key={item.DegreeID}>{item.Descr}</Option>
                      ))}
                  </Select>
                )}
              </Col>
              <Col {...columnConfig}>
                {getFieldDecorator(`names[${k}].CertificateNo`, {
                  initialValue:
                    data.names && data.names[k] && data.names[k].CertificateNo,
                  rules: RowStatus === "D" ? [] : required,
                })(
                  <Input
                    placeholder="Диплом, сетификатын дугаар"
                    size="large"
                    style={{ fontSize: "13pt", fontFamily: "Arial" }}
                    onChange={() => {
                      const RowStatus = this.props.form.getFieldValue(
                        `names[${k}].RowStatus`
                      );
                      if (RowStatus !== "I")
                        this.props.form.setFieldsValue({
                          [`names[${k}].RowStatus`]: "U",
                        });
                    }}
                  />
                )}
              </Col>
            </Row>
            <Row gutter={[25, 30]} type="flex">
              <Col {...columnConfig}>
                {getFieldDecorator(`names[${k}].FromYear`, {
                  initialValue:
                    data.names &&
                    data.names[k] &&
                    moment(data.names[k].FromYear, "YYYY-MM-DDTHH:mm:ss.sssZ"),
                  rules: RowStatus === "D" ? [] : required,
                })(
                  <DatePicker
                    style={{
                      width: "100%",
                      fontSize: "13pt",
                      fontFamily: "Arial",
                    }}
                    format={dateFormat}
                    size="large"
                    onChange={() => {
                      const RowStatus = this.props.form.getFieldValue(
                        `names[${k}].RowStatus`
                      );
                      if (RowStatus !== "I")
                        this.props.form.setFieldsValue({
                          [`names[${k}].RowStatus`]: "U",
                        });
                    }}
                  />
                )}
              </Col>
              <Col {...columnConfig}>
                {getFieldDecorator(`names[${k}].ToYear`, {
                  initialValue:
                    data.names &&
                    data.names[k] &&
                    moment(data.names[k].ToYear, "YYYY-MM-DDTHH:mm:ss.sssZ"),
                  rules: RowStatus === "D" ? [] : required,
                })(
                  <DatePicker
                    style={{
                      width: "100%",
                      fontSize: "13pt",
                      fontFamily: "Arial",
                    }}
                    format={dateFormat}
                    size="large"
                    onChange={() => {
                      const RowStatus = this.props.form.getFieldValue(
                        `names[${k}].RowStatus`
                      );
                      if (RowStatus !== "I")
                        this.props.form.setFieldsValue({
                          [`names[${k}].RowStatus`]: "U",
                        });
                    }}
                  />
                )}
              </Col>
            </Row>

            {getFieldDecorator(`names[${k}].RowStatus`, {
              initialValue:
                data.names && data.names[k] ? data.names[k].RowStatus : "I",
            })(<Input type="hidden" />)}
            {getFieldDecorator(`names[${k}].RowRecID`, {
              initialValue:
                data.names && data.names[k] && data.names[k].RowRecID,
            })(<Input type="hidden" />)}
            {getFieldDecorator(`names[${k}].EmpCode`, {
              initialValue: this.state.data && this.state.data.EmpCode,
            })(<Input type="hidden" />)}
          </Form.Item>
        </Card>
      );
    });
    return (
      <div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width="800px"
          bodyStyle={{ padding: "30px" }}
        >
          <Spin spinning={this.state.loading} style={{ height: "100%" }}>
            <h3
              align="center"
              style={{ marginBottom: "10px", fontSize: "16pt" }}
            >
              <b>Боловсролын мэдээлэл</b>
            </h3>

            <Form>
              {formItems}
              <Form.Item style={{ marginBottom: "0px" }}>
                <Form.Item
                  style={{
                    textAlign: "Right",
                    marginBottom: "-10px",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    type="link"
                    onClick={this.add}
                    style={{ fontSize: "13pt" }}
                  >
                    <Icon type="plus-circle" /> Нэмэх
                  </Button>
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    xs: {
                      span: 24,
                      offset: 7,
                    },
                    sm: { span: 17, offset: 8 },
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
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

const WrappedDynamicRule = Form.create({ name: "dynamic_rule" })(App);

export default class EmployeePhysicalEditModal extends React.Component {
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
