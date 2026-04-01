import React from "react";
import { Row, Col, Card } from "antd";

import "./HrContent2.css";

export default class HrContent7 extends React.Component {
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

  render() {
    const { data } = this.props;

    if (
      !data ||
      data.length === 0
    ) {
      return <div></div>;
    }

    const { AvgSalary = 0, MedianSalary = 0, TotalSalary = 0  } = data[0] || {};

     return (
      <div className="card-header hr-top-cards-wrapper">
        <Row gutter={[20, 20]} justify="center">
          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
            <Card className="pay-top-card">
              <div className="hr-top-card-title">Нийт цалингийн цэс</div>
              <div className="hr-top-card-value">{TotalSalary}</div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
            <Card className="pay-top-card">
              <div className="hr-top-card-title">Дундаж цалин</div>
              <div className="hr-top-card-value">{AvgSalary}</div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
            <Card className="pay-top-card">
              <div className="hr-top-card-title">Медиан цалин</div>
              <div className="hr-top-card-value">{MedianSalary}</div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}