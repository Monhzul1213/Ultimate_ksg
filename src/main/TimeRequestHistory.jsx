import React from "react";
import {
  Layout,
  Table,
  Input,
  Button,
  notification,
  Icon,
  Tag,
  Typography,
} from "antd";
import Highlighter from "react-highlight-words";
import cookie from "react-cookies";
//import './TimeConfirm.css';
//import axios from 'axios';
import request from "@/insurance/PostRequest.js";

const { Text } = Typography;

class compon extends React.Component {
  constructor(props) {
    super(props);
    const cookieUser = cookie.load("LoggedSysuser");

    this.state = {
      cookieUser,
    };
  }
  componentDidMount() {
    this.state.cookiedata = cookie.load("LoggedSysuser");
    this.funcs.init();
  }

  state = {
    loading: false,
    iconLoading: false,
    filteredInfo: null,
    sortedInfo: null,
    activeRow: 0,
    cookiedata: "",
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
        textToHighlight={text.toString()}
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
    init: () => {
      this.setState({
        loading: true,
      });
      request
        .post("getTsTimeFingerHistory", {
          token: this.state.cookiedata.token,
          pName: this.state.cookiedata.EmpCode,
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
      });
    },
  };

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
      },
      {
        key: "ReasonName",
        dataIndex: "ReasonName",
        title: "Шалтгааны нэр",
        align: "left",
      },
      {
        key: "ReasonDescr",
        dataIndex: "ReasonDescr",
        title: "Шалтгаан",
        align: "left",
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
        key: "CurrStatus",
        dataIndex: "CurrStatus",
        title: "Төлөв",
        align: "center",
        render: (a, i) => {
          return (
            <Tag
              color={
                a === "Pending" ? "magenta" : a === "Void" ? "red" : "green"
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
              {a}
            </Tag>
          );
        },
      },
    ],
  };
  tableData = { data: [] };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    return (
      <div style={{ margin: "27px" }}>
        <h3>Цагийн хүсэлтийн түүх</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цагийн бүртгэл /
          <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1,
          )}`}</Text>
        </h4>
        <Table
          columns={this.table.columns}
          dataSource={this.tableData.data}
          onChange={this.onChange}
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
          scroll={{ x: "max-content" }}
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
