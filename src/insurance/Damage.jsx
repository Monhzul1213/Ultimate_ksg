import React, { Component } from "react";
import { Form, Tabs, Table, Input, Select } from "antd";
import "./Quits.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
const dateFormat = "YYYY.MM.DD";
const { TabPane } = Tabs;
const { Option } = Select;
class AFrom extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      loading: true,
      LoggedSysuser,
      cookieUser,
      today,
    };
  }

  componentDidMount() {}

  render() {
    const { propData } = this.props;
    const columns = [
      {
        title: "Овог",
        dataIndex: "empCode",
        key: "1",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Нэр",
        dataIndex: "empName",
        key: "2",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select style={{ width: "100%" }} placeholder="Нэр">
                <Option EmpCode>EmpName</Option>
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: "Регисрийн дугаар",
        dataIndex: "empCode",
        key: "3",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Иргэний харъяалал",
        dataIndex: "empCode",
        key: "4",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хаяг",
        dataIndex: "empCode",
        key: "5",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Утасны дугаар",
        dataIndex: "empCode",
        key: "6",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хөрөнгө өмчлөгч",
        dataIndex: "empCode",
        key: "7",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Үйлдвэр",
        dataIndex: "empCode",
        key: "8",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Марк, Засвар",
        dataIndex: "empCode",
        key: "9",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Улсын бүртгэл дугаар",
        dataIndex: "empCode",
        key: "10",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Арал, Сериал дугаар",
        dataIndex: "empCode",
        key: "11",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Эвдрэл гэмтэл",
        dataIndex: "empCode",
        key: "12",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хохирол үнэлэгч",
        dataIndex: "empCode",
        key: "13",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хохирлын дүн",
        dataIndex: "empCode",
        key: "14",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
    ];
    const column1 = [
      {
        title: "Овог",
        dataIndex: "empCode",
        key: "1",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Нэр",
        dataIndex: "empName",
        key: "2",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select style={{ width: "100%" }} placeholder="Нэр">
                <Option EmpCode>EmpName</Option>
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: "Регисрийн дугаар",
        dataIndex: "empCode",
        key: "3",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Иргэний харъяалал",
        dataIndex: "empCode",
        key: "4",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хаяг",
        dataIndex: "empCode",
        key: "5",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Утасны дугаар",
        dataIndex: "empCode",
        key: "6",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хөдөлмөрийн чадвар түр алдсан хувь",
        dataIndex: "empCode",
        key: "7",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хөдөлмөрийн чадвар түр алдсан хоног",
        dataIndex: "empCode",
        key: "8",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Онош/Монгол/",
        dataIndex: "empCode",
        key: "9",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Оношийн шифр",
        dataIndex: "empCode",
        key: "10",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Шалтгаан",
        dataIndex: "empCode",
        key: "11",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хохирол үнэлэгч",
        dataIndex: "empCode",
        key: "12",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хохирлын дүн",
        dataIndex: "empCode",
        key: "13",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
    ];
    const column2 = [
      {
        title: "Овог",
        dataIndex: "empCode",
        key: "1",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Нэр",
        dataIndex: "empName",
        key: "2",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select style={{ width: "100%" }} placeholder="Нэр">
                <Option EmpCode>EmpName</Option>
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: "Регисрийн дугаар",
        dataIndex: "empCode",
        key: "3",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Иргэний харъяалал",
        dataIndex: "empCode",
        key: "4",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хаяг",
        dataIndex: "empCode",
        key: "5",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Утасны дугаар",
        dataIndex: "empCode",
        key: "6",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Шалтгаан",
        dataIndex: "empCode",
        key: "7",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хохирол үнэлэгч",
        dataIndex: "empCode",
        key: "8",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
      {
        title: "Хохирлын дүн",
        dataIndex: "empCode",
        key: "9",
        render: (text, record) => {
          if (record.editable) {
            return <Input value={text} />;
          }
          return text;
        },
      },
    ];
    return (
      <div style={{ margin: "15px" }}>
        <Tabs defaultActiveKey="1" tabPosition="left">
          <TabPane tab="Эд хөрөнгө" key="1">
            <Table
              columns={columns}
              pagination={false}
              style={{ padding: "10px" }}
            />
          </TabPane>
          <TabPane tab="Хөдөлмөрийн чадвар алдалт" key="2">
            <Table
              columns={column1}
              pagination={false}
              style={{ padding: "10px" }}
            />
          </TabPane>
          <TabPane tab="Амь нас" key="3">
            <Table
              columns={column2}
              pagination={false}
              style={{ padding: "10px" }}
            />
          </TabPane>
          <TabPane tab="Эрүүл мэнд" key="4">
            Content of tab 4
          </TabPane>
          <TabPane tab="Мөнгө хөрөнгө" key="5">
            Content of tab 5
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(AFrom);

export default class Damage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container">
        <WrappedContractForm />
      </div>
    );
  }
}
