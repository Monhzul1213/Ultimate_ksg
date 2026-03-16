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
  Modal,
  Typography,
} from "antd";
import "./Salaries.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import NumberFormat from "react-number-format";
import SalariesTable from "./SalariesTable";
import male from "@/image/male.png";
import female from "@/image/female.png";

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
                {getFieldDecorator("PosType")(
                  <Select
                    disabled={loading}
                    placeholder="Албан тушаал"
                    allowClear={true}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 500 }}
                    className="place"
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData &&
                      baseData.PosType &&
                      baseData.PosType.map((posType) => (
                        <Option key={posType.PosTypeID}>{posType.Descr}</Option>
                      ))}
                  </Select>
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
                  className="date-picker"
                  style={{ width: "100%" }}
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
                  className="date-picker"
                  style={{ width: "100%" }}
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
                size="large"
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

export default class Employees extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      queryID: "Web_Salaries",
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
          if (key.includes("Date"))
            val = value.add(1, "day").format(dateFormat);
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
              BeginDate: values.BeginDate,
              EndDate: values.EndDate,
            });
          })
          .catch((err) => {
            this.setState({ loading: false });
            console.error(err);
          });
      }
    });
  };

  getSalary = (record, index) => {
    this.setState({ editSalary: true, salaryResult: record ? [record] : [] });
  };

  onCancel = () => {
    this.setState({ editSalary: false });
  };

  onClickEdit = (e) => {};

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    const dropDown = (record, index) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="0">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.getSalary(record, index);
                }}
              >
                Дэлгэрэнгүй
              </Button>
            </Menu.Item>
          </Menu>
        }
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          type="ghost"
          shape="circle"
          icon="more"
          style={{ border: "none" }}
        />
      </Dropdown>
    );

    const addColumns = [
      {
        title: "Үйлдэл",
        width: 100,
        dataIndex: "",
        key: "x",
        align: "right",
        className: "column-header-left",
        render: (text, record, index) => dropDown(record, index),
      },
    ];
    const customRender = (text, record, field, index) => {
      if (field === "EmpName")
        return (
          <div>
            <Avatar
              icon={<img src={`${record.Gender}` === "M" ? male : female} />}
              src={request.host + "avatars/" + record.EmpCode + ".jpg"}
            />
            <span style={{ marginLeft: "10px" }}>{text}</span>
          </div>
        );
      else if (field === "Wage")
        return (
          <NumberFormat
            value={text}
            displayType="text"
            thousandSeparator={true}
            decimalScale={0}
            fixedDecimalScale={true}
          />
        );
    };

    return (
      <div style={{ margin: "27px" }}>
        <h3>Цалингийн мэдээлэл</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цалин / <Text color="#6b747b">Бүх ажилтан</Text>
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
            rowKey="EmpCode"
            dataSource={this.state.filterResult}
            renderColumns={["EmpName", "Wage"]}
            customRender={customRender}
            addColumns={addColumns}
          />
        </Spin>
        {this.state.editSalary && (
          <Modal
            footer={null}
            bodyStyle={{ padding: "1px", backgroundColor: "#F1F1F1" }}
            visible={this.state.editSalary}
            onCancel={this.onCancel}
            width="1500px"
          >
            <SalariesTable
              Salary={this.state.salaryResult}
              BeginDate={this.state.BeginDate}
              EndDate={this.state.EndDate}
            />
          </Modal>
        )}
      </div>
    );
  }
}
