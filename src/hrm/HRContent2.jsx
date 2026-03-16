import React, { Component } from "react";
import { Row, Col, Card, Spin } from "antd";
import {
  Chart,
  Axis,
  Tooltip,
  Geom,
  Legend,
  notification,
  Label,
} from "bizcharts";
import DataSet from "@antv/data-set";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";

const legendItems = [
  { value: "Invoice", fill: "#18a6e4", radius: 5 },
  { value: "Cost of Sales", fill: "#00358d", radius: 5 },
];
const legendItems1 = [
  { value: "Income", fill: "#1aff66", radius: 5 },
  { value: "Salary", fill: "#004d1a", radius: 5 },
];

class HRContent2 extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: [],
      baseData1: [],
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

        this.setState({
          baseData: res.data.retData.Table2,
          baseData1: res.data.retData.Table3,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  render() {
    const { baseData, baseData1 } = this.state;
    const dataChart = baseData;
    const dataChart1 = baseData1;
    const cols = {
      col: {
        tickInterval: 100,
      },
    };
    const tst = [];
    dataChart.forEach((data) => {
      tst.push({
        TxnDate: data.TxnDate,
        Invoice: data.Invoice,
        Cost: data.Cost,
      });
    });
    const mate = [];
    dataChart1.forEach((data) => {
      mate.push({
        TxnDate: data.TxnDate,
        Salary: data.Salary,
        Income: data.Income,
      });
    });

    const ds = new DataSet();
    const dv = ds.createView().source(dataChart);
    const dv1 = ds.createView().source(dataChart1);

    dv.transform({
      type: "fold",
      fields: ["Invoice", "Cost"],
      key: "xx",
      value: "yy",
    });
    dv1.transform({
      type: "fold",
      fields: ["Income", "Salary"],
      key: "xx",
      value: "yy",
    });

    return (
      <div>
        <Spin spinning={this.state.loading} style={{ height: "100%" }}>
          <Row gutter={[24, 20]} style={{ marginBottom: "10px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
           <Card style={{ borderRadius: "8px" }}>
                <p align="center">
                  <b>Outsourcing Overview</b>
                </p>
                <Chart
                  height={400}
                  width={700}
                  forceFit
                  data={dv}
                  padding="auto"
                  scale={{
                    yy: {
                      min: 0,
                      formatter: (val) => {
                        return (
                          (val / 1000000)
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "M"
                        );
                      },
                    },
                  }}
                >
                  <Legend custom={true} position="top" items={legendItems} />
                  <Axis name="TxnDate" />
                  <Axis name="xx" />
                  <Axis name="yy" />

                  <Tooltip />
                  <Geom
                    type="interval"
                    position="TxnDate*yy"
                    color={[
                      "xx",
                      (value) => {
                        if (value === "Invoice") {
                          return "#18a6e4";
                        }
                        if (value === "Cost") {
                          return "#00358d";
                        }
                      },
                    ]}
                    adjust={[
                      {
                        type: "dodge",
                        marginRatio: 1 / 32,
                      },
                    ]}
                  />
                </Chart>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                   <Card style={{ borderRadius: "8px" }}>
                <p align="center">
                  <b>Recruiting Overview</b>
                </p>
                <Chart
                  height={400}
                  width={700}
                  data={dv1}
                  scale={{
                    yy: {
                      min: 0,
                      formatter: (val) => {
                        return (
                          (val / 1000000)
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "M"
                        );
                      },
                    },
                  }}
                  forceFit
                  padding="auto"
                >
                  <Axis name="TxnDate" />
                  <Axis name="xx" />
                  <Axis name="yy" />
                  <Legend position="top" custom items={legendItems1} />
                  <Tooltip />
                  <Geom
                    type="interval"
                    position="TxnDate*yy"
                    color={[
                      "xx",
                      (value) => {
                        if (value === "Income") {
                          return "#1aff66";
                        }
                        if (value === "Salary") {
                          return "#004d1a";
                        }
                      },
                    ]}
                    adjust={[
                      {
                        type: "dodge",
                        marginRatio: 1 / 32,
                      },
                    ]}
                  />
                </Chart>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}
export default HRContent2;
