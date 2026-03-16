import React from "react";
import { Row, Col, Card, notification } from "antd";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import "./HRContent1.css";

const topColProps = {
  xs: 24,
  sm: 12,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 6,
};

function currencyFormat(num) {
   if(num === null) { return 0 }
  if (typeof num !== "number") { return num}
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "$";
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
        json: JSON.stringify({ QueryID: "CO_016", ModuleID: "IN" }),
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
        <Row gutter={[24, 20]} style={{ marginBottom: "10px" }}>
          <Col span={6} {...topColProps}>
          <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}> <b>SALES AMOUNT</b> </Col>
                  <Col span={12} align="right"> <p>last month</p> </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "2px ",
                }}
              />
                <div>
                <Row>
                  <Col span={12}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                      <b> {this.state.baseData && this.state.baseData.Table1 && `${currencyFormat(this.state.baseData.Table1[0].Amount )}`} </b>
                    </h4>
                  </Col>
                  <Col span={12} style={{ position: "relative" }}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                      <b> {this.state.baseData && this.state.baseData.Table && `${currencyFormat(this.state.baseData.Table[0].Amount )}`} </b>
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Land Side</p>
                  </Col>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Air Side</p>
                  </Col>
                </Row>
                <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "2px ",
                }}
              />
                <Row>
                  <Col span={12}>
                      <b align="left" style={{ marginBottom: "0px" }}>Total</b>
                  </Col>
                  <Col span={12}>
                  <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                    <b> {this.state.baseData && this.state.baseData.Table2 && `${currencyFormat(this.state.baseData.Table2[0].TotalAmount )}`} </b>
                  </h4>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={6} {...topColProps}>
          <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}> <b>TOTAL CUSTOMER</b> </Col>
                  <Col span={12} align="right"> <p>last month</p> </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "2px ",
                }}
              />
                <div>
                <Row>
                  <Col span={12}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                      <b> {this.state.baseData && this.state.baseData.Table4 && `${currencyFormat2(this.state.baseData.Table4[0].UserMNT )}`} </b>
                    </h4>
                  </Col>
                  <Col span={12} style={{ position: "relative" }}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                      <b> {this.state.baseData && this.state.baseData.Table3 && `${currencyFormat2(this.state.baseData.Table3[0].UserUSD )}`} </b>
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Land Side</p>
                  </Col>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Air Side</p>
                  </Col>
                </Row>
                <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "2px ",
                }}
              />
                <Row>
                  <Col span={12}>
                      <b align="left" style={{ marginBottom: "0px" }}>Total</b>
                  </Col>
                  <Col span={12}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                      <b> {this.state.baseData && this.state.baseData.Table5 && `${currencyFormat2(this.state.baseData.Table5[0].UserCount )}`} </b>
                    </h4>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={6} {...topColProps}>
          <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}> <b>AVERAGE AMOUNT</b> </Col>
                  <Col span={12} align="right"> <p>last month</p> </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "2px ",
                }}
              />
                <div>
                <Row>
                  <Col span={12}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                      <b> {this.state.baseData && this.state.baseData.Table7 && `${currencyFormat(this.state.baseData.Table7[0].Amount )}`} </b>
                    </h4>
                  </Col>
                  <Col span={12} style={{ position: "relative" }}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                        <b> {this.state.baseData && this.state.baseData.Table6 && `${currencyFormat(this.state.baseData.Table6[0].Amount )}`} </b>
                    </h4>
                  </Col>
                </Row>
                <Row style={{ marginBottom: "24px" }}>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Land Side</p>
                  </Col>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Air Side</p>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={6} {...topColProps}>
          <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}> <b>AVERAGE SALES PER CUSTOMER</b> </Col>
                  <Col span={12} align="right"> <p>last month</p> </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "2px ",
                }}
              />
                <div>
                <Row>
                  <Col span={12}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                        <b> {this.state.baseData && this.state.baseData.Table9 && `${currencyFormat2(this.state.baseData.Table9[0].MNTuser )}`} </b>
                    </h4>
                  </Col>
                  <Col span={12} style={{ position: "relative" }}>
                    <h4 align="left" style={{ fontSize: "10pt", marginBottom: "0px " }} >
                    <b> {this.state.baseData && this.state.baseData.Table8 && `${currencyFormat2(this.state.baseData.Table8[0].USDuser )}`} </b>
                    </h4>
                  </Col>
                </Row>
                <Row style={{ marginBottom: "17px" }}>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Land Side</p>
                  </Col>
                  <Col span={12}>
                      <p align="left" style={{ marginBottom: "0px" }}>Air Side</p>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default HRContent1;
