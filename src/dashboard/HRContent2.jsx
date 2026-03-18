import React from "react";
import { Row, Col, Card } from "antd";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./HrContent2.css";
import AgeChart from "./AgeChart";

export default class HrContent2 extends React.Component {

  render(){
    const { data1, data2, ageData } = this.props;

    if (!data1 || !Array.isArray(data1) || !data2 || !ageData ) {
      return <div></div>; 
    }

    const totalAge = ageData.reduce((acc, item) => acc + item.AvgAge, 0);
    const averageAge = (totalAge / ageData.length);

    return (
      <div className="card-header" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8} style={{padding: '12px 12px'}}>
            <Card className="card-padding" style={{borderRadius: 12}}>
              <p style={{ fontSize: "16px", fontWeight: "bold", textAlign: "center" }}>Age segmentation (avg = {averageAge})</p>
              <AgeChart data={ageData}/>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="card-padding" style={{borderRadius: 12}}>
              <p style={{ textAlign: "center", fontWeight: "bold", fontSize: 16 }}>SLUL</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data1} dataKey="EmpCount" nameKey="Descr" innerRadius={40} outerRadius={100} fill="#8884d8" label={({ percent }) => `${(percent * 100).toFixed(1)}%`}>
                      {data1.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                      ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{fontSize: "24px", fill: "#1890ff" }}
                  >
                    {data1.reduce((acc, item) => acc + item.EmpCount, 0)}
                  </text>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="card-padding" style={{borderRadius: 12}}>
              <p style={{ textAlign: "center", fontWeight: "bold", fontSize: 16 }}>SLUB</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data2} dataKey="EmpCount" nameKey="Descr" innerRadius={40} outerRadius={90} fill="#8884d8" label={({ percent }) => `${(percent * 100).toFixed(1)}%`}>
                    {data2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{fontSize: "24px", fill: "#1890ff"  }}
                  >
                    {data2.reduce((acc, item) => acc + item.EmpCount, 0)}
                  </text>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };  

  }