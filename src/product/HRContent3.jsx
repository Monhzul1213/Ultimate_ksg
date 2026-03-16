import React from "react";
import { Tabs } from "antd";
import "./HRContent3.css";
import HRContent31 from "./HRContent31";
import HRContent32 from "./HRContent32";
import HRContent33 from "./HRContent33";

const { TabPane } = Tabs;


class HRContent3 extends React.Component {
  render() {
    return (
      <div>
            <Tabs>
              <TabPane tab="RENT" key="1">
              <HRContent31 />
              </TabPane>
              <TabPane tab="LOUNGE" key="2">
              <HRContent32 />
              </TabPane>
              <TabPane tab="BAGGAGE" key="3">
              <HRContent33 />
              </TabPane>
            </Tabs>
      </div>
    );
  }
}
export default HRContent3;
