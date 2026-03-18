import React from "react";
import { Row, Col, Card, Modal, Table, Tag } from "antd";
import moment from 'moment';

import "./HrContent3.css";

function formatNumber(num, dec){
  return new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: dec ? dec : 2 }).format(num ? num : 0);
}

class HrContent3 extends React.Component  {
  state = {
    showReport: false
  };

  handleResize = () => {
    this.tableHeight = window.innerHeight - 389;
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  onClick = () => {
    this.setState({ showReport: true });
  };

  handleCloseModal = () => {
    this.setState({ showReport: false});
  };

  render(){
    const { data, data1, data2, data3 } = this.props;

    if (!data || data.length === 0 || !data1 || data1.length === 0 || !data2 || data2.length === 0) {
      return <div></div>;
    }

    const { Money, NextPayDay } = data1[0];
    const { NdshEmp, NdshWorker, TotalSalary, XXOAT} = data2[0];
    const { Arrived, Coming, Free, ShiftLeave, WithoutReason } = data[0];

    const attendanceItems = [
      { label: 'Ирэх ёстой', value: Coming, color: "#1890ff" },
      { label: "Ирсэн", value: Arrived, color: "#52c41a", onClick: this.onClick },
      { label: "Чөлөөтэй", value: ShiftLeave, color: "#13c2c2" },
      { label: "Шалтгаангүй", value: WithoutReason, color: "#f5222d" },
      { label: "Ээлжийн амралттай", value: Free, color: "#faad14" },
    ];

    const columns = [
      { title: "Овог нэр", dataIndex: "EmpLName", width: 150 },
      // { title: "Нэр", dataIndex: "EmpFName", width: 150 },
      { title: "Утас", dataIndex: "Phone", width: 100 },
      { title: "Төлөв", dataIndex: "StatusName", width: 150, render: text => <Tag color={text !== "Хоцорсон" ? "" : "#faad14"} style={{width: 80, textAlign: "center"}}>{text}</Tag> },
      { title: "Ирэх ёстой", dataIndex: "OnDuty", width: 150 },
      { title: "Ирсэн", dataIndex: "CheckIn", width: 150 },
      { title: "Албан тушаал", dataIndex: "PosName", width: 150 },
      { title: "Хэлтэс", dataIndex: "DepName", width: 200 }
    ];

    return ( 
      <div style={{ padding: "10px" }}>
        <Row gutter={[24, 24]} justify="center" style={{margin:0}}>
          <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <Card className="card-padding" title="Today" style={{ borderRadius: 12 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center', 
                  padding: 0
                }}
              >
                {attendanceItems.map((item, index) => (
                  <Card.Grid
                    className='card-grid'
                    key={index}
                    style={{
                      flex: '1 1 45%', 
                      maxWidth: '100%',
                      textAlign: 'center',
                      padding: '10px 0px',
                      backgroundColor: '#f9f9f9',
                      border: 'none',
                      borderRadius: 10,
                      margin: '5px', 
                      cursor: item.onClick ? 'pointer' : 'default',
                    }}
                    onClick={item.onClick}
                  >
                    <p style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</p>
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: item.color,
                        margin: 0,
                      }}
                    >
                      {item.value}
                    </p>
                  </Card.Grid>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={16} sm={16} md={16} lg={16} xl={16} xxl={16}>
            <Card  className="card-padding1" title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Payouts</span>
            <span style={{ fontSize: 15, color: "#999" }}>≈ 1,000,000</span>
          </div>} style={{ borderRadius: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
                <div style={{ background: "#f6ffed", padding: "9px 15px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, color: "#52c41a", fontWeight: 500 }}>Дараагийн цалин</p>
                    <p style={{ fontSize: 20, fontWeight: "bold", margin: 0}}>
                      {moment(NextPayDay).format("YYYY.MM.DD")}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: "#8c8c8c", fontWeight: 400, fontSize: 13 }}>Дүн</p>
                    <p style={{ fontSize: 18, fontWeight: "bold", color: "#1890ff", margin:0}}>
                      {formatNumber(Money)} MNT
                    </p>
                  </div>
                </div>

                <div style={{ background: "#fffbe6", padding: "10px 15px", borderRadius: 10, lineHeight: 1.5 }}>
                  <p style={{ marginBottom: 8, fontWeight: 'bold' }}>Өнгөрсөн сард:</p>
                  <div className="con3_row">
                    <p className="text1"> 💰Нийт олгосон:</p>
                    <p className="text4">{formatNumber(TotalSalary)} MNT</p>
                  </div>
                  <div className="con3_row">
                    <p className="text1">🏢 НДШ (Ажил олгогч):</p>
                    <p className="text4"> {formatNumber(NdshWorker)} MNT</p>
                  </div>
                  <div className="con3_row">
                    <p className="text1">👩‍💼 НДШ (Ажилтан):</p>
                    <p className="text4">{formatNumber(NdshEmp)} MNT</p>
                  </div>
                  <div className="con3_row">
                    <p className="text1">📄 ХХОАТ:</p>
                    <p className="text4"> {formatNumber(XXOAT)} MNT</p>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {this.state.showReport && <Modal
          title="Attendance Report"
          visible={this.state.showReport}
          onCancel={this.handleCloseModal}
          onOk={this.handleCloseModal}
          width={900}
          footer={null}
        >
          <Table
            className="new_table"
            columns={columns}
            dataSource={data3}
            rowKey="attendanceId"
            scroll={{ y: this.tableHeight, x: '100%' }}
          />
        </Modal>}
      </div>
    );
  };

  }
export default HrContent3;