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
  Modal,
} from "antd";
import "./SalaryLeave.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import PDFJs from "../insurance/PDFJs";
import PDFViewer from "../insurance/PDFViewer";

const { Option } = Select;
const dateFormat = "YYYY.MM.DD";
const { Text } = Typography;

class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, baseData, loading, cookieUser } = this.props;
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
                  placeholder="Эхлэх огноо"
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

export default class SalaryLeave extends Component {
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
      queryID: "Web_SalaryLeave",
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

  onClickPrint = (record) => {
    this.setState({ loading: true });
    request
      .post("Generate_Report", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          ReportID: "HR10015",
          BusinessObject: {
            EmpCode: record.EmpCode,
            RowRecID: record.RowRecID,
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
        if (!res.data.retData) return;

        const reportUrl = encodeURIComponent(
          request.host + "get_inPICount.asmx/Get_Report?key=" + res.data.retData
        );
        this.setState({ showReport: true, reportUrl, loading: false });
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

  onCancelReport = () => {
    this.setState({ showReport: false });
  };

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    // const addColumns = [
    //   {
    //     title: "Хэвлэх",
    //     width: 100,
    //     dataIndex: "",
    //     key: "x",
    //     fixed: "right",
    //     align: "center",
    //     render: (text, record, index) => (
    //       <Button
    //         type="primary"
    //         onClick={() => {
    //           this.onClickPrint(record);
    //         }}
    //       >
    //         Хэвлэх
    //       </Button>
    //     ),
    //   },
    // ];
    return (
      <div style={{ margin: "27px" }}>
        <h3>Амралтын мөнгө</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цалин /{" "}
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
            cookieUser={this.state.cookieUser}
            onSubmitForm={this.onSubmitForm}
          />
          {this.state.showReport && (
            <Modal
              visible={this.state.showReport}
              centered
              bodyStyle={{ height: "80vh" }}
              width="80vw"
              title="Хэвлэх"
              footer={null}
              destroyOnClose
              onCancel={this.onCancelReport}
            >
              <PDFViewer backend={PDFJs} src={this.state.reportUrl} />
            </Modal>
          )}
          <GridView
            QueryID={this.state.queryID}
            rowKey="RowRecID"
            dataSource={this.state.filterResult}
            // addColumns={addColumns}
          />
        </Spin>
      </div>
    );
  }
}
