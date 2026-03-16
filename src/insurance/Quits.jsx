import React, { Component } from "react";
import {
  Input,
  Button,
  Select,
  Checkbox,
  Radio,
  Typography,
  Form,
  Spin,
  Row,
  Col,
  Card,
  notification,
  Tabs,
  TimePicker,
  DatePicker,
  Layout,
} from "antd";
import "./Quits.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import History from "./History";
import Damage from "./Damage";
import Comput from "./Comput";
import NTImage from "./NTImage";
import Control from "./Control";
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const dateFormat = "YYYY.MM.DD";
const timeFormat = "HH:mm";
const { Footer } = Layout;
const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};
class InsuranceR extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    var time = new Date(),
      todayT = time.getHours() + "-" + time.getMinutes();
    this.next = this.next.bind(this);
    this.tab = this.tab.bind(this);
    this.prev = this.prev.bind(this);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      baseData: undefined,
      todayT,
      loading: false,
      itemValid: false,
      editable: false,
      LoggedSysuser,
      cookieUser,
      today,
      fetching: false,
      bufferData: undefined,
      errorMessage: null,
      val: false,
      tab: "1",
    };
  }

  setInvoiceModeNormal() {
    this.setState({
      loading: false,
      invoiceMode: BaseInvoiceMode.Normal,
      bufferData: undefined,
    });
  }

  componentDidMount() {}

  onPressEnterBarCode = (e) => {
    const IndemnityNo = this.props.form.getFieldValue("IndemnityNo");
    if (IndemnityNo) this.getData(IndemnityNo);
    else this.setInvoiceModeNormal();
  };

  getData = (IndemnityNo) => {
    const { getFieldsValue, setFieldsValue, resetFields } = this.props.form;
    this.setState({ loading: true });
    var BusinessObject = [{ FieldName: "IndemnityNo", Value: IndemnityNo }];

    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: "IS_181", ModuleID: "IN", BusinessObject },
          replacer
        ),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          resetFields();
          setFieldsValue({ IndemnityNo: IndemnityNo });
          this.setInvoiceModeNormal();
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
          });
          return;
        }
        const { Table } = res.data.retData;
        let values = {};

        Object.keys(getFieldsValue()).forEach((key) => {
          switch (key) {
            case "IndemnityNo":
              values[key] = Table[0][key];
              break;
            default:
              if (key.includes("Date")) {
                if (Table[0][key])
                  values[key] = moment(Table[0][key], dateFormat);
                else values[key] = null;
              } else if (key.includes("Time")) {
                if (Table[0][key])
                  values[key] = moment(Table[0][key], timeFormat);
                else values[key] = null;
              } else values[key] = Table[0][key];
              break;
          }
        });
        setFieldsValue(values);
        this.setState({
          bufferData: res.data.retData,
          invoiceMode: BaseInvoiceMode.View,
          loading: false,
          itemValid: true,
          editable: Table[0].Status !== "V",
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        resetFields();
        notification["error"]({
          message: "Нөхөн төлбөрийн дугаар олдсонгүй.",
          description: "",
        });
      });
  };

  handleSubmit = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      const isIndemnity = [];
      isIndemnity.push(values);
      Object.keys(values).forEach((key) => {
        if (key.includes("Date"))
          isIndemnity[0][key] = values[key].format(dateFormat);
        else if (key.includes("Time"))
          isIndemnity[0][key] = values[key].format(timeFormat);
      });
      this.save(isIndemnity);
    });
  };

  save = (isIndemnity) => {
    this.setState({ loading: true });
    isIndemnity.forEach((ind) => {
      if (ind.CaseNo === undefined) ind.RowStatus = "I";
      else if (ind.RowStatus !== "I") ind.RowStatus = "U";
      ind.CreatedUserName = this.state.cookieUser.UserName;
      ind.LastUserName = this.state.cookieUser.UserName;
    });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "IS_179",
          isIndemnity,
          ModuleID: "IN",
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
          message: "Мэдээллийг амжилттай хадгаллаа",
          description: "",
        });
        this.setState({
          invoiceMode: BaseInvoiceMode.Add,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };

  onClickNew = () => {
    const { form } = this.props;
    this.setState({ loading: true });
    form.resetFields();
    this.setState({
      invoiceMode: BaseInvoiceMode.Add,
      loading: false,
      editable: true,
    });
  };

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  };
  handleSelectChange = (value, option) => {
    this.props.form.setFieldsValue({
      CaseAddress: `${
        option &&
        option.props &&
        option.props.children &&
        option.props.children[2]
      }, ${
        option &&
        option.props &&
        option.props.children &&
        option.props.children[4]
      }`,
    });
  };

  next() {
    this.setState({
      tab: Math.min(6, parseInt(this.state.tab) + 1).toString(),
    });
  }

  tab(key) {
    this.setState({ tab: key });
  }

  prev() {
    this.setState({
      tab: Math.max(1, parseInt(this.state.tab) - 1).toString(),
    });
  }

  render() {
    const { baseData, bufferData, val } = this.state;
    const { getFieldDecorator } = this.props.form;
    const disabledEdit =
      this.state.loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;
    const disabledActive =
      this.state.loading ||
      [BaseInvoiceMode.Add, BaseInvoiceMode.Edit].includes(
        this.state.invoiceMode
      );
    const formLayount = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 14,
      },
      labelAlign: "left",
    };
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    return (
      <div style={{ margin: "15px" }}>
        <h3 style={{ marginBottom: "30px" }}>
          Даатгал / Бүртгэл / <Text color="#6b747b">Нөхөн төлбөр</Text>
        </h3>
        <Layout>
          <Spin spinning={this.state.loading}>
            <Card>
              <Tabs defaultActiveKey="1" activeKey={this.state.tab}>
                <TabPane tab="Бүрдүүлэлт" key="1">
                  <Form {...formLayount} className="step-for">
                    <Row gutter={8}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Нөхөн төлбөр дугаар"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("IndemnityNo")(
                            <Input
                              onPressEnter={this.onPressEnterBarCode}
                              disabled={disabledActive}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        className="q"
                        xs={3}
                        sm={3}
                        md={3}
                        lg={2}
                        xl={1}
                        style={{ textAlign: "right", marginTop: "3px" }}
                      >
                        <Button
                          shape="circle"
                          icon="plus"
                          onClick={this.onClickNew}
                          className="button10"
                        />
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Тохиолдлын дугаар"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("CaseNo", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Бүтээгдэхүүн" {...formItemLayout}>
                          {getFieldDecorator("ProductID", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item label="Мэргэжилтэн" {...formItemLayout}>
                          {getFieldDecorator("EmpCode", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item
                          label="Баталгааны дугаар"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("SheetNo", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item label="Гэрээний дугаар" {...formItemLayout}>
                          {getFieldDecorator("ContractNo", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Нэмэлт баталгаа" {...formItemLayout}>
                          {getFieldDecorator("CaseChanelType", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Даатгуулагч"
                          style={{ marginBottom: "1px" }}
                        >
                          {getFieldDecorator("CustID", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item
                          label="Төлөөлөгч"
                          style={{ marginBottom: "1px" }}
                        >
                          {getFieldDecorator("AgentID", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="НТ Төлөв"
                          style={{ marginBottom: "3px" }}
                        >
                          {getFieldDecorator("Status", {
                            rules: required,
                          })(
                            <Select
                              dropdownMatchSelectWidth={false}
                              onSelect={this.handleSelectChange}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {baseData &&
                                baseData.Table.map((item) => (
                                  <Option key={item.ZipCodeID}>
                                    {item.ZipCodeID}-{item.ZipCodeName}-
                                    {item.RegionName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Эрсдэлийн код"
                          style={{ marginBottom: "4px" }}
                        >
                          {getFieldDecorator("RiskID", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="НТ Төлөвийн нэмэлт"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("DescrStatus")(
                            <TextArea
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item label="Эрсдэлийн нэр" {...formItemLayout}>
                          {getFieldDecorator("RiskNote")(
                            <TextArea
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Row gutter={(16, 16)} span={18}>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2 align="center" className="hei">
                          Даатгуулагч
                        </h2>
                        <Row gutter={(16, 16)}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsNHAT")(
                                <Radio>Хувь хүн</Radio>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("isNoatus")(
                                <Radio>Байгууллага</Radio>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsActionEmp")(
                                <Radio>Гадаадын иргэн</Radio>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          label="Овог"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemLastName")(
                            <Input
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
                          {getFieldDecorator("IndemFirstName")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Регистерийн дугаар"
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
                          label="Хаяг"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemAddress")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Утас"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemPhone")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2
                          align="center"
                          style={{
                            marginBottom: "10px",
                            marginTop: "-10px",
                            fontSize: "12pt",
                          }}
                        >
                          Буруутай этгээд
                        </h2>
                        <Row gutter={(16, 16)}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={14}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsNHAT", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Буруутай этгээд байгаа эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={10}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsNHAT", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Нэхэтжлэх эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={(16, 16)}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsNHAT")(
                                <Radio>Хувь хүн</Radio>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("isNoatus")(
                                <Radio>Байгууллага</Radio>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={8}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsActionEmp")(
                                <Radio>Гадаадын иргэн</Radio>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          label="Овог"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseLastName")(
                            <Input
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
                          {getFieldDecorator("CaseFirstName")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Регистерийн дугаар"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseRegNo")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Хаяг"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseAddress")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Утас"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CasePhone")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Card>
                    </Col>
                  </Row>
                  <Row span={18}>
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
                          Материал бүрдүүлэлт
                        </h2>
                        <Row gutter={(16, 16)}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("IsNHAT", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Материал бүрдсэн эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("IsNHAT", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Хэлцэл хийсэн эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={(16, 16)}>
                          <Col span={8}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("CollectMaterialDate")(
                                <DatePicker />
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("CaseDate")(<DatePicker />)}
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("InvesDate")(<DatePicker />)}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={(16, 16)} span={18}>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2
                          align="center"
                          style={{
                            marginBottom: "10px",
                            marginTop: "-10px",
                            fontSize: "12pt",
                          }}
                        >
                          Шийдвэрлэлт
                        </h2>
                        <Form.Item
                          label="Нэхэмжилсэн дүн"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("RequiredAmt")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Нөхөх санал"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CalculateAmt")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Олгох дүн"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("SolvedAmt")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Тушаалын дугаар"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("OrderNo")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2
                          align="center"
                          style={{
                            marginBottom: "10px",
                            marginTop: "-10px",
                            fontSize: "12pt",
                          }}
                        >
                          Татгалзсан
                        </h2>
                        <Form.Item
                          label="Татгалзсан огноо"
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
                          label="Шалтгаан"
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
                          label="Мэдэгдсэн хэлбэр"
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
                          label="Тайлбар"
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
                </TabPane>
                <TabPane tab="Түүх" key="2">
                  <History propData={bufferData && bufferData.Table} />
                </TabPane>
                <TabPane tab="Хохирол" key="3">
                  <Damage propData={bufferData} />
                </TabPane>
                <TabPane tab="Тооцоолол" key="4">
                  <Comput />
                </TabPane>
                <TabPane tab="НТ зураг" key="5">
                  <NTImage />
                </TabPane>
                <TabPane tab="Хяналт" key="6">
                  <Control />
                </TabPane>
              </Tabs>
              <Footer
                style={{ textAlign: "center", background: "white" }}
                className="qq"
              >
                <Button
                  onClick={this.prev}
                  className="button10"
                  style={{ margin: "20px" }}
                >
                  Өмнөх
                </Button>
                <Button
                  htmlType="submit"
                  onClick={this.next}
                  className="button10"
                >
                  Дараах
                </Button>
              </Footer>
            </Card>
          </Spin>
        </Layout>
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(InsuranceR);

export default class Quits extends Component {
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
