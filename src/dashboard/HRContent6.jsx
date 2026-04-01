import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, Card, Tabs } from "antd";
import "./HrContent2.css";
import Chart from "chart.js/auto";

const { TabPane } = Tabs;

const monthOrder = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const HrContent6 = ({ data }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return {};

    const result = data.reduce((acc, item) => {
      const year = String(item.YearNo);
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});

    Object.keys(result).forEach((year) => {
      result[year].sort(
        (a, b) => monthOrder.indexOf(a.MonthName) - monthOrder.indexOf(b.MonthName)
      );
    });

    return result;
  }, [data]);

  const years = useMemo(() => Object.keys(groupedData).sort(), [groupedData]);
  const [activeYear, setActiveYear] = useState("");

  useEffect(() => {
    if (years.length > 0 && !activeYear) {
      setActiveYear(years[years.length - 1]);
    }
  }, [years, activeYear]);

  useEffect(() => {
    if (!activeYear || !groupedData[activeYear] || !canvasRef.current) return;

    const yearData = groupedData[activeYear];

    const parsed = yearData.map((item) => {
      let values = [0, 0, 0, 0];

      try {
        values = JSON.parse(item.Data || "[0,0,0,0]");
      } catch (e) {}

      return {
        month: item.MonthName,
        values: values.map((v) => Number(v || 0)),
      };
    });

    const labels = parsed.map((i) => i.month);
    const overtime = parsed.map((i) => i.values[0]);
    const absent = parsed.map((i) => i.values[1]);
    const free = parsed.map((i) => i.values[2]);
    const late = parsed.map((i) => i.values[3]);

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Илүү цаг",
            data: overtime,
            backgroundColor: "#6adfdf",
          },
          {
            label: "Ажил таслалт",
            data: absent,
            backgroundColor: "#d85855",
          },
          {
            label: "Чөлөө",
            data: free,
            backgroundColor: "#63df56",
          },
          {
            label: "Хоцролт",
            data: late,
            backgroundColor: "#dee15a",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [activeYear, groupedData]);

  if (!data || data.length === 0) return null;

  return (
    <div className="card-header" style={{ margin: "10px" }}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24}>
          <Card className="card-padding" style={{ borderRadius: 12 }}>
            <Tabs activeKey={activeYear} onChange={setActiveYear}>
              {years.map((year) => (
                <TabPane tab={year} key={year} />
              ))}
            </Tabs>

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