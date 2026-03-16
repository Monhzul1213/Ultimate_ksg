import React, { Component } from "react";
import Axios from "axios";
import { Layout, Row, Col, Button } from "antd";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import "antd/dist/antd.css";

import { Tabs } from "antd";
import { DatePicker } from "antd";
import { List } from "antd";
import "./Content2.css";

const { Content } = Layout;
const { TabPane } = Tabs;
function lback(key) {}

const { RangePicker } = DatePicker;

function onChange(date, dateString) {}

const dataList = [
  "Вагон: 15",
  "Чингэлэг (20ft): 20",
  "Чингэлэг (40ft): 11",
  "Тир: 3",
];

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 8,
};

class Content2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    Axios.get(
      "http://192.168.1.37:3030/get_inPICount.asmx/getDashboard?pName=Admin&pVendID=500001&pBDate=2019.01.01&pEDate=2019.10.01"
    )
      .then((response) => {
        this.setState({
          posts: response.data.table2,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  operations = (
    <div>
      <Button type="link">Сар</Button>
      <Button type="link">7 хоног</Button>
      <Button type="link">Өдөр</Button>
      <RangePicker onChange={onChange} />
    </div>
  );

  render() {
    const { posts } = this.state;
    const dataChart = posts;
    const cols = {
      буусан: {
        tickInterval: 500,
      },
    };
    const tst = [];
    dataChart.forEach((data) => {
      tst.push({
        Months: data.Months,
        Бараа: data.ReceiptQty,
      });
    });

    const mate = [];
    dataChart.forEach((data) => {
      mate.push({
        Months: data.Months,
        Бараа: data.IssueQty,
      });
    });

    return (
      <Content className="Content2Container" {...topColResponsiveProps}>
        <div style={{ padding: 30, background: "#fff", minHeight: 380 }}>
          <Tabs tabBarExtraContent={this.operations} defaultActiveKey="1">
            <TabPane tab="Буусан" key="1">
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={16}>
                  <h3>Буусан бараа бүртгэл</h3>
                  <Chart height={300} data={tst} scale={cols} forceFit>
                    <Axis name="Months" />
                    <Axis name="Орлогын тоо" />
                    <Tooltip
                      crosshairs={{
                        type: "x",
                      }}
                    />
                    <Geom type="interval" position="Months*Бараа" />
                  </Chart>
                </Col>
                <Col span={6}>
                  <div style={{ margin: "0 50px" }}>
                    <h4 style={{}}>
                      Нийт буусан <br /> /Тээврийн төрлөөр/
                    </h4>
                    <List
                      size="small"
                      dataSource={dataList}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Гарсан" key="2">
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={16}>
                  <h3>Гарсан бараа бүртгэл</h3>
                  <Chart height={300} data={mate} scale={cols} forceFit>
                    <Axis name="Months" />
                    <Axis name="Зарлагын тоо" />
                    <Tooltip
                      crosshairs={{
                        type: "x",
                      }}
                    />
                    <Geom type="interval" position="Months*Бараа" />
                  </Chart>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </Content>
    );
  }
}
export default Content2;
