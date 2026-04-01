import React from "react";
import { Row, Col, Card } from "antd";
import { withRouter } from "react-router-dom";

import "./HrContent1.css";
import { ArrowRightOutlined } from "@ant-design/icons";

class HrContent1 extends React.Component {
  handleResize = () => {
    this.tableHeight = window.innerHeight - 380;
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  onClickNewEmp = () => {
    localStorage.setItem("passedDataType", "new");
    localStorage.setItem("passedData1", JSON.stringify(this.props.data1));
    this.props.history.push("/EmployeeInquiry");
  };

  onClickSackEmp = () => {
    console.log(this.props);
    
    localStorage.setItem("passedDataType", "sack");
    localStorage.setItem("passedData2", JSON.stringify(this.props.data2));
    this.props.history.push("/EmployeeInquiry");
  };

  handleCloseModal = () => {
    this.setState({ showReport: false, showReport1: false });
  };

  render() {
    const { data } = this.props;

    if (!data || data.length === 0) {
      return <div></div>;
    }

    const {
      TotalEmp = 0,
      NewEmp = 0,
      SackEmp = 0,
      NewEmpAgo = 0,
      SackEmpAgo = 0,
      TotalEmpAll = 0,
    } = data[0] || {};

    const detailData = [
      {
        label: "Total Active Employees",
        value: TotalEmp,
        subText: `Total registered: ${TotalEmpAll}`,
        clickable: false,
      },
      {
        label: "New Employees",
        value: NewEmp,
        subText: `Previous month: ${NewEmpAgo}`,
        onClick: this.onClickNewEmp,
        clickable: true,
      },
      {
        label: "Resigned Employees",
        value: SackEmp,
        subText: `Previous month: ${SackEmpAgo}`,
        onClick: this.onClickSackEmp,
        clickable: true,
      },
    ];

    return (
      <div className="card-header hr-overview-wrapper">
        <Row gutter={[20, 20]} justify="center">
          {detailData.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
              <Card className={`hr-overview-card ${item.clickable && item.value > 0 ? "is-clickable" : ""}`} onClick={item.clickable && item.value > 0 ? item.onClick : null}>
                <div className="hr-overview-title">{item.label}</div>

                <div className="hr-overview-value">{item.value}</div>

                <div className="hr-overview-subtext">{item.subText}</div>

                {/* {item.clickable && item.value > 0 ? (
                  <div className="hr-overview-action" >
                    <ArrowRightOutlined />
                  </div>
                ) : null} */}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default withRouter(HrContent1);