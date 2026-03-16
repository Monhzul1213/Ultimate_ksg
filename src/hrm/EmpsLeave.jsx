import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Button,
  Select,
  Form,
  notification,
  Spin,
  Menu,
  Card,
  Dropdown,
  Row,
  Col,
  Typography,
  DatePicker,
  Tag,
} from "antd";
import "./EmpsLeave.css";
import "../route/mainRoute.css";
import moment, { isMoment } from "moment";
import cookie from "react-cookies";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import Leave from "./EmpsLeaveModal";

const { Option } = Select;
const { Text } = Typography;
const dateFormat = "YYYY.MM.DD";
class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, baseData, loading } = this.props;
    const { getFieldDecorator } = form;
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    return (
      <div>
        <Row gutter={[20, 20]} style={{ marginBottom: "10px" }}>
          <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
            <Card
              bodyStyle={{ height: "80px", padding: "10px" }}
              style={{ borderRadius: "8px" }}
            >
              <Row>
                <Row>
                  {" "}
                  <p
                    style={{ fontSize: "10pt", marginBottom: "0px" }}
                    align="center"
                  >
                    Ээлжийн амралтаа эдэлсэн ажилтан
                  </p>
                </Row>
                <Row>
                  <h4
                    align="center"
                    style={{ fontSize: "13pt", marginTop: "6px" }}
                  >
                    <b>
                      {baseData &&
                      baseData.Table &&
                      baseData.Table[0].RelaxedCount != null
                        ? baseData.Table[0] &&
                          `${baseData.Table[0].RelaxedCount} / ${baseData.Table[0].EmpCount}`
                        : 0 +
                          " / " +
                          `${
                            baseData &&
                            baseData.Table &&
                            baseData.Table[0].EmpCount
                          }`}
                    </b>
                  </h4>
                </Row>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
            <Card
              bodyStyle={{ height: "80px", padding: "10px" }}
              style={{ borderRadius: "8px" }}
            >
              <Row>
                <Row>
                  <p
                    style={{ fontSize: "10pt", marginBottom: "0px" }}
                    align="center"
                  >
                    Ээлжийн амралтын хоног нь дутуу ажилтан
                  </p>
                </Row>
                <Row>
                  <h4
                    align="center"
                    style={{ fontSize: "13pt", marginTop: "6px" }}
                  >
                    <b>
                      {baseData &&
                      baseData.Table &&
                      baseData.Table[0].LeftRelaxCount != null
                        ? baseData.Table[0] &&
                          `${baseData.Table[0].LeftRelaxCount} / ${baseData.Table[0].EmpCount}`
                        : 0 +
                          " / " +
                          `${
                            baseData &&
                            baseData.Table &&
                            baseData.Table[0].EmpCount
                          }`}
                    </b>
                  </h4>
                </Row>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
            <Card
              bodyStyle={{ height: "80px", padding: "10px" }}
              style={{ borderRadius: "8px" }}
            >
              <Row>
                <Row>
                  <p
                    style={{ fontSize: "10pt", marginBottom: "0px" }}
                    align="center"
                  >
                    Яг одоо амралттай байгаа ажилтан
                  </p>
                </Row>
                <Row>
                  <h4
                    align="center"
                    style={{ fontSize: "13pt", marginTop: "6px" }}
                  >
                    <b>
                      {baseData &&
                      baseData.Table &&
                      baseData.Table[0].RelaxingCount != null
                        ? baseData.Table[0] &&
                          `${baseData.Table[0].RelaxingCount} / ${baseData.Table[0].EmpCount}`
                        : 0 +
                          " / " +
                          `${
                            baseData &&
                            baseData.Table &&
                            baseData.Table[0].EmpCount
                          }`}
                    </b>
                  </h4>
                </Row>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xxl={6}>
            <Card
              bodyStyle={{ height: "80px", padding: "10px" }}
              style={{ borderRadius: "8px" }}
            >
              <Row style={{ width: "100%" }}>
                <Row>
                  <p
                    style={{ fontSize: "10pt", marginBottom: "0px" }}
                    align="center"
                  >
                    Зөвшөөрөл хүлээгдэж байгаа хүсэлт
                  </p>
                </Row>
                <Row>
                  <h4
                    align="center"
                    style={{ fontSize: "13pt", marginTop: "6px" }}
                  >
                    <b>
                      {baseData &&
                      baseData.Table &&
                      baseData.Table[0].RequestCount != null
                        ? baseData.Table[0] && baseData.Table[0].RequestCount
                        : 0}
                    </b>
                  </h4>
                </Row>
              </Row>
            </Card>
          </Col>
        </Row>
        <Form onSubmit={onSubmitForm} autoComplete="off">
          <Row gutter={[20, 12]}>
            <Col xs={24} sm={24} md={12} lg={8} xl={5}>
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
            <Col xs={24} sm={24} md={12} lg={8} xl={5}>
              <Form.Item style={{ marginBottom: 0 }}>
                <div className="select-input-hei">
                  {getFieldDecorator("Status", {
                    initialValue:
                      baseData &&
                      baseData.Table1 &&
                      baseData.Table1[0] &&
                      baseData.Table1[0].ValueNum.toString(),
                  })(
                    <Select
                      disabled={loading}
                      type="flex"
                      allowClear={true}
                      placeholder="Ээлжийн амралтын статус сонгох"
                      dropdownMatchSelectWidth={false}
                      className="place"
                      showSearch
                      optionFilterProp="children"
                    >
                      {baseData &&
                        baseData.Table1 &&
                        baseData.Table1.map((status) => (
                          <Option key={status.ValueNum}>
                            {status.ValueStr1}
                          </Option>
                        ))}
                    </Select>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={5}>
              <Form.Item style={{ marginBottom: 0 }}>
                {getFieldDecorator("BeginDate", {
                  initialValue: moment([moment().year()]),
                })(
                  <DatePicker
                    disabled={loading}
                    placeholder="Эхлэх огноо"
                    style={{ width: "100%" }}
                    className="date-picker"
                    allowClear={false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={5}>
              <Form.Item style={{ marginBottom: 0 }}>
                {getFieldDecorator("EndDate", {
                  initialValue: moment([moment().year(), moment().month() + 1]),
                })(
                  <DatePicker
                    disabled={loading}
                    placeholder="Дуусах огноо"
                    style={{ width: "100%" }}
                    className="date-picker"
                    allowClear={false}
                  />
                )}
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={{ span: 12, offset: 12 }}
              lg={{ span: 8, offset: 8 }}
              xl={{ span: 4, offset: 0 }}
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
      </div>
    );
  }
}

const WrappedFilterForm = Form.create({ name: "filter_form" })(FilterForm);
var curIndex = -1;

export default class EmpsLeave extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      queryID: "Web_hrRelaxRequestAd",
    };
  }

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "Web_hrRelaxRequest" }),
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

  filter = (values, update) => {
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
        var filterResult = [];
        if (update) {
          if (
            data.retData &&
            data.retData.Table &&
            data.retData.Table.length > 0
          ) {
            if (this.state.filterResult) {
              filterResult = [...this.state.filterResult];
              Object.keys(data.retData.Table[0]).forEach((key) => {
                filterResult[curIndex][key] = data.retData.Table[0][key];
              });
            } else filterResult = data.retData.Table;
          }
        } else
          filterResult =
            data.retData && data.retData.Table ? data.retData.Table : [];
        this.setState({ filterResult, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  getEmp = (record, index) => {
    curIndex = index;
    this.setState({ editEmp: true, empResult: record ? [record] : [] });
  };

  onSubmitForm = (e) => {
    e && e.preventDefault();
    const { form } = this.formRef.props;
    form.validateFields({ first: true }, (err, values) => {
      if (!err) this.filter(values);
    });
  };

  onSuccess = (data) => {
    this.setState({ editEmp: false });
    if (data && data.Table && data.Table.length > 0)
      this.filter({ RowRecID: data.Table[0].RowRecID }, true);
  };

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    const dropDown = (record, index) => (
      <Dropdown
        disabled={record.Status > 0}
        overlay={
          <Menu>
            <Menu.Item key="0">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.getEmp(record, index);
                }}
              >
                Шийдвэрлэх
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

    const customRender = (text, record) => {
      switch (record.Status) {
        case 1:
          return (
            <Tag color="#87d068">
              {this.state.baseData &&
                this.state.baseData.Table1 &&
                this.state.baseData.Table1[1].ValueStr1}
            </Tag>
          );
        case 2:
          return (
            <Tag color="#108ee9">
              {this.state.baseData &&
                this.state.baseData.Table1 &&
                this.state.baseData.Table1[2].ValueStr1}
            </Tag>
          );
        case 4:
          return (
            <Tag color="#f50">
              {this.state.baseData &&
                this.state.baseData.Table1 &&
                this.state.baseData.Table1[3].ValueStr1}
            </Tag>
          );
        case 0:
          return (
            <Tag color="#A57EE3">
              {this.state.baseData &&
                this.state.baseData.Table1 &&
                this.state.baseData.Table1[0].ValueStr1}
            </Tag>
          );
      }
    };

    return (
      <Spin spinning={this.state.loading} className="spin-loading">
        <div style={{ margin: "27px" }}>
          <div>
            <h3>Ажилтнуудын ээлжийн амралт</h3>
            <h4 style={{ marginBottom: "30px" }}>
              Хүний нөөц / Цагийн бүртгэл /
              <Text color="#6b747b">Бүх ажилтан</Text>
            </h4>
          </div>
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
            renderColumns={["Status"]}
            customRender={customRender}
            addColumns={addColumns}
          />
          {this.state.editEmp && (
            <Leave
              visible={true}
              data={{
                EmpRelax: this.state.empResult,
                Relax: this.state.baseData.Table1,
              }}
              onSuccess={this.onSuccess}
            />
          )}
        </div>
      </Spin>
    );
  }
}
