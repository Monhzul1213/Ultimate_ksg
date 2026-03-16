import React, { Component } from "react";
import Axios from "axios";
import {
  ChartCard,
  Field,
  MiniArea,
  MiniBar,
  MiniProgress,
  yuan
} from "ant-design-pro/lib/Charts";
import Trend from "ant-design-pro/lib/Trend";
import NumberInfo from "ant-design-pro/lib/NumberInfo";
import { Row, Col, Icon, Tooltip } from "antd";
import numeral from "numeral";
import moment from "moment";
import "antd/dist/antd.css";
import "./Content1.css";

const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 30; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      "YYYY-MM-DD"
    ),
    y: Math.floor(Math.random() * 100) + 10
  });
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6
};

class Content1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      ReceiptInfo: ""
    };
  }

  componentDidMount() {
    Axios.get(
      "http://192.168.1.37:3030/get_inPICount.asmx/getDashboard?pName=Admin&pVendID=500001&pBDate=2019.01.01&pEDate=2019.10.01"
    )
      .then(response => {
        this.setState({
          posts: response.data.table1,
          ReceiptInfo:
            response.data.table1[0].ReceiptActualQty +
            "/" +
            response.data.table1[0].ReceiptProjectQty
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { props, posts } = this.state;
    return (
      <div className="Content1Container">
        <Row gutter={24}>
          <Col span={4} {...topColResponsiveProps}>
            <ChartCard
              title="Үлдэгдэл ачаа:"
              total={numeral(
                posts[0] && posts[0].EndBalanceQty ? posts[0].EndBalanceQty : 0
              ).format("0,0")}
              contentHeight={46}
              action={
                <Tooltip title="Үлдэгдэл ачаа">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              footer={
                <Field
                  label="Нийт ачаа:"
                  value={numeral(
                    posts[0] && posts[0].TotalQty ? posts[0].TotalQty : 0
                  ).format("0,0")}
                />
              }
            >
              <MiniArea line height={46} data={visitData} />
            </ChartCard>
          </Col>
          <Col span={4} {...topColResponsiveProps}>
            <ChartCard
              title="Хадгалуулсан төлбөр:"
              action={
                <Tooltip title="Хадгалуулсан төлбөр">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(
                posts[0] && posts[0].TotalPaymentAmt
                  ? posts[0].TotalPaymentAmt
                  : 0
              ).format("0,0")}
              footer={
                <Field
                  label="Нийт хоног:"
                  value={numeral(
                    posts[0] && posts[0].TotalSavedDays
                      ? posts[0].TotalSavedDays
                      : 0
                  ).format("0,0")}
                />
              }
              contentHeight={46}
            >
              <MiniBar height={46} data={visitData} />
            </ChartCard>
          </Col>
          <Col span={6} {...topColResponsiveProps}>
            <ChartCard
              title="Энэ сарын төлcөн:"
              action={
                <Tooltip title="Энэ сарын төлсөн">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(
                posts[0] && posts[0].MonthPaymentAmt
                  ? posts[0].MonthPaymentAmt
                  : 0
              ).format("0,0")}
              footer={
                <div>
                  <Field
                    label="Дансны үлдэгдэл:"
                    value={numeral(
                      posts[0] && posts[0].MonthSavedDays
                        ? posts[0].MonthSavedDays
                        : 0
                    ).format("0,0")}
                  />
                </div>
              }
              contentHeight={46}
            >
              <MiniProgress percent={78} strokeWidth={8} target={80} />
            </ChartCard>
          </Col>
          <Col span={4} {...topColResponsiveProps}>
            <ChartCard
              title="Ачаа буултын гүйцэтгэл:"
              action={
                <Tooltip title="Ачаа буултын гүйцэтгэл">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={this.state.ReceiptInfo}
              footer={
                <div>
                  <span>
                    Гүйцэтгэл:
                    <Trend style={{ marginLeft: 8, color: "rgba(0,0,0,.85)" }}>
                      70%
                    </Trend>
                  </span>
                </div>
              }
              contentHeight={46}
            >
              <MiniBar height={46} data={visitData} />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Content1;
