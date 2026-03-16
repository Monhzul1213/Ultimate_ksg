import React, { Component } from "react";
import {
  Button,
  Select,
  DatePicker,
  notification,
  Spin,
  Modal,
  Table,
  Typography,
} from "antd";
import "./SalariesTable.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridViewReq from "../base/GridViewReq";
import PDFJs from "../insurance/PDFJs";
import PDFViewer from "../insurance/PDFViewer";
import NumberFormat from "react-number-format";

const { Text } = Typography;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const monthFormat = "YYYY.MM";

export default class SalariesTable extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    var EmpCode;
    var { Salary, BeginDate, EndDate } = props;
    EmpCode = Salary && Salary[0] && Salary[0].EmpCode;
    if (!EmpCode) EmpCode = LoggedSysuser.EmpCode;

    this.state = {
      baseData: undefined,
      cookieUser,
      LoggedSysuser,
      EmpCode,
      BeginDate,
      EndDate,
      loading: false,
      reload: 0,
    };
  }

  reload = () => {
    this.setState({ reload: this.state.reload + 1 });
  };

  handleResize = () => {
    this.tableHeight =
      window.innerHeight - 64 - 60 - 45.46 - 156.36 - 31.99 - 30 - 20 - 32;
    this.reload();
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.setState({ loading: true });
    const BeginDate = this.props.BeginDate
      ? moment(this.props.BeginDate).format(monthFormat)
      : "";
    const EndDate = this.props.BeginDate
      ? moment(this.props.EndDate).format(monthFormat)
      : "";
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "Web_Salary",
          BusinessObject: { EmpCode: this.state.EmpCode, BeginDate, EndDate },
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

        var columns = [
          { title: "Хэлтэс тасаг", dataIndex: "Descr", width: 200 },
          { title: "Он", dataIndex: "SheetYear", width: 80, align: "center" },
          { title: "Сар", dataIndex: "SheetMonth", width: 60, align: "center" },
        ];

        data.retData.Table.forEach((row) => {
          columns.push({
            title: row.ColumnHeader,
            dataIndex: row.ColumnKey,
            width: 120,
            key: row.ColumnKey,
            className: "table-column-left",
            render: (text) => {
              if (row.ColumnFormat && row.ColumnFormat.includes("#")) {
                let opt = {
                  value: text,
                  displayType: "text",
                  thousandSeparator: true,
                  decimalScale: 0,
                  fixedDecimalScale: true,
                };

                return <NumberFormat {...opt} />;
              }
              return text;
            },
          });
        });

        columns.push({
          title: "Хэвлэх",
          width: 90,
          dataIndex: "",
          key: "x",
          align: "center",
          fixed: "right",

          render: (text, record, index) => (
            <Button
              type="primary"
              onClick={() => {
                this.onClickPrint(record);
              }}
            >
              Хэвлэх
            </Button>
          ),
        });

        this.setState({
          filterResult: data.retData && data.retData.Table1,
          columns,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  onClickPrint = (record) => {
    this.setState({ loading: true });
    request
      .post("Generate_Report", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          ReportID: "HR10016",
          Suffix: record.ParentDepartmentID,
          BusinessObject: {
            DepartmentID: record.ParentDepartmentID,
            EmpCode: record.EmpCode,
            SheetYear: record.SheetYear,
            SheetMonth: record.SheetMonth,
            SheetCount: record.SheetCount,
          },
        }),
      })
      .then((res) => {
        const data = res.data;
        console.log("123123123123", data);
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

  onCancelReport = () => {
    this.setState({ showReport: false });
  };

  render() {
    return (
      <div style={{ margin: "27px" }}>
        <h3>Цалингийн хүснэгт</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Цалин / Цалингийн хүснэгт /
          {/* <Text color="#6b747b">{`${this.state.cookieUser.EmpFLName.slice(
            0,
            -1
          )}`}</Text> */}
        </h4>
        <Spin spinning={this.state.loading}>
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
          <Table
            columns={this.state.columns ? this.state.columns : []}
            rowKey="RowNumber"
            dataSource={this.state.filterResult}
            scroll={{ x: "max-content", y: this.tableHeight }}
          />
        </Spin>
      </div>
    );
  }
}
