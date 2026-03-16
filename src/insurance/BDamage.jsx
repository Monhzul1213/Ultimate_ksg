import React, { Component } from "react";
import { Form, Tabs, Table, Input, Select } from "antd";
import "./Quits.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import BTable1 from "./BTable1";
import BTable2 from "./BTable2";
import BTable3 from "./BTable3";
import BTable4 from "./BTable4";
import BTable5 from "./BTable5";
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
      tableData: []
    };
  }
  componentDidMount() {}

   setTableData = (objName, tableData) => {
    this.setState((state) => {
      const { bufferData } = state;
      bufferData[objName] = tableData;
      return {
        bufferData,
      };
    });
  };

  render() {
    const { propData1 } = this.props;
    return (
      <div style={{ margin: "15px" }}>
         <Tabs defaultActiveKey="1" tabPosition="left">
                    <TabPane tab="Эд хөрөнгө" key="1">
            <BTable1
              tableData={propData1 && propData1.Table7}
              setTableData={this.setTableData}/>
                    </TabPane>
                    <TabPane tab="Хөдөлмөрийн чадвар алдалт" key="2">
            <BTable2
            tableData={propData1 && propData1.Table8}
              setTableData={this.setTableData}/>
                    </TabPane>
                    <TabPane tab="Амь нас" key="3">
            <BTable3
            tableData={propData1 && propData1.Table9}
              setTableData={this.setTableData}/>
                    </TabPane>
          <TabPane tab="Эрүүл мэнд" key="4">
            <BTable4
              tableData={propData1 && propData1.Table10}
              setTableData={this.setTableData}/>
                    </TabPane>
                    <TabPane tab="Мөнгө хөрөнгө" key="5">
            <BTable5
              tableData={propData1 && propData1.Table11}
              setTableData={this.setTableData}/>
                    </TabPane>
                  </Tabs>
      </div>
    );
  }
}

const EditableFormTable = Form.create()(AFrom);
export default EditableFormTable;