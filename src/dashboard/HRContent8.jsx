import React from "react";
import { Card, Table, Tabs } from "antd";
import "./HrContent.css";

const { TabPane } = Tabs;

export default class HrContent8 extends React.Component {
  formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "";

    const num = Number(value);
    if (Number.isNaN(num)) return value;

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(num);
  };

  getColumns = () => [
    {
      title: "",
      dataIndex: "RowName",
      key: "RowName",
      fixed: "left",
      width: 160,
      render: (text) => <span className="salary-row-name">{text}</span>,
    },
    {
      title: "Jan",
      dataIndex: "Jan",
      key: "Jan",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Feb",
      dataIndex: "Feb",
      key: "Feb",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Mar",
      dataIndex: "Mar",
      key: "Mar",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Apr",
      dataIndex: "Apr",
      key: "Apr",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "May",
      dataIndex: "May",
      key: "May",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Jun",
      dataIndex: "Jun",
      key: "Jun",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Jul",
      dataIndex: "Jul",
      key: "Jul",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Aug",
      dataIndex: "Aug",
      key: "Aug",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Sep",
      dataIndex: "Sep",
      key: "Sep",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Oct",
      dataIndex: "Oct",
      key: "Oct",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Nov",
      dataIndex: "Nov",
      key: "Nov",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
    {
      title: "Dec",
      dataIndex: "Dec",
      key: "Dec",
      width: 100,
      align: "right",
      render: (value) => this.formatNumber(value),
    },
  ];

  render() {
    const { data } = this.props;

    if (!data || data.length === 0) {
      return <div></div>;
    }

    const columns = this.getColumns();

    const groupedData = data.reduce((acc, item) => {
      const year = item.Yr ? String(item.Yr) : "No Year";
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {});

    const years = Object.keys(groupedData).sort((a, b) => Number(b) - Number(a));

    return (
      <div className="salary-section-wrapper">
        <Card className="salary-table-card">
          {/* <div className="salary-table-title">Цалингийн мэдээлэл</div> */}

          <Tabs defaultActiveKey={years[0]}>
            {years.map((year) => (
              <TabPane tab={year} key={year}>
                <Table
                  className="salary-table"
                  columns={columns}
                  dataSource={groupedData[year].map((item, index) => ({
                    ...item,
                    key: `${year}-${index}`,
                  }))}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{ x: 1500 }}
                />
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
    );
  }
}