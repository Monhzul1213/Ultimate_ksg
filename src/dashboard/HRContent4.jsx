import React from "react";
import { Row, Col, Card, Modal, Table } from "antd";
import "./HrContent2.css";
import { ArrowRightOutlined, ExportOutlined } from "@ant-design/icons";
import moment from "moment";

export default class HrContent4 extends React.Component {
  state = {
    showReport: false,
    reportTitle: "",
    reportType: "",
    reportData: [],
  };

  openReport = (title, type, rows) => {
    this.setState({
      showReport: true,
      reportTitle: title,
      reportType: type,
      reportData: rows || [],
    });
  };

  handleCloseModal = () => {
    this.setState({
      showReport: false,
      reportTitle: "",
      reportType: "",
      reportData: [],
    });
  };

  formatValue = (value) => {
    if (value === null || value === undefined) return "";
    return value;
  };

  getColumnsByType = () => {
    const { reportType } = this.state;
    
    if (reportType === "absent") {
      return [
        {
          title: "Ажилтны код",
          dataIndex: "EmpCode",
          key: "EmpCode",
          width: 120,
        },
        {
          title: "Ажилтны овог нэр",
          dataIndex: "FullName",
          key: "FullName",
          width: 180,
        },
        {
          title: "Ажилтны албан тушаал",
          dataIndex: "PosName",
          key: "PosName",
          width: 180,
        },
        {
          title: "Хуваарьт огноо",
          dataIndex: "SheetDate",
          key: "SheetDate",
          width: 130,
        },
        {
          title: "Ирэх ёстой",
          dataIndex: "OnDuty", 
          render: (text) => moment(text).format("HH:mm:ss"),
          key: "OnDuty",
          width: 120,
        },
        {
          title: "Явах ёстой цаг",
          dataIndex: "OffDuty",
          key: "OffDuty",
          width: 130,
        },
      ];
    }

    if (reportType === "leave") {
      return [
        {
          title: "Ажилтны код",
          dataIndex: "EmpCode",
          key: "EmpCode",
          width: 120,
        },
        {
          title: "Ажилтны овог нэр",
          dataIndex: "FullName",
          key: "FullName",
          width: 180,
        },
        {
          title: "Ажилтны албан тушаал",
          dataIndex: "PosName",
          key: "PosName",
          width: 180,
        },
        {
          title: "Хуваарьт огноо",
          dataIndex: "SheetDate",
          key: "SheetDate",
          width: 130,
        },
        {
          title: "Чөлөөний төрөл",
          dataIndex: "LeaveType",
          key: "LeaveType",
          width: 140,
        },
        {
          title: "Чөлөө эхлэх",
          dataIndex: "LeaveStartDate",
          key: "LeaveStartDate",
          width: 140,
        },
        {
          title: "Чөлөө дуусах",
          dataIndex: "LeaveEndDate",
          key: "LeaveEndDate",
          width: 140,
        },
        {
          title: "Шалтгаан",
          dataIndex: "Reason",
          key: "Reason",
          width: 180,
        },
      ];
    }

    if (reportType === "shift_leave") {
      return [
        {
          title: "Ажилтны код",
          dataIndex: "EmpCode",
          key: "EmpCode",
          width: 120,
        },
        {
          title: "Ажилтны овог нэр",
          dataIndex: "FullName",
          key: "FullName",
          width: 180,
        },
        {
          title: "Ажилтны албан тушаал",
          dataIndex: "PosName",
          key: "PosName",
          width: 180,
        },
        {
          title: "Амралт эхлэх",
          dataIndex: "VacationStartDate",
          key: "VacationStartDate",
          width: 140,
        },
        {
          title: "Амралт дуусах",
          dataIndex: "VacationEndDate",
          key: "VacationEndDate",
          width: 140,
        },
      ];
    }

    return [];
  };

  render() {
    const { data, data1, data2, data3, reportData1, reportData2, reportData3 } = this.props;
    const { showReport, reportTitle, reportData } = this.state;

    if (!data || !data1 || !data2 || !data3 || reportData1 === 0 || reportData2 === 0 || reportData3 === 0) {
      return <div></div>;
    }

    const { Recorded = 0, NotStarted = 0 } = data[0] || {};
    const {
      Chuluutei = 0,
      Tsalintai = 0,
      Tsalingui = 0,
      Tomilolt = 0,
    } = data1[0] || {};
    const { EeljiinAmralt = 0 } = data2[0] || {};
    const { Tasalsan = 0 } = data3[0] || {};

    const columns = this.getColumnsByType().map((col) => ({
      ...col,
      render: (value) => this.formatValue(value),
    }));

    return (
      <div className="card-header hr-top-cards-wrapper">
        <Row gutter={[20, 20]} justify="center">
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Card className={"hr-top-card"}>
              <div className="hr-top-card-title">Ирц бүртгэгдсэн</div>
              <div className="hr-top-card-value">{Recorded}</div>
              <div className="hr-top-card-bottom">
                <span className="mini-badge">
                  хуваарьт цаг эхлээгүй : {NotStarted}
                </span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Card className={`hr-top-card ${Chuluutei >= 0 ? "is-clickable" : ""}`}
              onClick={() =>
                this.openReport("Чөлөөтэй дэлгэрэнгүй", "leave", reportData2)
              }>
              <div className="hr-top-card-title">Чөлөөтэй</div>
              <div className="hr-top-card-value">{Chuluutei}</div>

              <div className="leave-badge-group">
                <span className="leave-badge">цалинтай : {Tsalintai}</span>
                <span className="leave-badge">цалингүй : {Tsalingui}</span>
                <span className="leave-badge">томилолт : {Tomilolt}</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Card className={`hr-top-card ${Chuluutei >= 0 ? "is-clickable" : ""}`}
              onClick={() =>
                this.openReport("Ээлжийн амралтын дэлгэрэнгүй", "shift_leave", reportData3)
              }>
              <div className="hr-top-card-title">Ээлжийн амралттай</div>
              <div className="hr-top-card-value">{EeljiinAmralt}</div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <Card className={`hr-top-card ${Chuluutei >= 0 ? "is-clickable" : ""}`}
              onClick={() =>
                this.openReport("Тасалсан буюу шалтгаангүй дэлгэрэнгүй", "absent", reportData1)
              }>
              <div className="hr-top-card-title">Тасалсан буюу шалтгаангүй</div>
              <div className="hr-top-card-value">{Tasalsan}</div>
              {/* <div className="hr-top-card-action" onClick={() => this.openReport("Тасалсан буюу шалтгаангүй", "absent", reportData1)}>
                <ExportOutlined/>
              </div> */}
            </Card>
          </Col>
        </Row>

        <Modal
          title={reportTitle}
          visible={showReport}
          onCancel={this.handleCloseModal}
          footer={null}
          width={1000}
          destroyOnClose
        >
          <Table
            className="new_table"
            columns={columns}
            dataSource={reportData}
            rowKey={(record, index) => index}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true, y: 400 }}
            locale={{ emptyText: "Мэдээлэл байхгүй" }}
          />
        </Modal>
      </div>
    );
  }
}