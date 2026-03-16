import React, { Component } from "react";
import { Input, Button, Form, Row, Col, Card, notification } from "antd";
import "./Quits.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
const dateFormat = "YYYY.MM.DD";

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

  handleSubmit = () => {};

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  };

  render() {
      const { getFieldDecorator } = this.props.form;
     const { propData2, propData3 } = this.props;
    const disabledEdit =
      this.state.loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;
    const formLayount = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 12 },
        xxl: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 12 },
        xxl: { span: 12 },
      },
      labelAlign: "left",
    };
    const formLayountForm = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 12 },
        xl: { span: 9 },
        xxl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 12 },
        xl: { span: 9 },
        xxl: { span: 6 },
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
                Хохиролын тооцоолол
              </h2>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Төлөгдсөн даатгалын хураамж"
                    style={{ marginBottom: "0px" }}
                    {...formLayount}
                  >
                    {getFieldDecorator("PaidAmt", {
                     initialValue: propData3 && propData3[0].PaidAmt
                })(
                      <Input
                        onChange={this.onChangeControls}
                        disabled={disabledEdit}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Тооцоолол хийсэн мэргэжилтэн"
                    style={{ marginBottom: "0px" }}
                    {...formLayount}
                  >
                    {getFieldDecorator("ActualAmt", {
                     initialValue: propData2 && propData2.ActualAmt
                })(
                      <Input
                        onChange={this.onChangeControls}
                        disabled={disabledEdit}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Даатгалын үнэлгээ"
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Тооцоолол хийсэн огноо"
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
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Урьд нь авсан нөхөн төлбөрийн дүн"
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Нэхэмжилсэн дүнг даатгагчаас хянасан"
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
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Даатгалын үнэлгээний үлдэх дүн"
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Тооцсон хохирол"
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
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Зах зээлийн үнэлгээ"
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                  <Form.Item
                    label="Хувь тэнцүүлсэн дүн"
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
                </Col>
              </Row>
              <Form.Item
                label="Төлөгдсөн даатгалын хураамж"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Хувь тэнцүүлсэн хохирол нөхөх хувь"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нэхэтжилсэн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Татгалзсан хэсэг"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Бодит хохирлын дүн"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Хохирол тооцсон тайлбар"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("IndemnityReason", {
                     initialValue: propData2 && propData2.IndemnityReason
                })(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Даатгалын үнэлгээнд эзлэх хохирлын дүн"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Даатгуулагчийн ӨХХ 1 (%)"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Даатгуулагчийн ӨХХ 1 (₮)"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="ӨХХ 1-ийг  тооцсон НТ-ийн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Даатгуулагчийн ӨХХ 2 (%)"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Даатгуулагчийн ӨХХ 2 (₮)"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="ӨХХ 2-ийг  тооцсон НТ-ийн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Үнэлгээний зардал нэхэмжилсэн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Олговол зохих НТ-ийн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayountForm}
              >
                {getFieldDecorator("CaseStateNumber")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ marginLeft: "-6px" }}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>
        <Row gutter={(16, 16)} span={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                НТ Шийдвэрлээгүй удсан шалтгаан
              </h2>
              <Form.Item
                label="НТ шийдвэрлээгүй удсан"
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

const EditableFormTable = Form.create()(HFrom);
export default EditableFormTable;
