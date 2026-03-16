import React from 'react';
import dashboard_img from '@/image/dashboard_img.jpeg';
import { Typography, Layout } from 'antd';
import HRContent1 from "./HRContent1";
import HRContent2 from "./HRContent2";
import HRContent3 from "./HRContent3";

const { Text } = Typography;
class Dashboard extends React.Component {
    render() {
        return (
            <div style={{ margin: '27px' }}>
                <h3>Дашбоард</h3>
                <h4 style={{ marginBottom: '30px' }}>Хүний нөөц / Дашбоард / <Text color='#6b747b' >Дашбоард</Text></h4>
                <div>
                    <Layout className="Container">
                        <HRContent1 />
                        <HRContent2 />
                        <HRContent3 />
                    </Layout>
                </div>
            </div>
        );
    };
}

export default Dashboard;
