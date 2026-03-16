import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Button,
  Select,
  Radio,
  Icon,
  Form,
  notification,
  Spin,
  Menu,
  Card,
  Dropdown,
  Row,
  Col,
  Avatar,
  Typography,
} from "antd";
import "./BirthDay.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import ProfileModal from "./ProfileFullEditModal";
import male from "@/image/male.png";
import female from "@/image/female.png";

const { Option } = Select;
const { Text } = Typography;

class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, baseData, loading } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={onSubmitForm} autoComplete="off">
        <Row gutter={[16, 16]} type="flex"></Row>
      </Form>
    );
  }
}

const WrappedFilterForm = Form.create({ name: "filter_form" })(FilterForm);
var curIndex = -1;

export default class BirthDay extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      viewType: "card",
      queryID: "Web_EmployeesBirthDay",
    };
  }

  componentDidMount() {
    this.onSubmitForm();
  }

  filter = (values, update) => {
    var BusinessObject = [];
    Object.entries(values).forEach(([key, value]) => {
      BusinessObject.push({ FieldName: key, Value: value });
    });
    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: this.state.queryID }, replacer),
      })
      .then((res) => {
        const data = res.data;
        console.log("---------------------", data);
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
        this.setState({ filterResult, loading: false, rowCount: 4 });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  getProfile = (record, index) => {
    this.setState({ loading: true });
    request
      .post("Profile_Get", {
        token: this.state.LoggedSysuser.token,
        EmpCode: record && record.EmpCode,
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
        curIndex = index;
        this.setState({
          editProfile: true,
          profileResult: data.retData,
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
      if (!err) {
        this.filter(values);
      }
    });
  };

  onSuccess = (data) => {
    this.setState({ editProfile: false });
    if (data && data.EmpDtl && data.EmpDtl.length > 0)
      this.filter({ EmpCode: data.EmpDtl[0].EmpCode }, true);
  };

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    const addColumns = [
      {
        title: "Үйлдэл",
        width: 100,
        dataIndex: "",
        key: "x",
        align: "right",
        className: "column-header-left",
      },
    ];

    const customRender = (text, record) => {
      return (
        <Link
          to={{
            pathname: `/Profile/${record.EmpCode}`,
          }}
          className="grid-link"
        >
          <Avatar
            icon={<img src={`${record.Gender}` === "M" ? male : female} />}
            src={`${request.host}avatars/${record.EmpCode}.jpg?${Date.now()}`}
          />
          <span style={{ marginLeft: "10px", fontSize: "11pt" }}>{text}</span>
        </Link>
      );
    };

    const cardProps = {
      size: "small",
      headStyle: { borderBottomWidth: "0px", fontSize: "18px" },
      style: {
        height: "100%",
        borderRadius: "4px",
        padding: "2px",
        paddingBottom: "0px",
        minHeight: "180px",
      },
      loading: this.state.loading,
      className: "fade-in",
    };

    const colProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
      xl: 12,
      xxl: 8,
    };

    const colCount = () => {
      var type;
      if (window.innerWidth >= 1600) type = "xxl";
      else if (window.innerWidth >= 1200) type = "xl";
      else if (window.innerWidth >= 992) type = "lg";
      else if (window.innerWidth >= 768) type = "md";
      else if (window.innerWidth >= 576) type = "sm";
      else type = "xs";
      return 24 / colProps[type];
    };

    return (
      <div style={{ margin: "27px" }} className="spin-loading">
        <Spin spinning={this.state.loading} className="spin-loading">
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            baseData={this.state.baseData}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
          />
          {this.state.viewType === "grid" ? (
            <GridView
              QueryID={this.state.queryID}
              rowKey="EmpCode"
              dataSource={this.state.filterResult}
              renderColumns={["EmpName"]}
              customRender={customRender}
              addColumns={addColumns}
            />
          ) : (
            <div>
              <Row type="flex" gutter={[20, 20]}>
                {this.state.filterResult &&
                  this.state.filterResult
                    .slice(0, this.state.rowCount * colCount())
                    .map((row, index) => (
                      <Col key={row.EmpCode} {...colProps}>
                        <Card {...cardProps}>
                          <Row type="flex">
                            <Col span={24}>
                              <div className="employee-view">
                                <div className="employee-img-wrap">
                                  <div className="employee-img">
                                    <Avatar
                                      shape="circle"
                                      style={{
                                        width: "96px",
                                        height: "100px",
                                      }}
                                      icon={
                                        <img
                                          src={
                                            `${row.Gender}` === "M"
                                              ? male
                                              : female
                                          }
                                        />
                                      }
                                      src={`${request.host}avatars/${
                                        row.EmpCode
                                      }.jpg?${Date.now()}`}
                                    />
                                  </div>
                                </div>
                                <div className="employee-basic">
                                  <Row type="flex" gutter={[30, 0]}>
                                    <Col span={24}>
                                      <div
                                        className="employee-info-left"
                                        style={{
                                          height: "100%",
                                        }}
                                      >
                                        <Link
                                          to={{
                                            pathname: `/Profile/${row.EmpCode}`,
                                          }}
                                          className="card-link employee-value"
                                        >
                                          {row.EmpName}
                                        </Link>
                                        <p className="employee-value">
                                          {row.PosTypeDescr
                                            ? row.PosTypeDescr
                                            : "-"}
                                        </p>
                                        <div className="employee-pos">
                                          <p className="employee-value">
                                            {row.Phone ? row.Phone : "-"}
                                          </p>
                                          <p className="employee-value">
                                            {row.WorkMail ? row.WorkMail : "-"}
                                          </p>
                                          <p className="employee-value">
                                            {row.Addr1 ? row.Addr1 : "-"}
                                          </p>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}
              </Row>
              {this.state.filterResult &&
                this.state.rowCount &&
                this.state.filterResult.length >
                  this.state.rowCount * colCount() && (
                  <Button
                    type="dashed"
                    className="load-more"
                    onClick={() => {
                      this.setState((prev) => {
                        return { rowCount: prev.rowCount + 4 };
                      });
                    }}
                  >
                    {" "}
                    Цааш нь...
                  </Button>
                )}
            </div>
          )}
        </Spin>
        {this.state.editProfile && (
          <ProfileModal
            visible={true}
            data={{
              EmpDtl: this.state.profileResult.EmpDtl,
              Gender: this.state.profileResult.hrEmp_Gender,
              Company: this.state.profileResult.Company,
              Department: this.state.profileResult.Department,
              PosType: this.state.profileResult.PosType,
            }}
            onSuccess={this.onSuccess}
          />
        )}
      </div>
    );
  }
}
