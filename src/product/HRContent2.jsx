import React, { Component } from "react";
import { Row, Col, Card, Spin, Tabs } from "antd";
import {
  Chart,
  Axis,
  Tooltip,
  Geom,
  Legend,
  notification,
  Label,
  getTheme,
  Interval,
  Interaction,
  Coordinate
} from "bizcharts";
import DataSet from "@antv/data-set";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import HRContent21 from "./HRContent21";


const { TabPane } = Tabs;


const colors = getTheme().colors10;

const cols1 = {
  percent: {
    formatter: val => {
      val = val * 100 + '%';
      return val;
    },
  },
};


class HRContent2 extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      LoggedSysuser,
	  baseData: undefined
    };
  }
  
  cols = { month: { range: [0, 1]}}

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "CO_020", ModuleID: "IN" }),
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
        <Tabs>
            <TabPane tab="AIR SIDE" key="1">
            <Row gutter={[24, 20]} style={{ marginBottom: "10px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
                <p align="LEFT"><b>SALES INCREASE/ DECREASE</b></p>
                <Chart height={400} data={this.state.baseData && this.state.baseData.Table3} scale={this.cols} autoFit onAxisLabelClick={console.log}>
				            <Legend itemName={{ style: (item) => { return { fill: item.name == 'Tokyo' ? colors[0] : colors[1] }}}}/>
				            <Axis name="SalesDate" />
				            <Axis name="Amount" label={{ formatter: val => `${val}$` }} />
				            <Geom type="point" position="SalesDate*Amount" size={4} shape={"circle"} color={"CurrencyID"} style={{ stroke: "#fff", lineWidth: 1 }} />
				            <Geom type="line" position="SalesDate*Amount" size={2} color={"CurrencyID"} shape={"smooth"} />
			          </Chart>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
                <p align="LEFT"><b>AVERAGE SALES PER CUSTOMER</b></p>
				        <Chart height={400} data={this.state.baseData && this.state.baseData.Table1} scale={this.cols} autoFit onAxisLabelClick={console.log}>
				            <Legend itemName={{ style: (item) => { return { fill: item.name == 'Tokyo' ? colors[0] : colors[1] }}}}/>
				            <Axis name="SalesDate" />
				            <Axis name="UserUSD" label={{ formatter: val => `${val}` }} />
				            <Geom type="point" position="SalesDate*UserUSD" size={4} shape={"circle"} color={"CurrencyID"} style={{ stroke: "#fff", lineWidth: 1 }} />
				            <Geom type="line" position="SalesDate*UserUSD" size={2} color={"CurrencyID"} shape={"smooth"} />
			          </Chart>
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 20]} style={{ marginBottom: "10px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
                <p align="LEFT"> <b>BRANCH</b></p>
                <Chart height={400} padding="auto" data={this.state.baseData && this.state.baseData.Table} autoFit filter={[ ['TotalAmount', val => val != null]]}>
			              <Interval adjust={[ { type: 'dodge', marginRatio: 0,},]} color="Name" position="SalesDate*TotalAmount" />
			              <Tooltip shared />
			              <Interaction type="active-region" />
		             </Chart>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
				<Row>
                  <Col span={12}> <b>TOTAL AMOUNT</b> </Col>
                  <Col span={12} align="right"> <p>last month</p> </Col>
                </Row>
                <Chart height={400} data={this.state.baseData && this.state.baseData.Table2} scale={cols1} autoFit onIntervalClick={e => { const states = e.target.cfg.element.getStates(); }} onGetG2Instance={(c)=>{ console.log(c.getXY(this.state.baseData && this.state.baseData.Table2[0]))}}>
			              <Coordinate type="theta" radius={0.75} />
			              <Tooltip showTitle={false} />
			              <Axis visible={false} />
			              <Interval position="Amount" adjust="stack" color="CurrencyID" style={{ lineWidth: 1, stroke: '#fff', }} label={['count', {layout: { type: 'limit-in-plot', 
						            cfg: { action: 'ellipsis' } },content: (data) => {return `${data.CurrencyID}: ${data.Amount * 100}%`;},}]}
				                    state={{ selected: { style: (t) => { const res = getTheme().geometries.interval.rect.selected.style(t); return { ...res, fill: 'red' }}}}} />
			              <Interaction type='element-single-selected' />
		            </Chart>
              </Card>
            </Col>
          </Row>
              </TabPane>
              <TabPane tab="LAND SIDE" key="2">
                <HRContent21 />
              </TabPane>
        </Tabs>
        </Spin>
      </div>
    );
  }
}
export default HRContent2;
