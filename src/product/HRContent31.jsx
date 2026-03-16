import React from "react";
import { Row, Col, Card, notification } from "antd";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import "./HRContent1.css";
import HRContent311 from "./HRContent311";

const topColProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 12,
};

function currencyFormat(num) {
  if(num === null) { return 0 }
 if (typeof num !== "number") { return num}
 return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "₮";
}

function currencyFormat2(num) {
 return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}



class HRContent1 extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
    };
  }

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "CO_017", ModuleID: "IN"  }),
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

        this.setState({ baseData: res.data.retData, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  render() {
    return (
      <div className="card-header">
        <Row gutter={[24, 20]} style={{ marginBottom: "2px" }}>
          <Col span={12} {...topColProps}>
          <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}> <b>LESSEE</b> </Col>
                  <Col span={12} align="right"> <p>last month</p> </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "1px ",
                }}
              />
                <div>
                <Row>
                  <Col span={12}>
                  </Col>
                  <Col span={12}>
                  <h4 align="right" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                     <b> {this.state.baseData && this.state.baseData.Table && this.state.baseData.Table[0].SiteID} </b> 
                  </h4>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={12} {...topColProps}>
          <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}> <b>INVOICE AMOUNT</b> </Col>
                  <Col span={12} align="right"> <p>last month</p> </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "10px ",
                }}
              />
                <div>
                <Row>
                  <Col span={12}>
                  </Col>
                  <Col span={12}>
                  <h4 align="right" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                    <b> {this.state.baseData && this.state.baseData.Table1 && `${currencyFormat(this.state.baseData.Table1[0].TotalFinAmt )}`} </b>
                    </h4>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        <HRContent311 />
      </div>
    );
  }
}
export default HRContent1;
