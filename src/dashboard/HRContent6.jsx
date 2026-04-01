import React, { useEffect, useRef } from "react";
import { Row, Col, Card } from "antd";
import "./HrContent2.css";
import Chart from "chart.js/auto";

const HrContent6 = ({ data }) => {  
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const parsed = data.map((item) => ({
      month: item.MonthName,
      values: JSON.parse(item.Data),
      avg: item.BeforeYearAVG,
    }));

    const labels = parsed.map((i) => i.month);

    const overtime = parsed.map((i) => i.values[0]);
    const absent = parsed.map((i) => i.values[1]);
    const free = parsed.map((i) => i.values[2]);
    const late = parsed.map((i) => i.values[3]);
    const avgLine = parsed.map((i) => i.avg);

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            type: "bar",
            label: "Илүү цаг",
            data: overtime,
            backgroundColor: "#6adfdf",
          },
          {
            type: "bar",
            label: "Ажил таслалт",
            data: absent,
            backgroundColor: "#d85855",
          },
          {
            type: "bar",
            label: "Чөлөө",
            data: free,
            backgroundColor: "#63df56",
          },
          {
            type: "bar",
            label: "Хоцролт",
            data: late,
            backgroundColor: "#dee15a",
          },
          // {
          //   type: "line",
          //   label: "Дундаж",
          //   data: avgLine,
          //   borderColor: "#000",
          //   fill: false,
          // },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 👈 ЭНД
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <div className="card-header" style={{ margin: "10px" }}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24}>
          <Card className="card-padding" style={{ borderRadius: 12 }}>
            <div style={{ height: 300 }}>
              <canvas ref={canvasRef} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HrContent6;