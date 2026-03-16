import React, { Component } from "react";
import { Input, Checkbox, Button, notification, Icon, Table } from "antd";
import { Field } from "ant-design-pro/lib/Charts";
import "../route/mainRoute.css";
import "./GridViewS.css";
import cookie from "react-cookies";
import numeral from "numeral";
import { Resizable } from "react-resizable";
import request from "../insurance/PostRequest";
import NumberFormat from "react-number-format";
import Highlighter from "react-highlight-words";

export default class GridViewS extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      loading: true,
      LoggedSysuser,
      searchText: "",
      searchedColumn: "",
    };
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Хайх
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Болих
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

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
                ...this.getColumnSearchProps(detail.FieldName),
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
        pagination={{ pageSize: 15 }}
        footer={() => (
          <Field
            label="Нийт: "
            value={this.props.dataSource && this.props.dataSource.length}
          />
        )}
      />
    );
  }
}
