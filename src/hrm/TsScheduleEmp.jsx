import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Select,
  DatePicker,
  Form,
  notification,
  Spin,
  Row,
  Col,
  Typography,
  Table,
  Input,
} from "antd";
import "./TimeAll.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import NumberFormat from "react-number-format";

const { Option } = Select;
const dateFormat = "YYYY.MM.DD";
const monthFormat = "YYYY.MM";
const { Text } = Typography;
const { MonthPicker } = DatePicker;

class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, baseData, loading } = this.props;
    const { getFieldDecorator } = form;
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    return (
      <Form onSubmit={onSubmitForm} autoComplete="off">
        <Row gutter={[16, 16]} type="flex">
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("EmpFName")(
                <Input
                  disabled={loading}
                  style={{ height: "52px" }}
                  placeholder="Ажилтны нэр"
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item style={{ marginBottom: 0 }}>
              <div className="select-input-hei">
                {getFieldDecorator("DepartmentID", {
                  initialValue:
                    baseData &&
                    baseData.Department &&
                    baseData.Department.length > 0
                      ? baseData.Department[0].DepartmentID
                      : "",
                })(
                  <Select
                    disabled={loading}
                    type="flex"
                    allowClear={true}
                    placeholder="Хэлтэс сонгох"
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 500 }}
                    className="place"
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData &&
                      baseData.Department &&
                      baseData.Department.map((department) => (
                        <Option key={department.DepartmentID}>
                          {department.Descr}
                        </Option>
                      ))}
                  </Select>
                )}
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("BeginDate", {
                initialValue: moment([moment().year(), moment().month()]),
              })(
                <MonthPicker
                  disabled={loading}
                  placeholder="Огноо"
                  style={{ width: "100%" }}
                  className="date-picker"
                  allowClear={false}
                  format={monthFormat}
                />
              )}
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={{ span: 24 }}
            lg={{ span: 12 }}
            xl={{ span: 6 }}
          >
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                style={{
                  fontWeight: "bold",
                  background: "#0A5287",
                  borderWidth: "0px",
                  height: "52px",
                }}
                block
              >
                ХАЙХ
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedFilterForm = Form.create({ name: "filter_form" })(FilterForm);

var curIndex = -1;

export default class TsScheduleEmp extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      queryID: "TS_045",
    };
  }

  componentDidMount(record) {
    request
      .post("Employees_Initialize", {
        token: this.state.LoggedSysuser.token,
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
            BusinessObject,
          },
          replacer
        ),
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: data.retDesc,
          });
          return;
        }

        var columns = [{ title: "Ажилтан", dataIndex: "EmpFName", width: 200 }];

        data.retData.Table.forEach((row) => {
          console.log(row);
          columns.push({
            title: row.ColumnHeader,
            dataIndex: row.ColumnKey,
            width: 120,
            key: row.ColumnKey,
            className: "table-column-right",
            render: (text) => {
              console.log(text);
              if (row.ColumnFormat && row.ColumnFormat.includes("#")) {
                let opt = {
                  value: text,
                  displayType: "text",
                  thousandSeparator: true,
                  decimalScale: 0,
                  fixedDecimalScale: true,
                };
                return <NumberFormat {...opt} />;
              }
              return text;
            },
          });
        });

        this.setState({
          filterResult: data.retData.Table,
          columns,
          loading: false,
          BeginDate: values.BeginDate,
          EndDate: values.EndDate,
        });
        console.log(this.state.columns);
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

  getTime = (record, index) => {
    this.setState({ loading: true });
    const BeginDate = this.state.BeginDate
      ? moment(this.state.BeginDate).format(dateFormat)
      : "";
    const EndDate = this.state.BeginDate
      ? moment(this.state.EndDate).format(dateFormat)
      : "";
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "uspts_tsTimeSummaryDtl",
          BusinessObject: {
            EmpCode: record.EmpCode,
            BeginDate,
            EndDate,
          },
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

        this.setState({
          editTime: true,
          timeResult: data.retData.Table,
          loading: false,
        });
      });
  };

  onCancel = () => {
    this.setState({ editTime: false });
  };

  render() {
    console.log(this.state.filterResult);

    return (
      <div style={{ margin: "27px" }}>
        <h3>Ажилтнаар цагийн хуваарь зохиох</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цагийн бүртгэл / <Text color="#6b747b">Бүх ажилтан</Text>
        </h4>
        <Spin spinning={this.state.loading}>
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            baseData={this.state.baseData}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
          />
          <Table
            columns={this.state.columns ? this.state.columns : []}
            rowKey="RowNumber"
            dataSource={this.state.filterResult}
            scroll={{ x: "max-content", y: this.tableHeight }}
          />
        </Spin>
      </div>
    );
  }
}
