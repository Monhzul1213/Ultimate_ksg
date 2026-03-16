import React from "react";
import { Row, Col, Card, Progress, notification } from "antd";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import "./HRContent3.css";

const ColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 6,
};
function currencyFormat(num) {
   if(num === null) { return 0 }
  if (typeof num !== "number") { return num}
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "₮";
}
function currencyFormat1(num) {
  if(num === null) { return 0 }
  if (typeof num !== "number") { return num}
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "%";
}
function currencyFormat2(num) {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
class HRContent3 extends React.Component {
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
        json: JSON.stringify({ QueryID: "Web_EmpDtl" }),
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
      <div>
        <Card className="card-padd" style={{ borderRadius: "8px" }}>
          <Row gutter={[20, 20]}>
            <Col span={6} {...ColResponsiveProps}>
              <div className="info-left">
                <Row>
                  <Col span={12}>
                    <p style={{ marginBottom: "0px" }}>Earnings</p>
                  </Col>
                  <Col span={12}>
                    <p
                      align="right"
                      style={{ fontSize: "9pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] ? (
                          this.state.baseData.Table1[0].Ear > 0 ? (
                            <b style={{ color: "green" }}>
                              {currencyFormat1(
                                this.state.baseData.Table1[0].Ear
                              )}
                            </b>
                          ) : (
                            <b style={{ color: "red" }}>
                              {currencyFormat1(
                                this.state.baseData.Table1[0].Ear
                              )}
                            </b>
                          )
                        ) : null}
                      </b>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    {" "}
                    <h4
                      align="left"
                      style={{ fontSize: "11pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table1[0] &&
                          `${currencyFormat(
                            this.state.baseData.Table1[0].Earnings
                          )}`}
                      </b>
                    </h4>
                  </Col>
                </Row>
                <Row className="jh">
                  <Col span={19}>
                    <Progress
                      successPercent={
                        this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        currencyFormat2(100 + this.state.baseData.Table1[0].Ear)
                      }
                      size="small"
                      showInfo={false}
                    />
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "9pt" }}>
                      {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        currencyFormat1(
                          100 + this.state.baseData.Table1[0].Ear
                        )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <p
                    style={{
                      fontSize: "9pt",
                      fontFamily: "Arial",
                      marginBottom: "0px ",
                    }}
                  >
                    <b style={{ color: "black" }}>Previous month:</b>{" "}
                    {this.state.baseData &&
                      this.state.baseData.Table1 &&
                      this.state.baseData.Table1[0] &&
                      `${currencyFormat(
                        this.state.baseData.Table1[0].PEarnings
                      )}`}
                  </p>
                </Row>
              </div>
            </Col>
            <Col span={6} {...ColResponsiveProps}>
              <div className="info-left">
                <Row>
                  <Col span={12}>
                    <p style={{ marginBottom: "0px" }}>Expenses</p>
                  </Col>
                  <Col span={12}>
                    <p
                      align="right"
                      style={{ fontSize: "9pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] ? (
                          this.state.baseData.Table1[0].Exp > 0 ? (
                            <b style={{ color: "green" }}>
                              {currencyFormat1(
                                this.state.baseData.Table1[0].Exp
                              )}
                            </b>
                          ) : (
                            <b style={{ color: "red" }}>
                              {currencyFormat1(
                                this.state.baseData.Table1[0].Exp
                              )}
                            </b>
                          )
                        ) : null}
                      </b>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    {" "}
                    <h4
                      align="left"
                      style={{ fontSize: "11pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table1[0] &&
                          `${currencyFormat(
                            this.state.baseData.Table1[0].Expenses
                          )}`}
                      </b>
                    </h4>
                  </Col>
                </Row>
                <Row className="jh">
                  <Col span={19}>
                    <Progress
                      successPercent={
                        this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        currencyFormat2(100 + this.state.baseData.Table1[0].Exp)
                      }
                      size="small"
                      showInfo={false}
                    />
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "9pt" }}>
                      {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        currencyFormat1(
                          100 + this.state.baseData.Table1[0].Exp
                        )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <p
                    style={{
                      fontSize: "9pt",
                      fontFamily: "Arial",
                      marginBottom: "0px ",
                    }}
                  >
                    <b style={{ color: "black" }}>Previous month:</b>{" "}
                    {this.state.baseData &&
                      this.state.baseData.Table1 &&
                      this.state.baseData.Table1[0] &&
                      `${currencyFormat(
                        this.state.baseData.Table1[0].PExpenses
                      )}`}
                  </p>
                </Row>
              </div>
            </Col>
            <Col span={6} {...ColResponsiveProps}>
              <div className="info-left">
                <Row>
                  <Col span={12}>
                    <p style={{ marginBottom: "0px" }}>Profit</p>
                  </Col>
                  <Col span={12}>
                    <p
                      align="right"
                      style={{ fontSize: "9pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] ? (
                          ((this.state.baseData.Table1[0].Profit * 100) /
                            this.state.baseData.Table1[0].PProfit >
                          0
                            ? +100
                            : -100) > 0 ? (
                            <b style={{ color: "green" }}>
                              {currencyFormat1(
                                (this.state.baseData.Table1[0].Profit * 100) /
                                  this.state.baseData.Table1[0].PProfit >
                                  0
                                  ? (this.state.baseData.Table1[0].Profit *
                                      100) /
                                      this.state.baseData.Table1[0].PProfit +
                                      100
                                  : (this.state.baseData.Table1[0].Profit *
                                      100) /
                                      this.state.baseData.Table1[0].PProfit -
                                      100
                              )}
                            </b>
                          ) : (
                            <b style={{ color: "red" }}>
                              {currencyFormat1(
                                (this.state.baseData.Table1[0].Profit * 100) /
                                  this.state.baseData.Table1[0].PProfit >
                                  0
                                  ? (this.state.baseData.Table1[0].Profit *
                                      100) /
                                      this.state.baseData.Table1[0].PProfit +
                                      100
                                  : (this.state.baseData.Table1[0].Profit *
                                      100) /
                                      this.state.baseData.Table1[0].PProfit -
                                      100
                              )}
                            </b>
                          )
                        ) : null}
                      </b>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    {" "}
                    <h4
                      align="left"
                      style={{ fontSize: "11pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table1[0] &&
                          `${currencyFormat(
                            this.state.baseData.Table1[0].Profit
                          )}`}
                      </b>
                    </h4>
                  </Col>
                </Row>
                <Row className="jh">
                  <Col span={19}>
                    <Progress
                      successPercent={
                        this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        currencyFormat2(
                          100 +
                            (this.state.baseData.Table1[0].Profit * 100) /
                              this.state.baseData.Table1[0].PProfit -
                            100
                        )
                      }
                      size="small"
                      showInfo={false}
                    />
                  </Col>
                  <Col style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "9pt" }}>
                      {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        currencyFormat1(
                          100 +
                            (this.state.baseData.Table1[0].Profit * 100) /
                              this.state.baseData.Table1[0].PProfit -
                            100
                        )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <p
                    style={{
                      fontSize: "9pt",
                      fontFamily: "Arial",
                      marginBottom: "0px ",
                    }}
                  >
                    <b style={{ color: "black" }}>Previous month:</b>{" "}
                    {this.state.baseData &&
                      this.state.baseData.Table1 &&
                      this.state.baseData.Table1[0] &&
                      `${currencyFormat(
                        this.state.baseData.Table1[0].PProfit
                      )}`}
                  </p>
                </Row>
              </div>
            </Col>
            <Col span={6} {...ColResponsiveProps}>
              <div>
                <p>Cash Balance</p>
                <Row>
                  <p
                    style={{
                      fontSize: "10pt",
                      fontFamily: "Arial",
                      marginBottom: "0px ",
                    }}
                  >
                    In Cash{" "}
                    <b style={{ color: "black", marginLeft: "30px" }}>
                      {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        `${currencyFormat(this.state.baseData.Table1[0].Cash)}`}
                    </b>
                  </p>
                  <p
                    style={{
                      fontSize: "10pt",
                      fontFamily: "Arial",
                      marginBottom: "0px ",
                    }}
                  >
                    In Bank{" "}
                    <b style={{ color: "black", marginLeft: "30px" }}>
                      {this.state.baseData &&
                        this.state.baseData.Table1 &&
                        this.state.baseData.Table1[0] &&
                        `${currencyFormat(this.state.baseData.Table1[0].Bank)}`}
                    </b>
                  </p>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default HRContent3;
