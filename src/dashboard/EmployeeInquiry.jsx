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
import "../hrm/Employees.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import request from "../insurance/PostRequest";
import GridView from "../base/GridView";
import ProfileModal from "../hrm/ProfileFullEditModal";
import male from "@/image/male.png";
import female from "@/image/female.png";
import CryptoJS from "crypto-js";
import { withRouter } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, baseData, loading, fromDashboard } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={onSubmitForm} autoComplete="off">
        <Row gutter={[16, 16]} type="flex">
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={4}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("EmpCode")(
                <Input
                  disabled={loading}
                  style={{ height: "52px" }}
                  placeholder={"Ажилтны код"}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={4}>
            <Form.Item style={{ marginBottom: 0 }}>
              {getFieldDecorator("EmpFName")(
                <Input
                  disabled={loading}
                  style={{ height: "52px" }}
                  placeholder={"Ажилтны нэр"}
                />
              )}
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
                    placeholder={"Хэлтэс тасаг"}
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
              <div className="select-input-hei">
                {getFieldDecorator("PosType")(
                  <Select
                    disabled={loading}
                    allowClear={true}
                    placeholder={"Албан тушаал"}
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
                {getFieldDecorator("Status", {
                  initialValue:
                    baseData &&
                    baseData.hrEmp_Status &&
                    baseData.hrEmp_Status[1] &&
                    baseData.hrEmp_Status[1].ConstKey,
                })(
                  <Select
                    disabled={fromDashboard}
                    allowClear={true}
                    placeholder={"Статус"}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 500 }}
                    className="place"
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData &&
                      baseData.hrEmp_Status &&
                      baseData.hrEmp_Status
                        .filter((status) =>
                          ["A", "R", "S"].includes(status.ConstKey)
                        )
                        .map((hrEmp_Status) => (
                          <Option key={hrEmp_Status.ConstKey}>
                            {hrEmp_Status.ValueStr1}
                          </Option>
                        ))}
                  </Select>
                )}
              </div>
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
                {"ХАЙХ"}
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

