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
      <div className="card-header">
        <Row gutter={[24, 20]} style={{ marginBottom: "10px" }}>
          <Col span={6} {...topColProps}>
            <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}>
                    {" "}
                    <p>Total Employees</p>
                  </Col>
                  <Col span={12}>
                    {" "}
                    <h4
                      align="right"
                      style={{ fontSize: "14pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table &&
                          this.state.baseData.Table[0].b}
                      </b>
                    </h4>
                  </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "4px ",
                }}
              />
              <div style={{ position: "relative" }}>
                <Row>
                  <h4
                    align="right"
                    style={{ fontSize: "11pt", marginBottom: "0px " }}
                  >
                    <b>
                      {this.state.baseData &&
                        this.state.baseData.Table &&
                        this.state.baseData.Table[0].a}
                    </b>
                  </h4>
                </Row>
              </div>
              <div
                style={{ position: "absolute", bottom: "10px", right: "24px" }}
              >
                <p align="right" style={{ marginBottom: "0px" }}>
                  Our Staff
                </p>
              </div>
            </Card>
          </Col>
          <Col span={6} {...topColProps}>
            <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <Row>
                  <Col span={12}>
                    {" "}
                    <p>Total Clients</p>
                  </Col>
                  <Col span={12}>
                    {" "}
                    <h4
                      align="right"
                      style={{ fontSize: "14pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table &&
                          this.state.baseData.Table[0].j}
                      </b>
                    </h4>
                  </Col>
                </Row>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "4px ",
                }}
              />
              <div>
                <Row>
                  <Col span={12}>
                    <h4
                      align="right"
                      style={{
                        fontSize: "11pt",
                        marginBottom: "0px",
                      }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table &&
                          this.state.baseData.Table[0].d}
                      </b>
                    </h4>
                  </Col>
                  <Col span={12}>
                    <h4
                      align="right"
                      style={{ fontSize: "11pt", marginBottom: "0px" }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table &&
                          this.state.baseData.Table[0].c}
                      </b>
                    </h4>
                  </Col>
                </Row>
                <Row
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                  }}
                >
                  <Col span={12}>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        right: "24px",
                      }}
                    >
                      <p align="right" style={{ marginBottom: "0px" }}>
                        Mongolian Employees
                      </p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        right: "45px",
                      }}
                    >
                      <p align="right" style={{ marginBottom: "0px" }}>
                        Foreign Employees
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={6} {...topColProps}>
            <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <p>New Employees</p>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "4px ",
                }}
              />
              <div>
                <Row>
                  <Col span={12}>
                    <h4
                      align="left"
                      style={{ fontSize: "11pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table &&
                          this.state.baseData.Table[0].g}
                      </b>
                    </h4>
                  </Col>
                  <Col span={12} style={{ position: "relative" }}>
                    <h4
                      align="left"
                      style={{ fontSize: "11pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table &&
                          this.state.baseData.Table[0].h}
                      </b>
                    </h4>
                  </Col>
                </Row>
                <Row
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                  }}
                >
                  <Col span={12}>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        left: "0px",
                      }}
                    >
                      <p align="left" style={{ marginBottom: "0px" }}>
                        This month
                      </p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        left: "-24px",
                      }}
                    >
                      <p align="left" style={{ marginBottom: "0px" }}>
                        Previous month
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={6} {...topColProps}>
            <Card className="card-padding" style={{ borderRadius: "8px" }}>
              <div>
                <p>Resigned Employees</p>
              </div>
              <p
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  marginBottom: "4px ",
                }}
              />
              <div>
                <Row>
                  <Col span={12} type="flex">
                    <div>
                      <h4
                        align="left"
                        style={{ fontSize: "11pt", marginBottom: "0px " }}
                      >
                        <b>
                          {this.state.baseData &&
                            this.state.baseData.Table &&
                            this.state.baseData.Table[0].e}
                        </b>
                      </h4>
                    </div>
                  </Col>
                  <Col span={12}>
                    <h4
                      align="left"
                      style={{ fontSize: "11pt", marginBottom: "0px " }}
                    >
                      <b>
                        {this.state.baseData &&
                          this.state.baseData.Table &&
                          this.state.baseData.Table[0].f}
                      </b>
                    </h4>
                  </Col>
                </Row>
                <Row
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                  }}
                >
                  <Col span={12}>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        left: "0px",
                      }}
                    >
                      <p style={{ marginBottom: "0px" }}>This month</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        left: "-24px",
                      }}
                    >
                      <p style={{ marginBottom: "0px" }}>Previous month</p>
                    </div>
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
