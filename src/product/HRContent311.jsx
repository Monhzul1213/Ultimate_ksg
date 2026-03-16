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


const { TabPane } = Tabs;


const colors = getTheme().colors10;
// 数据源
const data = [
	{
		month: "Jan",
		city: "Tokyo",
		temperature: 7
	},
	{
		month: "Jan",
		city: "London",
		temperature: 3.9
	},
	{
		month: "Feb",
		city: "Tokyo",
		temperature: 6.9
	},
	{
		month: "Feb",
		city: "London",
		temperature: 4.2
	},
	{
		month: "Mar",
		city: "Tokyo",
		temperature: 9.5
	},
	{
		month: "Mar",
		city: "London",
		temperature: 5.7
	},
	{
		month: "Apr",
		city: "Tokyo",
		temperature: 14.5
	},
	{
		month: "Apr",
		city: "London",
		temperature: 8.5
	},
	{
		month: "May",
		city: "Tokyo",
		temperature: 18.4
	},
	{
		month: "May",
		city: "London",
		temperature: 11.9
	},
	{
		month: "Jun",
		city: "Tokyo",
		temperature: 21.5
	},
	{
		month: "Jun",
		city: "London",
		temperature: 15.2
	},
	{
		month: "Jul",
		city: "Tokyo",
		temperature: 25.2
	},
	{
		month: "Jul",
		city: "London",
		temperature: 17
	},
	{
		month: "Aug",
		city: "Tokyo",
		temperature: 26.5
	},
	{
		month: "Aug",
		city: "London",
		temperature: 16.6
	},
	{
		month: "Sep",
		city: "Tokyo",
		temperature: 23.3
	},
	{
		month: "Sep",
		city: "London",
		temperature: 14.2
	},
	{
		month: "Oct",
		city: "Tokyo",
		temperature: 18.3
	},
	{
		month: "Oct",
		city: "London",
		temperature: 10.3
	},
	{
		month: "Nov",
		city: "Tokyo",
		temperature: 13.9
	},
	{
		month: "Nov",
		city: "London",
		temperature: 6.6
	},
	{
		month: "Dec",
		city: "Tokyo",
		temperature: 9.6
	},
	{
		month: "Dec",
		city: "London",
		temperature: 4.8
	}
];

const scale = {
	month: {
		alias: '月份'
	},
	avgRainfall: {
		alias: '月均降雨量'
	}
}

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
	  baseData: undefined,
      LoggedSysuser,
    };
  }
  
  cols = { month: { range: [0, 1]}}

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({  QueryID: "CO_017", ModuleID: "IN" }),
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
                <p align="LEFT"><b>TOP BUSINESS CATEGORY</b></p>
                <Chart height={400} data={this.state.baseData && this.state.baseData.Table2} scale={this.cols} autoFit onAxisLabelClick={console.log}>
				            <Legend itemName={{ style: (item) => { return { fill: item.name == 'Tokyo' ? colors[0] : colors[1] }}}}/>
				            <Axis name="SalesDate" />
				            <Axis name="TotalAmount" label={{ formatter: val => `${val}₮` }} />
				            <Geom type="point" position="SalesDate*TotalAmount" size={4} shape={"circle"} color={"Descr"} style={{ stroke: "#fff", lineWidth: 1 }} />
				            <Geom type="line" position="SalesDate*TotalAmount" size={2} color={"Descr"} shape={"smooth"} />
			          </Chart>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
                <p align="LEFT"><b>TOP BUSINESS TYPE</b></p>
				<Chart height={400} data={this.state.baseData && this.state.baseData.Table3} scale={this.cols} autoFit onAxisLabelClick={console.log}>
				            <Legend itemName={{ style: (item) => { return { fill: item.name == 'Tokyo' ? colors[0] : colors[1] }}}}/>
				            <Axis name="SalesDate" />
				            <Axis name="TotalAmount" label={{ formatter: val => `${val}₮` }} />
				           <Geom type="point" position="SalesDate*TotalAmount" size={4} shape={"circle"} color={"Descr"} style={{ stroke: "#fff", lineWidth: 1 }} />
				            <Geom type="line" position="SalesDate*TotalAmount" size={2} color={"Descr"} shape={"smooth"} />
			          </Chart>
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 20]} style={{ marginBottom: "10px" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card style={{ borderRadius: "8px" }}>
                <p align="LEFT"> <b>BRANCH</b></p>
                    <Chart height={400} data={data} scale={cols1} autoFit onIntervalClick={e => { const states = e.target.cfg.element.getStates(); }} onGetG2Instance={(c)=>{ console.log(c.getXY(data[0]))}}>
			              <Coordinate type="theta" radius={0.75} />
			              <Tooltip showTitle={false} />
			              <Axis visible={false} />
			              <Interval position="temperature" adjust="stack" color="city" style={{ lineWidth: 1, stroke: '#fff', }}
				                      label={['count', { layout: { type: 'limit-in-plot', cfg: { action: 'ellipsis' } }, content: (data) => { return `${data.city}: ${data.temperature * 100}%`;},}]}
				                      state={{ selected: { style: (t) => { const res = getTheme().geometries.interval.rect.selected.style(t); return { ...res, fill: 'red' }}}}}/>
			              <Interaction type='element-single-selected' />
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
