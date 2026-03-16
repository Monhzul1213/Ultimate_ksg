import React, { Component } from "react";
import { Checkbox, notification, Table } from "antd";
import "../route/mainRoute.css";
import "./GridView.css";
import cookie from "react-cookies";
import { Resizable } from "react-resizable";
import request from "../insurance/PostRequest";
import NumberFormat from "react-number-format";

export default class GridView extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      loading: true,
      LoggedSysuser,
    };
  }

  componentDidMount() {
    if (this.props.QueryID)
      request
        .post("Get_QueryDetail", {
          token: this.state.LoggedSysuser.token,
          QueryID: this.props.QueryID,
        })
        .then((res) => {
          const data = res.data;

          if (data.retType !== 0) {
            this.setState({ loading: false });
            notification["error"]({
              message: "Анхаар",
              description: data.retDesc,
            });
            return;
          }

          const { smQueryDetail } = res.data.retData;
          const { renderColumns, customRender, addColumns } = this.props;
          var columns = [];

          if (smQueryDetail) {
            smQueryDetail.forEach((detail) => {
              var className, render;
              if (
                renderColumns &&
                customRender &&
                renderColumns.includes(detail.FieldName)
              )
                render = (text, record) => {
                  return customRender(text, record, detail.FieldName);
                };
              else
                render = (text) => {
                  if (detail.Repository === "CHECK") {
                    if (text === "Y") return <Checkbox checked={true} />;
                    else return null;
                  }
                  if (detail.TextFormat && detail.TextFormat.includes("#")) {
                    let opt = {
                      value: text,
                      displayType: "text",
                      thousandSeparator: true,
                    };
                    if (detail.TextFormat.includes("."))
                      opt = {
                        ...opt,
                        decimalScale: 2,
                        fixedDecimalScale: true,
                      };
                    return <NumberFormat {...opt} />;
                  }
                  return text;
                };
              switch (detail.TextAlign) {
                case "Center":
                  className = "table-column-center";
                  break;
                case "Far":
                  className = "table-column-right";
                  break;
              }
              columns.push({
                title: detail.Caption,
                width: detail.width === 0 ? undefined : detail.width,
                dataIndex: detail.FieldName,
                key: detail.FieldName,
                className,
                sorter: (x, y) => {
                  var a = x[detail.FieldName] || "";
                  var b = y[detail.FieldName] || "";
                  return a
                    .toString()
                    .toLowerCase()
                    .localeCompare(b.toString().toLowerCase());
                },
                render,
              });
            });
          }

          if (addColumns) columns = columns.concat(addColumns);

          this.setState({ loading: false, columns });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ loading: false });
        });
  }

  componentDidUpdate(prevProps) {
    if (this.props.columns != prevProps.columns)
      this.setState({ loading: false, columns: this.props.columns });
  }

  render() {
    const columns =
      this.state.columns &&
      this.state.columns.map((col, index) => ({
        ...col,
        className: col.className
          ? col.className + " "
          : "" + "table-column-noborder",
      }));

    return (
      <Table
        loading={this.state.loading}
        className={
          "table-head-withborder" + this.props.className
            ? " " + this.props.className
            : ""
        }
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-even" : "table-row-odd"
        }
        columns={columns}
        rowKey={this.props.rowKey}
        dataSource={this.props.dataSource}
        size={this.props.size ? this.props.size : "default"}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
      />
    );
  }
}
