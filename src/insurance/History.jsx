import React, { Component } from "react";
import { Input, Form, Row, Col, Card, DatePicker } from "antd";
import "./Quits.css";
import moment, { isMoment } from "moment";
import cookie from "react-cookies";
const dateFormat = "YYYY.MM.DD";

const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};
class History extends React.Component {
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

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { propData } = this.props;
    const disabledEdit =
      this.state.loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;
    const formLayount = {
      labelCol: {
        span: 12,
      },
      wrapperCol: {
        span: 12,
      },
      labelAlign: "left",
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    return (
      <div style={{ margin: "15px" }}>
        <Row gutter={(16, 16)} span={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Баталгааны мэдээлэл
              </h2>
              <Form.Item
                label="Мэргэжилтэн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("AgentID")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Төлөв"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Баталгааны огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Row>
                <Col>
                  <Form.Item
                    label="Үргэлжлэх огноо"
                    style={{ marginBottom: "0px" }}
                    {...formLayount}
                  >
                    {getFieldDecorator("BeginDate")(
                      <DatePicker
                        onChange={this.onChangeControls}
                        disabled={disabledEdit}
                        style={{ width: "100%" }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label=" "
                    style={{ marginBottom: "0px" }}
                    {...formLayount}
                  >
                    {getFieldDecorator("EndDate")(
                      <DatePicker
                        onChange={this.onChangeControls}
                        disabled={disabledEdit}
                        style={{ width: "100%" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="ХХ-ний Регистер дугаар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("IndemRegNo")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="И-Мэйл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нийт хугацаа"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Даатгалын зориулалт"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Суурь хураамж"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("BasePremiumAmt")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Төлөх эцсийн хураамж"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Үнэлгээ"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("ActualAmt")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Өмнөх нөхөн төлбөрийн мэдээлэл
              </h2>
              <Form.Item
                label="Төлсөн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Буцаасан хураамж"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Гэрээний НТ дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Гэрээний НТ тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Зүйлийн НТ дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Зүйлийн НТ тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>
        <Row gutter={(16, 16)} span={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9} />
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Нөхөн төлбөр, цуцлалтын дэлгэрэнгүй
              </h2>
              <Form.Item
                label="Нийт нөхөн төлбөрийн тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нийт нөхөн төлбөрийн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Буцаалтын тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Буцаалтын дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>
        <Row gutter={(16, 16)} span={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9} />
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Осолын газрын мэдээлэл
              </h2>
              <Form.Item
                label="Дуудлагын үзүүлэлт"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>
        <Row gutter={(16, 16)} span={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9} />
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Гэрээний хууль, заалт
              </h2>
              <Form.Item
                label="Гэрээний НТ олгох заалт"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const EditableFormTable = Form.create()(History);
export default EditableFormTable;
