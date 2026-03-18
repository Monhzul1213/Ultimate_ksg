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
  localStorage.setItem("passedData7", JSON.stringify(this.props.data7));
  this.props.history.push("/NewEmployeeDetail");
};

onClickSackEmp = () => {
  localStorage.setItem("passedDataType", "sack");
  localStorage.setItem("passedData8", JSON.stringify(this.props.data8));
  this.props.history.push("/NewEmployeeDetail");
};

  handleCloseModal = () => {
    this.setState({ showReport: false, showReport1: false });
  };

  render(){
    const { data } = this.props;
    
    if (!data || data.length === 0) {
      return <div></div>;
    }

    const { TotalEmp, NewEmp, SackEmp, NewEmpAgo, SackEmpAgo, TotalEmpAll } = data[0];

    const detailData = [
      { label: "Total Active Employees", value: TotalEmp, prev1: TotalEmpAll},
      { label: "New Employees", value: NewEmp, prev: NewEmpAgo, onClick: this.onClickNewEmp },
      { label: "Resigned Employees", value: SackEmp, prev: SackEmpAgo, onClick: this.onClickSackEmp },
    ];

    return (
      <div className="card-header" style={{ padding: "20px" }}>
        <Row gutter={[24, 24]} justify="center">
          {detailData.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
              <Card
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
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#555", margin:10 }}>{item.label}</p>
                <h2 style={{ fontSize: "24px", color: "#1890ff", margin: 5 }}>{item.value}</h2>
                <p style={{ fontSize: "12px", color: "#888" }}>{item.prev || item.prev === 0 ? `Previous month: ${item.prev}` : `Total registered: ${item.prev1}`}</p>
                {item.onClick && item.value < 0 ? <ArrowRightOutlined className="click_here" onClick={item.onClick} /> : null}
                {/* {item.prev || item.prev === 0 ? <EllipsisOutlined style={{position: "absolute", bottom: 20, right: 10, fontSize: 20}} /> : null} */}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };
  } 

  export default withRouter(HrContent1);
