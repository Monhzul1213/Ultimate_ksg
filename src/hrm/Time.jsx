import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  notification,
  Spin,
  Row,
  Col,
  Typography,
  Modal,
  Dropdown,
  Menu,
} from "antd";
import "./Time.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";

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
        <Row gutter={[20, 20]} type="flex">
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("BeginDate", {
                initialValue: moment([moment().year(), moment().month()]),
              })(
                <DatePicker
                  disabled={loading}
                  placeholder="Он"
                  style={{ width: "100%" }}
                  className="date-picker"
                  allowClear={false}
                  format={dateFormat}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("EndDate", {
                initialValue: moment(today, dateFormat),
              })(
                <DatePicker
                  disabled={loading}
                  placeholder="Сар"
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
            lg={{ span: 24 }}
            xl={{ span: 8 }}
            xxl={{ span: 8 }}
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

export default class Time extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    var { EmpCode } = LoggedSysuser;

    this.state = {
      baseData: undefined,
      loading: true,
      EmpCode,
      cookieUser,
      LoggedSysuser,
      queryID: "tsTimeSummary_EMP",
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

  filter = (values, update) => {
    var BusinessObject = [];
    Object.entries(values).forEach(([key, value]) => {
      if (key.includes("Date")) value = value.format(dateFormat);
      BusinessObject.push({ FieldName: key, Value: value });
    });

    BusinessObject.push({ FieldName: "EmpCode", Value: this.state.EmpCode });
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
        this.setState({
          filterResult,
          loading: false,
          BeginDate: values.BeginDate,
          EndDate: values.EndDate,
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
    const dropDown = (record, index) => (
      <Dropdown
        disabled={record.Reason == 0}
        overlay={
          <Menu>
            <Menu.Item key="0">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.getTime(record, index);
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

    const customRender = (text, record, FieldName) => {
      if (FieldName == "Reason") {
        if (record.Reason > 0) return <span>{record.Reason + " өдөр"}</span>;
        else return <span>-</span>;
      } else if (FieldName == "TotalLostMinute") {
      }
      if (record.TotalLostMinute > 0)
        return <span>{record.TotalLostMinute + " м"}</span>;
      else return <span>-</span>;
    };

    return (
      <div style={{ margin: "27px" }}>
        <h3>Ажилласан цагийн нэгтгэл</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цагийн бүртгэл /{" "}
          <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1
          )}`}</Text>
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
            renderColumns={["Reason", "TotalLostMinute"]}
            customRender={customRender}
            addColumns={addColumns}
          />

          {this.state.editTime && (
            <Modal
              footer={null}
              bodyStyle={{
                paddingTop: "55px",
                backgroundColor: "#F1F1F1",
              }}
              visible={this.state.editTime}
              onCancel={this.onCancel}
              width="1500px"
            >
              <GridView
                QueryID="uspts_tsTimeSummaryDtl"
                rowKey="RowRecID"
                dataSource={this.state.timeResult}
              />
            </Modal>
          )}
        </Spin>
      </div>
    );
  }
}
