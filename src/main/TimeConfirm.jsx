import React, { Component } from "react";
import {
  Table,
  Input,
  Button,
  notification,
  Icon,
  Tag,
  Switch,
  Modal,
  Typography,
  Col,
  Row,
  message,
  Form,
  Select,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";
import cookie from "react-cookies";
import "./TimeConfirm.css";
import "../hrm/Salaries.css";

import request from "@/insurance/PostRequest.js";
import moment from "moment";

const { Option } = Select;
const dateFormat = "YYYY.MM.DD";
const { TextArea } = Input;
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
        <Row gutter={[20, 12]} type="flex">
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5}>
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
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5}>
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
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5}>
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
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5}>
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

class compon extends React.Component {
  constructor(props) {
    super(props);
    const cookieUser = cookie.load("LoggedSysuser");

    this.state = {
      cookieUser,
      queryID: "HR_AcceptFinger",

    };
  }

  componentDidMount(record) {
    this.state.cookiedata = cookie.load("LoggedSysuser");

    request
      .post("Employees_Initialize", {
        token: this.state.cookiedata.token,
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
    if (e) e.preventDefault();
    if (!this.filterFormRef) return;
    const { form } = this.filterFormRef.props;
    form.validateFields({ first: true }, (err, values) => {
      if (!err) {
        this.funcs.init(values);
      }
    });
  };

  showModal = () => {
    this.setState({
      visible1: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible1: false,
    });
    this.funcs.denyTime();
  };

  handleCancel = (e) => {
    this.setState({
      visible1: false,
    });
  };
  showModalC = (record) => {
    this.setState({
      visible2: true,
    });
  };

  handleOkC = (e) => {
    this.setState({
      visible2: false,
      loading: true,
    });
    this.funcs.confirmTime();
  };

  handleCancelC = (e) => {
    this.setState({
      visible2: false,
    });
  };

  state = {
    loading: false,
    iconLoading: false,
    filteredInfo: null,
    iswithwage: false,
    isOvertime: false,
    sortedInfo: null,
    activeRow: 0,
    cookiedata: "",
    visible1: false,
    visible2: false,
    reason: "",
  };

  enterLoading = () => {
    this.setState({ loading: true });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  funcs = {
    denyTime: () => {
      setTimeout(() => {
        this.tableData.data[this.state.activeRow.key].Allow = "deny";
        this.setState({
          tableData: this.tableData,
        });
        request
          .post("getTsTimeFingerDeny", {
            token: this.state.cookiedata.token,
            pName: this.state.cookiedata.username,
            pEmpCode: this.tableData.data[this.state.activeRow.key].EmpCode,
            pSheetdate: this.tableData.data[this.state.activeRow.key].SheetDate,
            pLast: this.tableData.data[this.state.activeRow.key].RegDate,
            pReason: this.state.reason,
          })
          .then(this.funcs.initSuccReq)
          .catch(this.funcs.initErr);
      }, 2000);
    },
    confirmTime: () => {
      setTimeout(() => {
        this.tableData.data[this.state.activeRow.key].Allow = "allow";
        this.setState({
          tableData: this.tableData,
        });
        request
          .post("getTsTimeFingerConfirm", {
            token: this.state.cookiedata.token,
            pName: this.state.cookiedata.UserID,
            pIswithwage: this.state.iswithwage,
            pIsOvertime: this.state.isOvertime,
            pEmpCode: this.tableData.data[this.state.activeRow.key].EmpCode,
            pSheetdate: this.tableData.data[this.state.activeRow.key].SheetDate,
            pLast: this.tableData.data[this.state.activeRow.key].RegDate,
          })
          .then(this.funcs.initSuccReq)
          .catch(this.funcs.initErr);
      }, 2000);
    },
    initSuccReq: (data) => {
      if (data.data.retType == 0) {
        this.funcs.init();
        this.setState({
          iconLoading: false,
          iswithwage: false,
          isOvertime: false,
          reason: "",
        });
      } else {
        notification["error"]({
          message: "Алдаа",
          description: data.data.retDesc,
        });
        this.setState({
          iconLoading: false,
          iswithwage: false,
          isOvertime: false,
        });
      }
    },
    init: (values) => {
      var BusinessObject = [];
      if (values) {
        Object.entries(values).forEach(([key, value]) => {
          if (key.includes("Date") && value) value = value.format(dateFormat);
          if (value !== "" && value !== undefined && value !== null) {
            BusinessObject.push({ FieldName: key, Value: value });
          }
        });
      }
      const replacer = (key, value) => typeof value === "undefined" ? null : value;
      this.setState({
        loading: true,
      });
      request
        .post("Execute_Query", {
          token: this.state.cookiedata.token,
          pName: this.state.cookiedata.EmpCode,
          sheetdate: "Azzaya",
          json: JSON.stringify(
          {
            QueryID: this.state.queryID,
            BusinessObject,
          },
          replacer
        ),
        })
        .then(this.funcs.initSucc)
        .catch(this.funcs.initErr);
    },
    initSucc: (data) => {
      if (data.data.retType == 0) {
        this.tableData.data = data.data.retData.Table;
        this.tableData.data.map((a, i) => {
          a.key = i;
          return a;
        });
      } else {
        notification["error"]({
          message: "Алдаа",
          description: data.data.retDesc,
        });
      }
      this.setState({
        loading: false,
      });
    },
    initErr: (data) => {
      notification["error"]({
        message: "Алдаа",
        description: "Алдаа гарлаа",
      });
      this.setState({
        loading: false,
        reason: "",
        iswithwage: false,
      });
    },
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  getColumns = () => {
    const data = this.tableData.data || [];

    const uniqueEmpCode = [...new Set(data.map((item) => item.EmpCode).filter(Boolean))];
    const empCodeFilters = uniqueEmpCode.map((code) => ({ text: code, value: code }));

    const uniqueEmpFullname = [...new Set(data.map((item) => item.EmpFullname).filter(Boolean))];
    const empFullnameFilters = uniqueEmpFullname.map((name) => ({ text: name, value: name }));

    const uniqueDescr = [...new Set(data.map((item) => item.Descr).filter(Boolean))];
    const descrFilters = uniqueDescr.map((descr) => ({ text: descr, value: descr }));

    const uniquePosName = [...new Set(data.map((item) => item.PosName).filter(Boolean))];
    const posFilters = uniquePosName.map((pos) => ({ text: pos, value: pos }));

    return [
      {
        key: "EmpCode",
        dataIndex: "EmpCode",
        title: "Ажилтны код",
        align: "center",
        width: 150,
        filters: empCodeFilters,
        onFilter: (value, record) => record.EmpCode === value,
      },
      {
        key: "EmpFullname",
        dataIndex: "EmpFullname",
        title: "Ажилтны нэр",
        align: "center",
        width: 170,
        filters: empFullnameFilters,
        onFilter: (value, record) => record.EmpFullname === value,
      },
      {
        key: "Descr",
        dataIndex: "Descr",
        title: "Хэлтэс",
        align: "center",
        width: 250,
        filters: descrFilters,
        onFilter: (value, record) => record.Descr === value,
      },
      {
        key: "PosName",
        dataIndex: "PosName",
        title: "Албан тушаал",
        align: "center",
        width: 300,
        filters: posFilters,
        onFilter: (value, record) => record.PosName === value,
      },
      {
        key: "SheetDate",
        dataIndex: "SheetDate",
        title: "Огноо",
        align: "center",
        width: 120,
        defaultSortOrder: "descend",
        sorter: (a, b) => a.SheetDate > b.SheetDate,
        sortDirections: ["descend", "ascend"],
      },
      {
        key: "Type",
        dataIndex: "Type",
        title: "Төрөл",
        align: "center",
        width: 120,
        filters: [
          {
            text: "Чөлөө",
            value: "Чөлөө",
          },
          {
            text: "Хуруу нөхөх",
            value: "Хуруу нөхөх",
          },
          {
            text: "Илүү цаг",
            value: "Илүү цаг",
          },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.Type.indexOf(value) === 0,
        render: (a, i) => {
          return (
            <Tag
              color={
                a === "Хуруу нөхөх"
                  ? "#2db7f5"
                  : a === "Илүү цаг"
                    ? "#87d068"
                    : "#f5803c"
              }
              onClick={() => {}}
            >
              {a}
            </Tag>
          );
        },
      },
      {
        key: "ReasonDescr",
        dataIndex: "ReasonDescr",
        title: "Тайлбар",
        width: 400,
        align: "left",
      },
      {
        key: "CheckInTime",
        dataIndex: "CheckInTime",
        title: "Ирсэн",
        align: "center",
        width: 100,
        render: (a, i) => {
          return (
            <Tag
              color={i.CheckIn === "Нөхүүлнэ" ? "#2db7f5" : "#CCCCCC"}
              onClick={() => {}}
            >
              {a}
            </Tag>
          );
        },
      },
      {
        key: "CheckOutTime",
        dataIndex: "CheckOutTime",
        title: "Явсан",
        align: "center",
        width: 100,
        render: (a, i) => {
          return (
            <Tag
              color={i.CheckOut === "Нөхүүлнэ" ? "#2db7f5" : "#CCCCCC"}
              onClick={() => {}}
            >
              {a}
            </Tag>
          );
        },
      },
      {
        key: "RegDate",
        dataIndex: "RegDate",
        title: "Хүсэлт гаргасан",
        width: 180,
        align: "center",
      },
      {
        key: "Allow",
        dataIndex: "Allow",
        title: "Батлах",
        fixed: "right",
        width: 120,
        align: "center",
        render: (a, i) => {
          const { activeRow } = this.state;
          return (
            <div>
              <Button
                className="BtnConfirm"
                size="small"
                shape="circle"
                type="primary"
                icon="check"
                onClick={() => {
                  if (i.IsCalculate == "Y")
                    return message.warning(
                      "Цалин бодолт хийгдэж байгаа тул цагийн мэдээг өөрчлөх боломжгүй.",
                    );
                  else {
                    this.setState({ activeRow: i, bb: i.ReasonDescr });
                    this.showModalC();
                  }
                }}
              ></Button>
              <Modal
                className="ReasonModal"
                width={300}
                footer={false}
                onOk={this.handleOkC}
                onCancel={this.handleCancelC}
                title="Хүсэлт зөвшөөрөх"
                visible={this.state.visible2}
              >
                <div className="cancelContent1">
                  <Col>
                    <Row>
                      {this.state.activeRow &&
                      this.state.activeRow.Type == "Чөлөө хүсэх" ? (
                        <div>
                          <Text color="#6b747b"> Цалинтай эсэх : </Text>
                          <Switch
                            onChange={(checked) => {
                              this.setState({
                                iswithwage: checked,
                              });
                            }}
                          />
                        </div>
                      ) : this.state.activeRow &&
                        this.state.activeRow.Type == "Илүү цаг" ? (
                        <div>
                          {activeRow.IsOvertime == "Y" && (
                            <Text color="#6b747b">Цалинтай илүү цаг: </Text>
                          )}
                          <Switch
                            onChange={(checked) => {
                              console.log(checked, this.state.activeRow);
                              this.setState({
                                isOvertime: checked,
                              });
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </Row>
                    <TextArea
                      style={{ marginTop: "10px" }}
                      value={this.state.bb}
                    />
                    <Row>
                      {this.state.activeRow &&
                      this.state.activeRow.fingerStatus == "O" ? (
                        <Button
                          className="cancelBtn"
                          style={{ background: "#06AB56" }}
                          type="danger"
                          onClick={() => {
                            this.handleOkC();
                          }}
                        >
                          Батлах
                        </Button>
                      ) : (
                        <Button
                          className="cancelBtn"
                          type="primary"
                          onClick={() => {
                            this.handleOkC();
                          }}
                        >
                          Зөвшөөрөх
                        </Button>
                      )}
                    </Row>
                  </Col>
                </div>
              </Modal>
              <Button
                className="BtnReject"
                size="small"
                shape="circle"
                type="danger"
                icon="close"
                loading={a === "deny" ? true : false}
                onClick={() => {
                  if (i.IsCalculate == "Y")
                    return message.warning(
                      "Цалин бодолт хийгдэж байгаа тул цагийн мэдээг өөрчлөх боломжгүй.",
                    );
                  else this.setState({ activeRow: i });
                  this.showModal();
                }}
              ></Button>
              <Modal
                className="ReasonModal"
                width={300}
                footer={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                title="Хүсэлт цуцлах"
                visible={this.state.visible1}
              >
                <div className="cancelContent">
                  <TextArea
                    placeholder="шалтгаанаа бичнэ үү"
                    onChange={(a) => {
                      this.setState({
                        reason: a.target.value,
                      });
                    }}
                  />
                  <Button
                    className="cancelBtn"
                    type="primary"
                    onClick={() => {
                      this.handleOk();
                    }}
                  >
                    Цуцлах
                  </Button>
                </div>
              </Modal>
            </div>
          );
        },
      },
    ];
  };
  tableData = { data: [] };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    return (
      <div style={{ margin: "27px" }}>
        <h3>Цагийн баталгаажуулалт</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цагийн бүртгэл /
          <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1,
          )}`}</Text>
        </h4>
        <WrappedFilterForm
          wrappedComponentRef={(inst) => (this.filterFormRef = inst)}
          baseData={this.state.baseData}
          loading={this.state.loading}
          onSubmitForm={this.onSubmitForm}
        />
        <Table
          columns={this.getColumns()}
          dataSource={this.tableData.data}
          onChange={this.handleChange}
          bordered={true}
          loading={this.state.loading}
          className={
            "table-head-withborder" + this.props.className
              ? " " + this.props.className
              : ""
          }
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
          size={this.props.size ? this.props.size : "default"}
          scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          pagination={{ pageSize: 10 }}
          // style={{ background: "#fff" }}
          // scroll={{ x: 100 }}
          // pagination={{ position: "bottom", pageSize: 20 }}
        />
      </div>
    );
  }
}
export default compon;
