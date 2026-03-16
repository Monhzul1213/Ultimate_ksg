import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Button,
  Select,
  DatePicker,
  Form,
  notification,
  Spin,
  Menu,
  Dropdown,
  Row,
  Col,
  Avatar,
  Typography,
} from "antd";
import "./ReferenceAdmin.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";

const { Option } = Select;
const dateFormat = "YYYY.MM.DD";
const { Text } = Typography;

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
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={4}>
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
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={4}>
            <Form.Item style={{ marginBottom: 0 }}>
              <div className="select-input-hei">
                {getFieldDecorator("EmpCode")(
                  <Input
                    disabled={loading}
                    style={{ height: "52px" }}
                    placeholder="Ажилтны код"
                  />
                )}
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={4}>
            <Form.Item style={{ marginBottom: 0 }}>
              <div className="select-input-hei">
                {getFieldDecorator("DepartmentID", {
                  // initialValue:
                  //   baseData &&
                  //   baseData.Department &&
                  //   baseData.Department.length > 0
                  //     ? baseData.Department[0].DepartmentID
                  //     : "",
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
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={4}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("BeginDate", {
                initialValue: moment([moment().year(), moment().month()]),
              })(
                <DatePicker
                  disabled={loading}
                  placeholder="Эхлэх огноо"
                  style={{ width: "100%" }}
                  className="date-picker"
                  allowClear={false}
                  format={dateFormat}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={4}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("EndDate", {
                initialValue: moment(today, dateFormat),
              })(
                <DatePicker
                  disabled={loading}
                  placeholder="Дуусах огноо"
                  style={{ width: "100%" }}
                  className="date-picker"
                  allowClear={false}
                  format={dateFormat}
                />
              )}
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={{ span: 24 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            xxl={{ span: 4 }}
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

export default class ReferenceAdmin extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      queryID: "Web_ReferenceAdmin",
    };
  }

  componentDidMount() {
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

  onSubmitForm = (e) => {
    e && e.preventDefault();
    const { form } = this.formRef.props;
    form.validateFields({ first: true }, (err, values) => {
      if (!err) {
        var BusinessObject = [];
        Object.entries(values).forEach(([key, value]) => {
          var val = value;
          if (key.includes("Date")) val = value.format(dateFormat);
          BusinessObject.push({ FieldName: key, Value: val });
        });
        this.setState({ loading: true });
        const replacer = (key, value) =>
          typeof value === "undefined" ? null : value;
        request
          .post("Execute_Query", {
            token: this.state.LoggedSysuser.token,
            json: JSON.stringify(
              { QueryID: this.state.queryID, BusinessObject },
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
      }
    });
  };

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div style={{ margin: "27px" }}>
        <h3>Гэрээний лавлагаа</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Гэрээ / <Text color="#6b747b">Бүх ажилтан</Text>
        </h4>
        <Spin spinning={this.state.loading}>
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            baseData={this.state.baseData}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
          />
          <GridView
            QueryID={this.state.queryID}
            rowKey="RowRecID"
            dataSource={this.state.filterResult}
          />
        </Spin>
      </div>
    );
  }
}
