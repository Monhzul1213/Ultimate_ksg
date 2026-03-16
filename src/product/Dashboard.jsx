import React from 'react';
import { Typography, Layout, Tabs } from 'antd';
import HRContent1 from "./HRContent1";
import HRContent2 from "./HRContent2";
import HRContent3 from "./HRContent3";

const { Text } = Typography;
const { TabPane } = Tabs;

class Dashboard extends React.Component {
    render() {
        return (
            <div style={{ margin: '27px' }}>
                <h3>Management dashboard</h3>
                <h4 style={{ marginBottom: '30px' }}>Dashboard / <Text color='#6b747b' >Management dashboard</Text></h4>
                <div>
                    <Layout className="Container">
                    <Tabs tabPosition = 'left'>
                    <TabPane tab="SALES" key="1">
                        <HRContent1 /> 
                        <HRContent2 />
                    </TabPane>
                    <TabPane tab="NUBIA" key="2">
                        <HRContent3 /> 
                    </TabPane>
                    </Tabs>
                    </Layout>
                </div>
            </div>
        );
    };
}

export default Dashboard;
