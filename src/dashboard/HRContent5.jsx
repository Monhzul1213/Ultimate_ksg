import React from "react";
import { Row, Col, Card } from "antd";

import "./HrContent3.css";

export default class HrContent5 extends React.Component {

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

  render(){
    const { data } = this.props;
    
    if (!data || data.length === 0) {
      return <div></div>;
    }

    return (
      <div className="card-header" style={{ margin: "10px" }}>
        <Row gutter={[24, 24]} justify="center">
          {data.map((item) =>{
              return( 
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                {/* <Card
                  className={"card-padding"}
                  style={{
                    borderRadius: "12px",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    minHeight: "100px", 
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <p style={{ fontSize: "16px", fontWeight: "bold", color: "#555", margin: 0 }}>{item.Uzuulelt}</p>
                  <p style={{ fontSize: "12px", margin: 2 }}>Илүү цаг: {item.Overtime}</p>
                  <p style={{ fontSize: "12px", margin: 2 }}>Ажил таслалт: {item.Absenteesim}</p>
                  <p style={{ fontSize: "12px", margin: 2 }}>Чөлөө: {item.FreeTime}</p>
                  <p style={{ fontSize: "12px", margin: 2 }}>Хоцролт: {item.Latetime}</p>
                </Card> */}
                <Card className="stats-card">
                  <h3 className="title">{item.Uzuulelt}</h3>

                  <div className="stats-container">
                    <div className="stat-item">
                      <span>Илүү цаг</span>
                      <strong>{item.Overtime || 0}</strong>
                      <small>цаг</small>
                    </div>

                    <div className="stat-item">
                      <span>Ажил таслалт</span>
                      <strong>{item.Absenteesim || 0}</strong>
                      <small>цаг</small>
                    </div>

                    <div className="stat-item">
                      <span>Чөлөө</span>
                      <strong>{item.FreeTime || 0}</strong>
                      <small>цаг</small>
                    </div>

                    <div className="stat-item">
                      <span>Хоцролт</span>
                      <strong>{item.Latetime || 0}</strong>
                      <small>цаг</small>
                    </div>
                  </div>
                </Card>
              </Col>)
          })}
        </Row>
      </div>
    );
  };
} 

