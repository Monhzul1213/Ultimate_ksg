import React, { Component } from "react";
import { Row, Col, Card, Spin, Tabs } from "antd";
import {
  Chart,
  Axis,
  Tooltip,
  Geom,
  Legend,
  notification,
  getTheme,
  Interval,
  Interaction
} from "bizcharts";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";

const colors = getTheme().colors10;


class HRContent2 extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
	  baseData: undefined,
      LoggedSysuser,
    };
  }

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "CO_019", ModuleID: "IN" }),
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
          baseData: res.data.retData,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading} style={{ height: "100%" }}>
            <Row gutter={[24, 20]} style={{ marginBottom: "10px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
                <p align="LEFT"><b>SALES INCREASE/ DECREASE</b></p>
					      <Chart height={400} data={this.state.baseData && this.state.baseData.Table2} autoFit onAxisLabelClick={console.log}>
				            <Legend itemName={{ style: (item) => { return { fill: item.name == 'Tokyo' ? colors[0] : colors[1] }}}}/>
				            <Axis name="TxnDate" />
				            <Axis name="paidAmt" label={{ formatter: val => `${val}₮` }} />
				            <Geom type="point" position="TxnDate*paidAmt" size={4} shape={"circle"} style={{ stroke: "#fff", lineWidth: 1 }} />
				            <Geom type="line" position="TxnDate*paidAmt" size={2} shape={"smooth"} />
			          </Chart>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
                <p align="LEFT"><b>TOTAL CUSTOMER</b></p>
                    <Chart height={400} padding="auto" data={this.state.baseData && this.state.baseData.Table3} autoFit filter={[ ['UserCount', val => val != null]]}>
			              <Interval adjust={[ { type: 'dodge', marginRatio: 0,},]} position="TxnDate*UserCount" />
			              <Tooltip shared />
			              <Interaction type="active-region" />
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
