import React from "react";
import { Row, Col, Card, Modal, Table } from "antd";

import "./HrContent2.css";

export default class HrContent2 extends React.Component {
  state = {
    showReport: false,
    reportData: [],
    reportTitle: "",
  };

  openReport = (title, rows) => {
    this.setState({
      showReport: true,
      reportTitle: title,
      reportData: rows || [],
    });
  };

  handleCloseModal = () => {
    this.setState({
      showReport: false,
      reportData: [],
      reportTitle: ""
    });
  };


  render() {
    const { data, data1, data2, reportData } = this.props;

    if (
      !data ||
      data.length === 0 ||
      !data1 ||
      data1.length === 0 ||
      !data2 ||
      data2.length === 0
    ) {
      return <div></div>;
    }

    const { AvgWorkTime = 0 } = data[0] || {};
    const { C45 = 0, C6090 = 0, CEnd = 0, CNormal = 0 } = data1[0] || {};
    const {
      AverageYears = 0,
      MaxYears = 0,
      MedianYears = 0,
      MinYears = 0,
    } = data2[0] || {};

    const columns = [
      { title: "Ажилтны код", dataIndex: "EmpCode", width: 120 },
      { title: "Ажилтны овог нэр", dataIndex: "FullName", width: 150 },
      { title: "Албан тушаал", dataIndex: "PosName", width: 120 },
      { title: "Хэлтэс", dataIndex: "DepName", width: 150},
      { title: "Гэрээний эхлэх огноо", dataIndex: "HireDate", width: 150 },
      { title: "Гэрээний дуусах огноо", dataIndex: "EndContractDate", width: 150 },
    ];
    return (
      <div className="card-header hr-summary-wrapper">
        <Row gutter={[20, 20]} justify="center">
          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
            <Card className="hr-summary-card">
              <div className="hr-summary-title">Дундаж ажилласан хугацаа</div>

              <div className="hr-summary-main">
                <div className="hr-summary-main-value">{AvgWorkTime}</div>
                <div className="hr-summary-main-unit">жил</div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
            <Card className="hr-summary-card is-clickable" onClick={() => this.openReport("Гэрээний хугацааны дэлгэрэнгүй", reportData)}>
              <div className="hr-summary-title">Гэрээний хугацаа</div>

              <div className="hr-stat-list">
                <div className="hr-stat-row">
                  <span className="hr-stat-label">Дууссан</span>
                  <span className="hr-stat-value danger">{CEnd}</span>
                </div>
                <div className="hr-stat-row">
                  <span className="hr-stat-label">45 хоногоос бага</span>
                  <span className="hr-stat-value warning">{C45}</span>
                </div>
                <div className="hr-stat-row">
                  <span className="hr-stat-label">60-90 хоног дотор</span>
                  <span className="hr-stat-value">{C6090}</span>
                </div>
                <div className="hr-stat-row">
                  <span className="hr-stat-label">Хэвийн</span>
                  <span className="hr-stat-value success">{CNormal}</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
            <Card className="hr-summary-card">
              <div className="hr-summary-title">Ажилласан жил</div>

              <div className="hr-stat-list">
                <div className="hr-stat-row">
                  <span className="hr-stat-label">Average</span>
                  <span className="hr-stat-value">{Number(AverageYears).toFixed(1)} жил</span>
                </div>
                <div className="hr-stat-row">
                  <span className="hr-stat-label">Median</span>
                  <span className="hr-stat-value">{Number(MedianYears).toFixed(1)} жил</span>
                </div>
                <div className="hr-stat-row">
                  <span className="hr-stat-label">Max</span>
                  <span className="hr-stat-value">{Number(MaxYears).toFixed(1)} жил</span>
                </div>
                <div className="hr-stat-row">
                  <span className="hr-stat-label">Min</span>
                  <span className="hr-stat-value">{Number(MinYears).toFixed(1)} сар</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Modal
          title={this.state.reportTitle}
          visible={this.state.showReport}
          onCancel={this.handleCloseModal}
          footer={null}
          width={1200}
          destroyOnClose
        >
          <Table
            className="new_table"
            columns={columns}
            dataSource={this.state.reportData}
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