class EmployeeInquiry extends Component {
  constructor(props) {
    super(props);

    // Read from localStorage (Dashboard-аас орсон үед)
    const dataType = localStorage.getItem("passedDataType") || null;
    let passedData = [];
    try {
      const storedData = localStorage.getItem("passedData");
      if (storedData) {
        passedData = JSON.parse(storedData);
      }
    } catch (e) {
      console.error(e);
    }

    // Хуучин болон шинэ localStorage утгуудыг шууд цэвэрлэнэ
    localStorage.removeItem("passedDataType");
    localStorage.removeItem("passedData");
    localStorage.removeItem("passedData1");
    localStorage.removeItem("passedData2");

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      viewType: "card",
      queryID: "Web_Employees",
      passedData,
      dataType 
    };
  }



  componentDidMount() {
    request
      .post("Employees_Initialize", {
        token: this.state.LoggedSysuser.token,
        Language: localStorage.getItem("i18nextLng")
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

        this.setState({ baseData: res.data.retData, loading: false }, () => {
          const lockedStatus = this.getLockedStatus();
          const { form } = this.formRef.props;

          if (lockedStatus) {
            form.setFieldsValue({
              Status: lockedStatus
            });
          }

          this.onSubmitForm();
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location && prevProps.location && this.props.location.key !== prevProps.location.key) {
      const dataType = localStorage.getItem("passedDataType") || null;
      let passedData = [];
      try {
        const storedData = localStorage.getItem("passedData");
        if (storedData) {
          passedData = JSON.parse(storedData);
        }
      } catch (e) {
        console.error(e);
      }

      localStorage.removeItem("passedDataType");
      localStorage.removeItem("passedData");
      localStorage.removeItem("passedData1");
      localStorage.removeItem("passedData2");

      this.setState({
        passedData,
        dataType
      }, () => {
        const lockedStatus = this.getLockedStatus();
        const { form } = this.formRef.props;

        const defaultStatus = this.state.baseData && this.state.baseData.hrEmp_Status && this.state.baseData.hrEmp_Status[1] && this.state.baseData.hrEmp_Status[1].ConstKey;
        form.setFieldsValue({
          Status: lockedStatus || defaultStatus
        });

        this.onSubmitForm();
      });
    }
  }

  getLockedStatus = () => {
    const { dataType } = this.state;

    if (dataType === "sack") return "S";
    if (dataType === "new") return "A";

    return undefined;
  };

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

        let filterResult = [];
        if (update) {
          if (data.retData.Table.length > 0) {
            if (this.state.filterResult) {
              filterResult = [...this.state.filterResult];
              Object.keys(data.retData.Table[0]).forEach((key) => {
                filterResult[curIndex][key] = data.retData.Table[0][key];
              });
            } else filterResult = data.retData.Table;
          }
        } else {
          filterResult = data.retData.Table ? data.retData.Table : [];
        }

        if (this.state.passedData.length > 0) {
          const passedEmpCodes = this.state.passedData.map(e => e.EmpCode);
          filterResult = filterResult.filter(e =>
            passedEmpCodes.includes(e.EmpCode)
          );
        }

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
    const lockedStatus = this.getLockedStatus();

    form.validateFields((err, values) => {
      if (!err) {
        if (lockedStatus) {
          values.Status = lockedStatus;
        }

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

    const dropDown = (record, index) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="0">
              <Link
                to={{
                  pathname: `/Profile`,
                }}
                className="grid-link"
                onClick={() => {
                  const encryptedEmpCode = CryptoJS.AES.encrypt(
                    record.EmpCode,
                    "secretKey"
                  ).toString();

                  // localStorage руу өгөгдөл хадгалах
                  localStorage.setItem("id0356123", encryptedEmpCode);
                }}
              >
                <Button type="link" size="small">
                  {"Дэлгэрэнгүй"}
                </Button>
              </Link>
            </Menu.Item>
            <Menu.Item key="1">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  this.getProfile(record, index);
                }}
              >
                {"Засах"}
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
      return (
        <Link
          to={{
            pathname: `/Profile`,
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

    const onClick = () => {
      this.props.history.push("/HRDashboard");
    };

    const fromDashboard = !!this.state.dataType;

    return (
      <div style={{ margin: "27px" }} className="spin-loading">
        {fromDashboard ? <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 30, flexFlow: 'row' }}>
            {/* {fromDashboard && ( */}
              <button style={{ marginRight: 10, padding: "4px 10px", border: "none", borderRadius: "4px", background: "#1890ff", color: "#fff", cursor: "pointer" }} onMouseOver={(e) => (e.target.style.background = "#549ffaff")} onMouseOut={(e) => (e.target.style.background = "#1890ff")} onClick={onClick}>
                <ArrowLeftOutlined onClick={onClick} style={{ fontSize: 15 }} />
              </button>
            {/* )} */}
            {/* {!fromDashboard && <h3>{"Ажилтны лавлагаа"}</h3>} */}
            <h4>Dashboard / <Text color="#6b747b">Ажилтны дэлгэрэнгүй</Text></h4>
          </div>

          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "27px",
            }}
          >
            <Radio.Group
              defaultValue={this.state.viewType}
              onChange={(e) => {
                this.setState({ viewType: e.target.value });
              }}
            >
              <Radio.Button value="card">
                <Icon type="appstore" />
              </Radio.Button>
              <Radio.Button value="grid">
                <Icon type="menu" />
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        :
        <div>
          <h3>Ажилтны лавлагаа</h3>
          <h4 style={{ marginBottom: "30px" }}>
            Хүний нөөц / Бүртгэл /<Text color="#6b747b">Ажилтны лавлагаа</Text>
          </h4>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "27px",
            }}
          >
            <Radio.Group
              defaultValue={this.state.viewType}
              onChange={(e) => {
                this.setState({ viewType: e.target.value });
              }}
            >
              <Radio.Button value="card">
                <Icon type="appstore" />
              </Radio.Button>
              <Radio.Button value="grid">
                <Icon type="menu" />
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>}

        <Spin spinning={this.state.loading} className="spin-loading">
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            baseData={this.state.baseData}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
            fromDashboard={fromDashboard}
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
                                    <Link
                                      // to={{
                                      //   pathname: `/Profile`,
                                      // }}
                                    >
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
                                    </Link>
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
                                        {/* <Link
                                          to={{
                                            pathname: `/Profile`,
                                          }}
                                          onClick={() => {
                                            const encryptedEmpCode =
                                              CryptoJS.AES.encrypt(
                                                row.EmpCode,
                                                "secretKey"
                                              ).toString();

                                            // localStorage руу өгөгдөл хадгалах
                                            localStorage.setItem(
                                              "id0356123",
                                              encryptedEmpCode
                                            );
                                          }}
                                          className="card-link employee-value"
                                          style={{
                                            display: "block",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            maxWidth: "100%",
                                          }}
                                        >
                                          {row.EmpName}
                                        </Link> */}
                                        <p
                                          className=" employee-value"
                                          style={{
                                            display: "block",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            maxWidth: "100%",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            color: "#0A5287",
                                            marginBottom: "5px",
                                          }}
                                        >
                                          {row.EmpName}
                                        </p>
                                        <p
                                          className="employee-value"
                                          style={{
                                            display: "-webkit-box", // Use flexbox for handling multi-line truncation
                                            webkitBoxOrient: "vertical", // Set the box orientation to vertical
                                            overflow: "hidden", // Hide overflowing text
                                            textOverflow: "ellipsis", // Display ellipses for overflowed text
                                            webkitLineClamp: 2, // Limit the text to 2 lines
                                            maxWidth: "100%", // Ensure the container adjusts to available space
                                          }}
                                        >
                                          {row.PosTypeDescr
                                            ? row.PosTypeDescr
                                            : "-"}
                                        </p>

                                        <p
                                          className="employee-value"
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "100%",
                                          }}
                                        >
                                          {row.Phone ? row.Phone : "-"}
                                        </p>
                                        <p
                                          className="employee-value"
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "100%",
                                          }}
                                        >
                                          {row.WorkMail ? row.WorkMail : "-"}
                                        </p>
                                        <p
                                          className="employee-value"
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "75%",
                                          }}
                                        >
                                          {"-"}
                                        </p>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>

                                {/* <div className="emp-edit">
                                  {dropDown(row, index)}
                                </div> */}
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
                    {"Цааш нь..."}
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
export default withRouter(EmployeeInquiry);