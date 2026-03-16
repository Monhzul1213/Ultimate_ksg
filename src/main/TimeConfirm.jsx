import React from "react";
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
} from "antd";
import Highlighter from "react-highlight-words";
import cookie from "react-cookies";
import "./TimeConfirm.css";
import axios from "axios";
import request from "@/insurance/PostRequest.js";

const { TextArea } = Input;
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
    init: () => {
      this.setState({
        loading: true,
      });
      request
        .post("getTsTimeFingerRequest", {
          token: this.state.cookiedata.token,
          pName: this.state.cookiedata.EmpCode,
          sheetdate: "Azzaya",
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

  table = {
    columns: [
      {
        key: "EmpCode",
        dataIndex: "EmpCode",
        title: "Ажилтны код",
        align: "center",
      },
      {
        key: "EmpFullname",
        dataIndex: "EmpFullname",
        title: "Ажилтны нэр",
        align: "center",
      },
      {
        key: "Descr",
        dataIndex: "Descr",
        title: "Хэлтэс",
        align: "center",
      },
      ,
      {
        key: "PosName",
        dataIndex: "PosName",
        title: "Албан тушаал",
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
        //...this.getColumnSearchProps('SheetDate'),
      },
      {
        key: "ReasonDescr",
        dataIndex: "ReasonDescr",
        title: "Тайлбар",
        align: "left",
      },
      {
        key: "CheckInTime",
        dataIndex: "CheckInTime",
        title: "Ирсэн",
        align: "center",
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
        //...this.getColumnSearchProps('CheckInTime'),
      },
      {
        key: "CheckOutTime",
        dataIndex: "CheckOutTime",
        title: "Явсан",
        align: "center",
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
        //...this.getColumnSearchProps('CheckOutTime'),
      },
      {
        key: "RegDate",
        dataIndex: "RegDate",
        title: "Хүсэлт гаргасан",
        align: "center",
      },
      {
        key: "Allow",
        dataIndex: "Allow",
        title: "Батлах",
        fixed: "right",
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
                  //  console.log( this.state.activeRow && this.state.activeRow.IsOverTime);
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
    ],
  };
  tableData = { data: [] };

  render() {
    console.log(this.state.activeRow);
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
        <Table
          columns={this.table.columns}
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
