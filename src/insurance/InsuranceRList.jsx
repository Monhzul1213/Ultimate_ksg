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
  Card,
  Empty,
} from "antd";
import "./InsuranceLL.css";
import numeral from "numeral";
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
    const { form, onSubmitForm, loading, baseData, filterResult } = this.props;
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
          className="btg"
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
              height: "112px",
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
                    {getFieldDecorator("CaseNo")(
                      <Select
                        type="flex"
                        placeholder="Дуудлагын дугаар"
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
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("AllocateEmpCode")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Хуваарилсан ажилтан"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table1.map((item) => (
                            <Option key={item.EmpCode}>
                              {item.EmpCode}-{item.EmpName}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("BeginDate", {
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
                    {getFieldDecorator("EndDate", {
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
                          baseData.Table3.map((item) => (
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
                    {getFieldDecorator("StateNumber")(
                      <Input placeholder="Улсын дугаар" />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("ContactPhone")(
                      <Input placeholder="Утасны дугаар" />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("CaseContact")(
                      <Input placeholder="Мэдээлэгч" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("CaseInvestEmpCode")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Дуудлагад очсон ажилтан"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table1.map((item) => (
                            <Option key={item.EmpCode}>
                              {item.EmpCode}-{item.EmpName}
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
                          baseData.Table4.map((item) => (
                            <Option key={item.SheetNo}>{item.SheetNo}</Option>
                          ))}
                      </Select>
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
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const WrappedFilterForm = Form.create({ name: "filter_form" })(FilterForm);

export default class InsuranceRL extends Component {
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
      queryID: "IS_179",
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
          QueryID: "IS_180",
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
    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 24 }, //≥576px
      md: { span: 24 }, //≥768px
      lg: { span: 24 }, //≥992px
      xl: { span: 12 }, //≥1200px
      xxl: { span: 12 }, //≥1600px
    };
    return (
      <div style={{ margin: "40px", marginTop: "15px" }}>
        <h3 style={{ marginBottom: "30px" }}>
          Даатгал / Лавлагаа /<Text color="#6b747b">Дуудлагын лавлагаа</Text>
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
          <Row gutter={[16, 16]}>
            <Col {...columnConfig}>
              <Card title="Төлөв" size="small" style={{ height: 300 }}>
                <Donut data={this.state.filterResult} />
              </Card>
            </Col>
            <Col {...columnConfig}>
              <Card
                title="Бүтээгдэхүүн"
                size="small"
                style={{
                  height: 300,
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                <Groupedcolumn data={this.state.filterResult} />
              </Card>
            </Col>
          </Row>

          <GridView
            QueryID={this.state.queryID}
            dataSource={this.state.filterResult}
            rowKey="CaseNo"
          />
        </Spin>
      </div>
    );
  }
}

class Donut extends React.Component {
  render() {
    const { data } = this.props;
    const { DataView } = DataSet;
    const { Html } = Guide;
    const dv = new DataView();

    data &&
      dv.source(data).transform({
        type: "aggregate",
        fields: ["CaseNo"],
        operations: ["count"],
        as: ["StatusCount"],
        groupBy: ["StatusName"],
      });
    const cols = {
      ContractCount: {
        formatter: (val) => {
          return val;
        },
      },
    };
    if (data && data.length <= 0) {
      return (
        <div>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    } else {
      return (
        <div>
          <Chart
            padding={[0, 0, 40, 0]}
            height={240}
            data={dv}
            scale={cols}
            forceFit
          >
            <Coord type="theta" radius={0.75} innerRadius={0.6} />
            <Axis name="StatusCount" />
            <Legend />
            <Tooltip showTitle={false} />
            <Geom
              type="intervalStack"
              position="StatusCount"
              color="StatusName"
              style={{
                lineWidth: 1,
                stroke: "#fff",
              }}
            >
              <Label
                content="StatusCount"
                formatter={(val, item) => {
                  return item.point.StatusName + ": " + val;
                }}
              />
            </Geom>
          </Chart>
        </div>
      );
    }
  }
}

class Groupedcolumn extends React.Component {
  render() {
    const { data } = this.props;
    const { DataView } = DataSet;
    const dv = new DataView();

    data &&
      dv.source(data).transform({
        type: "aggregate",
        fields: ["CaseNo"],
        operations: ["count"],
        as: ["ProductCount"],
        groupBy: ["ProductName"],
      });
    const cols = {
      ProductName: {
        min: 0,
      },
    };
    if (data && data.length <= 0) {
      return (
        <div>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    } else {
      return (
        <div>
          <Chart
            padding={[0, 0, 40, 0]}
            height={data && data.length > 100 ? 550 : 240}
            data={dv}
            scale={cols}
            padding="auto"
            forceFit
          >
            <Coord transpose />
            <Axis name="ProductName" />
            <Axis name="ProductCount" visible={false} />
            <Tooltip />
            <Geom
              type="interval"
              position="ProductName*ProductCount"
              label={[
                "ProductName*ProductCount",
                (name, value) => numeral(value || 0).format("0.0%"),
              ]}
            ></Geom>
          </Chart>
        </div>
      );
    }
  }
}
