import React from "react";
import { Row, Col, Card, Tooltip as AntdTooltip, Icon } from "antd";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./HrContent2.css";
import "./HrContent1.css";
import AgeChart from "./AgeChart";

export default class HrContent3 extends React.Component {

  render(){
    const { data, ageData, data1 } = this.props;

    if (!data || !Array.isArray(data) || !ageData || !data1 ) {
      return <div></div>; 
    }

    const totalAge = ageData.reduce((acc, item) => acc + item.AvgAge, 0);
    const averageAge = (totalAge / ageData.length);
    
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.CpnyID]) {
        acc[item.CpnyID] = [];
      }
      acc[item.CpnyID].push(item);
      return acc;
    }, {});

    const stats = data1[0] || {};

    const result = Object.keys(stats).map(key => ({
      YearInterval: key,
      EmpCount: stats[key]
    }));
    
    return (
      <div className="card-header" style={{ margin: "10px" }}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
          <Card className="card-padding" style={{ borderRadius: 12, height: 300 }}>
            <p style={{ fontWeight: "bold", textAlign: "center" }}>
              Насны бүтэц (дундаж = {averageAge})
              <AntdTooltip title="Ажилтны тоо зөрүүтэй бол гэрээний бүртгэл хийгдсэн эсэхийг шалгаарай!" overlayClassName="hr-tooltip" placement="right">
                <Icon
                  type="info-circle-o"
                  className="info-icon"
                  style={{ marginLeft: 6, cursor: "pointer", color: "#8c96a5" }}
                />
              </AntdTooltip>
            </p>
            <AgeChart data={ageData}/>
          </Card>
        </Col>
        {Object.entries(groupedData).map(([cpnyID, items]) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8} key={cpnyID}>
            <Card className="card-padding" style={{ borderRadius: 12, height: 300 }}>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>
                Ажилтны тоо / хэлтсээр
                <AntdTooltip title="Ажилтны тоо зөрүүтэй бол гэрээний бүртгэл хийгдсэн эсэхийг шалгаарай!" overlayClassName="hr-tooltip" placement="right">
                  <Icon
                    type="info-circle-o"
                    className="info-icon"
                    style={{ marginLeft: 6, cursor: "pointer", color: "#8c96a5" }}
                  />
                </AntdTooltip>
              </p>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={items}
                    dataKey="EmpCount"
                    nameKey="Descr"
                    innerRadius={40}
                    outerRadius={95}
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {items.map((entry, index) => (
                      <Cell key={index} fill={`hsl(${index * 60}, 70%, 60%)`} />
                    ))}
                  </Pie>

                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{fontSize: "24px", fill: "#1890ff" }}>
                    {items.reduce((acc, item) => acc + item.EmpCount, 0)}
                  </text>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        ))}
        <Col xs={24} sm={12} md={8}>
          <Card className="card-padding" style={{borderRadius: 12}}>
            <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: 4 }}>
              Ажилтны тоо / ажилласан жилээр
              <AntdTooltip title="Ажилтны тоо зөрүүтэй бол гэрээний бүртгэл хийгдсэн эсэхийг шалгаарай!" overlayClassName="hr-tooltip" placement="right">
                <Icon
                  type="info-circle-o"
                  className="info-icon"
                  style={{ marginLeft: 6, cursor: "pointer", color: "#8c96a5" }}
                />
              </AntdTooltip>
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data1} dataKey="EmpCount" nameKey="YearInterval" innerRadius={40} outerRadius={95} fill="#8884d8" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
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
                  {data1.reduce((acc, item) => acc + item.EmpCount, 0).toFixed(0)}
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