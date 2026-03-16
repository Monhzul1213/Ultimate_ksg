import React, { Component } from "react";
import { Layout, Row, Col, Card } from "antd";
import { Table, Tabs, Pagination } from "antd";
import Axios from "axios";
import { Pie, yuan } from "ant-design-pro/lib/Charts";

import "antd/dist/antd.css";
import DataSet from "@antv/data-set";
import "./Content3.css";

const { Content } = Layout;
const { TabPane } = Tabs;
function callback(key) {
}

const columns = [
  {
    title: "Огноо",
    dataIndex: "TxnDate",
    key: "TxnDate"
  },
  {
    title: "Мэдүүлгийн дугаар",
    dataIndex: "PReturnNo",
    key: "PReturnNo"
  },
  {
    title: "Нэр төрлийн тоо",
    dataIndex: "Нэртөрлийнтоо",
    key: "1"
  },
  {
    title: "Нийт тоо ширхэг",
    dataIndex: "TotalUnitQty",
    key: "TotalUnitQty"
  },
  {
    title: "Нийт төлбөр",
    dataIndex: "TotalUnitCost",
    key: "TotalUnitCost"
  }
];

class Content3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      sept: []
    };
  }

  componentDidMount() {
    Axios.get(
      "http://192.168.1.37:3030/get_inPICount.asmx/getDashboard?pName=Admin&pVendID=500001&pBDate=2019.01.01&pEDate=2019.10.01"
    ).then(response => {
      const array = [];
      response.data.table4.forEach(element => {
        array.push({
          x: element.DaysCount + " хоног",
          y: element.SharePercent
        });
      });
      this.setState({
        posts: response.data.table3,
        sept: array
      });
    });
  }

  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  render() {
    const { posts } = this.state;
    const { sept } = this.state;
    const dataTable = posts;
    const salesPieData = sept;

    return (
      <Content className="Content3Container">
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Card title="Сүүлд гарсан ачаанууд" bordered={false} height={298}>

            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Card title="Ачаа гаралт (хадгалсан хоногоор)" bordered={false}>

            </Card>
          </Col>
        </Row>
      </Content>
    );
  }
}
export default Content3;
