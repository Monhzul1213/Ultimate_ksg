import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Select,
  Form,
  notification,
  Spin,
  Row,
  Col,
  Typography,
  Input,
  Checkbox,
  TimePicker,
  DatePicker,
} from "antd";
import "./PSInquiry.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridViewS from "../base/GridViewS";

const { Option } = Select;
const dateFormat = "YYYY.MM.DD";
const timeFormat = "HH:mm:ss";
const { Text } = Typography;
const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};

class FilterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoiceMode: BaseInvoiceMode.Normal,
      editable: false,
      chkTxnHour: false,
    };
  }
  handleChange = (e) => {
    if (e.target.checked == true) {
      this.setState({
        invoiceMode: BaseInvoiceMode.Add,
        editable: true,
      });
    } else {
      this.props.form.resetFields();
      this.setState({
        invoiceMode: BaseInvoiceMode.Normal,
        editable: false,
      });
    }
  };

  render() {
    const { form, onSubmitForm, loading, cookieUser, baseData } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const disabledEdit =
      loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    return (
      <div className="hh">
        <Form
          className="aa"
          style={{ display: "contents" }}
          onSubmit={onSubmitForm}
        >
          <Button
            className="button1"
            htmlType="submit"
            disabled={loading}
            icon="search"
            style={{
              fontWeight: "bold",
              borderWidth: "0px",
              height: "151px",
              marginRight: "16px",
              width: "33px",
              marginTop: "4px",
            }}
            block
          />
        </Form>
        <Form style={{ display: "block" }} autoComplete="off">
          <Row type="flex">
            <Col span={24}>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout} className="color-disabled">
                    {getFieldDecorator("SiteID", {
                      initialValue: cookieUser && cookieUser.SiteID,
                    })(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Салбар"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                        disabled
                      >
                        {baseData &&
                          baseData.Table4.map((item) => (
                            <Option key={item.SiteID}>{item.Name}</Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("TxnType")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Гүйлгээний төрөл"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table2.map((item) => (
                            <Option key={item.ConstKey}>
                              {item.ValueStr1}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("FromSalesDate", {
                      initialValue: moment([moment().year(), moment().month()]),
                    })(
                      <DatePicker
                        disabled={loading}
                        placeholder="Эхлэх огноо"
                        style={{ width: "100%" }}
                        allowClear={false}
                        format={dateFormat}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("ToSalesDate", {
                      initialValue: moment(today, dateFormat),
                    })(
                      <DatePicker
                        disabled={loading}
                        placeholder="Дуусах огноо"
                        style={{ width: "100%" }}
                        allowClear={false}
                        format={dateFormat}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("ClassID")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Барааны ангилал"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table3.map((item) => (
                            <Option key={item.ClassID}>
                              {item.ClassID}-{item.Descr}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("Materialtype")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Хэрэглээнийн код"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table1.map((item) => (
                            <Option key={item.Materialtype}>
                              {item.Materialtype}-{item.Descr}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("BarCode")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Бар код"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table.map((item) => (
                            <Option key={item.BarCode}>{item.BarCode}</Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("InvtID")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Барааны код"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table.map((item) => (
                            <Option key={item.InvtID}>
                              {item.InvtID}-{item.InvtName}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("chkTxnHour", {
                      valuePropName: "unchecked",
                      initialValue: "false",
                    })(
                      <Checkbox onChange={this.handleChange}>
                        Цагаар хайлт хийх эсэх
                      </Checkbox>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("FromTxnTime")(
                      <TimePicker
                        disabled={disabledEdit}
                        style={{ width: "100%" }}
                        format="HH:mm:ss"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("ToTxnTime")(
                      <TimePicker
                        disabled={disabledEdit}
                        style={{ width: "100%" }}
                        format="HH:mm:ss"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const WrappedFilterForm = Form.create({ name: "filter_form" })(FilterForm);

export default class PSInquiry extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      filterResult: undefined,
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      cookieUser,
      invoiceMode: BaseInvoiceMode.Normal,
      editable: false,
      queryID: "PS_138",
    };
  }

  componentDidMount() {
    var BusinessObject = [
      { FieldName: "SiteID", Value: this.state.cookieUser.SiteID },
      { FieldName: "chkTxnHour", Value: false },
    ];
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "PS_139",
          ModuleID: "PS",
          BusinessObject,
        }),
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

        this.setState({ baseData: res.data.retData, loading: false });
        this.onSubmitForm();
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  filter = (values) => {
    var BusinessObject = [];
    Object.entries(values).forEach(([key, value]) => {
      if (key.includes("Date")) value = value.format(dateFormat);
      else if (key.includes("Time") && value) value = value.format(timeFormat);
      BusinessObject.push({ FieldName: key, Value: value });
    });

    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          {
            QueryID: this.state.queryID,
            ModuleID: "PS",
            BusinessObject,
          },
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

        this.setState({
          filterResult: data.retData && data.retData.Table,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  onSubmitForm = (e) => {
    e && e.preventDefault();
    const { form } = this.formRef.props;
    form.validateFields({ first: true }, (err, values) => {
      if (!err) this.filter(values);
    });
  };

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div style={{ margin: "40px", marginTop: "15px" }}>
        <h3 style={{ marginBottom: "30px" }}>
          Бараа / Бүртгэл /
          <Text color="#6b747b">Борлуулалтын гүйлгээний лавлагаа</Text>
        </h3>

        <Spin spinning={this.state.loading}>
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
            cookieUser={this.state.cookieUser}
            baseData={this.state.baseData}
          />
          <GridViewS
            QueryID={this.state.queryID}
            dataSource={this.state.filterResult}
          />
        </Spin>
      </div>
    );
  }
}
