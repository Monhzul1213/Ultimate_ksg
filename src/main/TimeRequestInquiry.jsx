import React, { Component } from "react";
import {
  Button,
  Select,
  DatePicker,
  Form,
  notification,
  Table,
  Row,
  Col,
  Typography,
  Input,
  Icon,
  Tag,
} from "antd";

import "../hrm/TimeRTM.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment from "moment";
import request from "../insurance/PostRequest";

const { Option } = Select;
const dateFormat = "YYYY.MM.DD";
const { Text } = Typography;

class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, filterData, loading } = this.props;
    const { getFieldDecorator } = form;
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    return (
      <Form onSubmit={onSubmitForm} autoComplete="off">
        <Row gutter={[16, 16]} type="flex">
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
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
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
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
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item style={{ marginBottom: 0 }}>
              <div className="select-input-hei">
                {getFieldDecorator("Status")(
                  <Select
                    disabled={loading}
                    type="flex"
                    allowClear={true}
                    placeholder="Төлөв"
                    dropdownMatchSelectWidth={false}
                    className="place"
                  >
                    {filterData &&
                        filterData.map((item) => (
                          <Option key={item.ConstKey}>{item.ValueStr1}</Option>
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

export default class TimeRequestInquiry extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      queryID: "HR_AcceptFinger_HistoryInquiry",
      filterData: []
    };
  }

  // componentDidMount() {
  //   this.state.cookiedata = cookie.load("LoggedSysuser");
  //   this.funcs.init();
  // }

  enterLoading = () => {
    this.setState({ loading: true });
  };


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
        this.getInfo();
        this.setState({ baseData: res.data.retData, loading: false });
        this.onSubmitForm();
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  getInfo = () => {
    request
      .post("Get_Constants", {
        token: this.state.LoggedSysuser.token,
        ConstType: "hrEmpAcceptFinger_Status",
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

        this.setState({ filterData: res.data.retData, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  filter = (values) => {
    var BusinessObject = [];
    Object.entries(values).forEach(([key, value]) => {
      if (key.includes("Date")) value = value.format(dateFormat);
      if (value !== "" && value !== undefined && value !== null) {
        BusinessObject.push({ FieldName: key, Value: value });
      }
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
        if (data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: data.retDesc,
          });
          return;
        }

        this.setState({
          filterResult: data.retData.Table,
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
    const { form } = this.filterFormRef.props;
    form.validateFields({ first: true }, (err, values) => {
      if (!err) this.filter(values);
    });
  };

  // getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }) => (
  //     <div style={{ padding: 8 }}>
  //       <Input
  //         ref={(node) => {
  //           this.searchInput = node;
  //         }}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
  //         style={{ width: 188, marginBottom: 8, display: "block" }}
  //       />
  //       <Button
  //         type="primary"
  //         onClick={() => this.handleSearch(selectedKeys, confirm)}
  //         icon="search"
  //         size="small"
  //         style={{ width: 90, marginRight: 8 }}
  //       >
  //         Search
  //       </Button>
  //       <Button
  //         onClick={() => this.handleReset(clearFilters)}
  //         size="small"
  //         style={{ width: 90 }}
  //       >
  //         Reset
  //       </Button>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownVisibleChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => this.searchInput.select());
  //     }
  //   },
  //   render: (text) => (
  //     <Highlighter
  //       highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
  //       searchWords={[this.state.searchText]}
  //       autoEscape
  //       textToHighlight={text.toString()}
  //     />
  //   ),
  // });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  // funcs = {
  //   init: () => {
  //     this.setState({
  //       loading: true,
  //     });
  //     request
  //       .post("getTsTimeFingerHistory", {
  //         token: this.state.cookiedata.token,
  //         pName: this.state.cookiedata.EmpCode,
  //       })
  //       .then(this.funcs.initSucc)
  //       .catch(this.funcs.initErr);
  //   },
  //   initSucc: (data) => {
  //     if (data.data.retType == 0) {
  //       this.tableData.data = data.data.retData.Table;
  //       this.tableData.data.map((a, i) => {
  //         a.key = i;
  //         return a;
  //       });
  //     } else {
  //       notification["error"]({
  //         message: "Алдаа",
  //         description: data.data.retDesc,
  //       });
  //     }
  //     this.setState({
  //       loading: false,
  //     });
  //   },
  //   initErr: (data) => {
  //     notification["error"]({
  //       message: "Алдаа",
  //       description: "Алдаа гарлаа",
  //     });
  //     this.setState({
  //       loading: false,
  //     });
  //   },
  // };

  table = {
    columns: [
      {
        key: "EmpFullname",
        dataIndex: "EmpFullname",
        title: "Ажилтны нэр",
        align: "center",
      },
      {
        key: "SheetDate",
        dataIndex: "SheetDate",
        title: "Огноо",
        align: "center",
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
        key: "ReasonID",
        dataIndex: "ReasonID",
        title: "Шалтгааны код",
        align: "left",        
        width: 150,
      },
      {
        key: "TSReasonReascr",
        dataIndex: "TSReasonReascr",
        title: "Шалтгааны нэр",
        align: "left",
        width: 150,
      },
      {
        key: "ReasonDescr",
        dataIndex: "ReasonDescr",
        title: "Тайлбар",
        align: "left",
        width: 200,
      },
      {
        key: "CheckInTime",
        dataIndex: "CheckInTime",
        title: "Ирсэн",
        align: "center",
        render: (text) => <font color="#1890ff">{text}</font>,
      },
      {
        key: "CheckOutTime",
        dataIndex: "CheckOutTime",
        title: "Явсан",
        align: "center",
        render: (text) => <font color="#1890ff">{text}</font>,
      },
      {
        key: "RegDate",
        dataIndex: "RegDate",
        title: "Хүсэлт гаргасан",
        align: "center",
      },
      {
        key: "Status",
        dataIndex: "Status",
        title: "Төлөв",
        align: "center",
        filterMultiple: false,
        onFilter: (value, record) => record.Status === value,
        render: (a, i) => {
          console.log(a, i)
          return (
            <Tag
              color={
                a === "A" ? "green" : a === "Y" ? "magenta" : "red"
              }
              onClick={() => {
                if (a === "Pending") {
                  return false;
                }
                this.setState({
                  modalLoading: false,
                  visible: true,
                  activeEmployee: i,
                  CheckIn: i.CheckIn,
                  CheckOut: i.CheckOut,
                  OnDuty: i.OnDuty,
                  OffDuty: i.OffDuty,
                  currSheetDate: i.SheetDate,
                });
              }}
            >
              {a === "A" ? "Зөвшөөрсөн" : a === "Y" ? "Бүртгэсэн" : a === "U" ? "Зөвшөөрөөгүй" : a}
            </Tag>
          );
        },
      },
    ],
  };
  tableData = { data: [] };

  render() {
    let { sortedInfo, filteredInfo, filterResult, BeginDate, EndDate } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const beginStr = BeginDate ? BeginDate.format("YYYY.MM.DD") : "";
    const endStr = EndDate ? EndDate.format("YYYY.MM.DD") : "";
    const count = filterResult ? filterResult.length : 0;

    return (
      <div style={{ margin: "27px" }}>
        <h3>Цагийн хүсэлтийн лавлагаа</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цагийн бүртгэл /
          <Text color="#6b747b">{`${this.state.LoggedSysuser.EmpFLName.slice(
            0,
            -1
          )}`}</Text>
        </h4>
        <WrappedFilterForm
          wrappedComponentRef={(inst) => (this.filterFormRef = inst)}
          // baseData={this.state.baseData}
          loading={this.state.loading}
          onSubmitForm={this.onSubmitForm}
          filterData={this.state.filterData}
        />
        {filterResult && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>
              {beginStr} – {endStr} хооронд нийт {count} хүсэлт бүртгэгдсэн.
            </Text>
          </div>
        )}
        <Table
          columns={this.table.columns}
          dataSource={filterResult || []}
          bordered={true}
          loading={this.state.loading}
          className={"table_wrapper"}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
          size={this.props.size ? this.props.size : "default"}
          scroll={{ x: "max-content", y: this.tableHeight }}
          pagination={{ 
            pageSize: 20,
            showTotal: (total, range) => `Нийт ${total} хүсэлтээс ${range[0]}–${range[1]}-г харуулж байна.`
          }}
        />
      </div>
    );
  }
}
