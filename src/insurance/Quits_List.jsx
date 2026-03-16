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
  DatePicker,
  Checkbox,
  Radio,
  Card,
} from "antd";
import numeral from "numeral";
import "./Quits_List.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  Guide,
  Interval,
} from "bizcharts";
import DataSet from "@antv/data-set";
import GridView from "../base/GridViewS";

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
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.state = {
      invoiceMode: BaseInvoiceMode.Normal,
      editCheck: true,
      editCheck1: false,
      today,
    };
  }
  handleChange = (e) => {
    if (e.target.checked == true) {
      this.setState({
        invoiceMode: BaseInvoiceMode.Add,
        editCheck: false,
      });
    } else {
      this.setState({
        invoiceMode: BaseInvoiceMode.Normal,
        editCheck: true,
      });
      this.props.form.resetFields(["SolvedBeginDate", "SolvedEndDate"]);
    }
  };
  handleChChange = (e) => {
    if (e.target.checked === true) {
      this.setState({
        editCheck1: false,
      });
    } else {
      this.setState({
        editCheck1: true,
      });
      this.props.form.resetFields(["BeginDate", "EndDate"]);
    }
  };
  render() {
    const { form, onSubmitForm, loading, baseData, filterResult } = this.props;
    const { editCheck, editCheck1 } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const disabledEdit =
      loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editCheck;

    return (
      <div className="hh">
        <Form
          className="button_w"
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
              height: "163px",
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
                    {getFieldDecorator("IndemnityNo")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Нөхөн төлбөрийн дугаар"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table1.map((item) => (
                            <Option key={item.IndemnityNo}>
                              {item.IndemnityNo}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("ContractNo")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Гэрээний дугаар"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table4.map((item) => (
                            <Option key={item.ContractNo}>
                              {item.ContractNo}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("SheetNo")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Баталгааны дугаар"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table3.map((item) => (
                            <Option key={item.SheetNo}>{item.SheetNo}</Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("CaseNo")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Тохиолдолын дугаар"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table2.map((item) => (
                            <Option key={item.CaseNo}>{item.CaseNo}</Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("CustName")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Даатгуулагчийнн нэр"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table5.map((item) => (
                            <Option key={item.CustID}>
                              {item.CustID}-{item.CustName}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("PunishNbr")(
                      <Input placeholder="Улсын дугаар" />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("StateNbr")(
                      <Input placeholder="Хохирогчын улсын дугаар" />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("Status", {
                      initialValue: "-1",
                    })(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Төлөв"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table.map((item) => (
                            <Option key={item.ConstKey}>
                              {item.ValueStr1}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("Begin", {
                      valuePropName: "checked",
                      initialValue: true,
                    })(
                      <Checkbox onChange={this.handleChChange}>
                        НТ-ын огноо
                      </Checkbox>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("BeginDate", {
                      initialValue: moment([moment().year(), moment().month()]),
                    })(
                      <DatePicker
                        disabled={editCheck1}
                        placeholder="Эхлэх огноо"
                        style={{ width: "100%" }}
                        allowClear={false}
                        format={dateFormat}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("EndDate", {
                      initialValue: moment(this.state.today, dateFormat),
                    })(
                      <DatePicker
                        disabled={editCheck1}
                        placeholder="Дуусах огноо"
                        style={{ width: "100%" }}
                        allowClear={false}
                        format={dateFormat}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("SolvedBegin", {
                      valuePropName: "checked",
                      initialValue: false,
                    })(
                      <Checkbox onChange={this.handleChange}>
                        Шийдвэрлэсэн огноо
                      </Checkbox>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("SolvedBeginDate", {
                      initialValue: moment([moment().year(), moment().month()]),
                    })(
                      <DatePicker
                        disabled={editCheck}
                        placeholder="Эхлэх огноо"
                        style={{ width: "100%" }}
                        allowClear={false}
                        format={dateFormat}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={4}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("SolvedEndDate", {
                      initialValue: moment(this.state.today, dateFormat),
                    })(
                      <DatePicker
                        disabled={editCheck}
                        placeholder="Дуусах огноо"
                        style={{ width: "100%" }}
                        allowClear={false}
                        format={dateFormat}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)} style={{ marginTop: "3px" }}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={10}>
                  <Card className="c_padd">
                    <Form.Item>
                      {getFieldDecorator("radio-group")(
                        <Radio.Group>
                          <Radio value="a">Энэ улирал</Radio>
                          <Radio value="b">Энэ жил</Radio>
                          <Radio value="c">Өмнө жил</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={10}>
                  <Card className="c_padd">
                    <Form.Item>
                      {getFieldDecorator("radio-group")(
                        <Radio.Group>
                          <Radio value="d">Шийдвэрлээгүй</Radio>
                          <Radio value="e">Шийдвэрлэсэн</Radio>
                          <Radio value="f">Бүгд</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Card>
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

export default class QuitsList extends Component {
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
      editCheck: false,
      editCheck1: false,
      queryID: "IS_182",
    };
  }

  componentDidMount() {
    var BusinessObject = [
      {
        FieldName: "BeginDate",
        Value: moment([moment().year()]).format(dateFormat),
      },
      { FieldName: "EndDate", Value: moment().format(dateFormat) },
    ];
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "IS_183",
          ModuleID: "IN",
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
        const { Table } = res.data.retData;
        Table && Table.unshift({ ConstKey: -1, ValueStr1: "-- Бүгд --" });

        this.onSubmitForm();
        this.setState({ baseData: res.data.retData, loading: false });
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
            ModuleID: "IN",
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
          Даатгал / Лавлагаа /<Text color="#6b747b">Нөхөн төлбөр</Text>
        </h3>

        <Spin spinning={this.state.loading}>
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
            cookieUser={this.state.cookieUser}
            baseData={this.state.baseData}
            filterResult={this.state.filterResult}
          />

          <GridView
            QueryID={this.state.queryID}
            dataSource={this.state.filterResult}
            rowKey="IndemnityNo"
          />
        </Spin>
      </div>
    );
  }
}
