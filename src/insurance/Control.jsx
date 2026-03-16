import React, { Component } from "react";
import {
  Input,
  Button,
  Form,
  Row,
  Col,
  Card,
  notification,
  DatePicker,
} from "antd";
import "./Quits.css";
import moment from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
const dateFormat = "YYYY.MM.DD";
const { TextArea } = Input;

const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};
class HFrom extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      loading: true,
      itemValid: false,
      editable: false,
      LoggedSysuser,
      cookieUser,
      today,
      fetching: false,
      errorMessage: null,
    };
  }

  setInvoiceModeNormal() {
    this.setState({
      loading: false,
      invoiceMode: BaseInvoiceMode.Normal,
    });
  }

  componentDidMount() {}

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const disabledEdit =
      this.state.loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;
    const formLayount = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
      labelAlign: "left",
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    return (
      <div style={{ margin: "15px" }}>
        <Row gutter={(16, 16)} span={24}>
          <Col span={24}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Үндсэн
              </h2>
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: "20px", padding: "0px" }}>
          <h2
            align="center"
            style={{
              marginBottom: "10px",
              marginTop: "-10px",
              fontSize: "12pt",
            }}
          >
            Хяналт зөвшөөрөл
          </h2>
          <Row gutter={(16, 16)} span={24}>
            <Col xs={24} sm={24} md={24} lg={15} xl={9} xxl={6}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Тооцоолол хийсэн мэргэжилтэн
              </h2>
              <Form.Item
                label="Дүгнэлт"
                style={{ marginBottom: "3px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseSta")(
                  <TextArea
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStat")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("Date4", {
                  initialValue: moment(this.state.today, dateFormat),
                })(
                  <DatePicker
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ width: "100%" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={15} xl={9} xxl={6}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Хянасан
              </h2>
              <Form.Item
                label="Дүгнэлт"
                style={{ marginBottom: "3px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseState")(
                  <TextArea
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateN")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("Date3", {
                  initialValue: moment(this.state.today, dateFormat),
                })(
                  <DatePicker
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ width: "100%" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={15} xl={9} xxl={6}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Хуульчийн шийдвэр
              </h2>
              <Form.Item
                label="Дүгнэлт"
                style={{ marginBottom: "3px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNu")(
                  <TextArea
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNum")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("Date2", {
                  initialValue: moment(this.state.today, dateFormat),
                })(
                  <DatePicker
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ width: "100%" }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={15} xl={9} xxl={6}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Албан тушаалтны шийдвэр
              </h2>
              <Form.Item
                label="Дүгнэлт"
                style={{ marginBottom: "3px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumb")(
                  <TextArea
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumbe")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("Date1", {
                  initialValue: moment(this.state.today, dateFormat),
                })(
                  <DatePicker
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ width: "100%" }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Form>
          <Form.Item
            style={{
              textAlign: "center",
              background: "white",
              margin: "0px",
              padding: "0px",
            }}
            className="abtn"
          ></Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(HFrom);

export default class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container">
        <WrappedContractForm />
      </div>
    );
  }
}
