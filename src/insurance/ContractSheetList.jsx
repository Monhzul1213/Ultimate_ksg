import React, { Component } from "react";
import {
  Input,
  Button,
  Select,
  DatePicker,
  Form,
  notification,
  Spin,
  Icon,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Typography,
} from "antd";
import "./ContractSheet.css";
import "../route/mainRoute.css";
import loadingImg from "@/image/loading.gif";
import moment from "moment";
import cookie from "react-cookies";
import { Resizable } from "react-resizable";
import request from "./PostRequest";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from "bizcharts";
import DataSet from "@antv/data-set";
import ContractSheet from "./ContractSheet";
import NumberFormat from "react-number-format";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY.MM.DD";

const loadingIcon = (
  <Icon component={() => <img src={loadingImg} alt="loading" />} />
);

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, baseData, loading } = this.props;
    const { getFieldDecorator } = form;

    const formLayount = {
      style: {
        maxWidth: "992px",
        width: "992px",
      },
      onSubmit: onSubmitForm,
      autoComplete: "off",
      labelAlign: "left",
    };

    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 24 }, //≥576px
      md: { span: 24 }, //≥768px
      lg: { span: 12 }, //≥992px
      xl: { span: 8 }, //≥1200px
      xxl: { span: 8 }, //≥1600px
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 8 },
        lg: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 16 },
        lg: { span: 15 },
      },
    };

    const formButtonLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14, offset: 10 },
        md: { span: 16, offset: 8 },
        lg: { span: 15, offset: 9 },
      },
    };

    return (
      <Form {...formLayount}>
        <Row gutter={16}>
          <Col {...columnConfig}>
            <Form.Item
              label="Огноо"
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              {getFieldDecorator("Date", {
                rules: [
                  {
                    type: "array",
                    required: true,
                    message: "Мэдээлэл оруулах шаардлагатай.",
                  },
                ],
                initialValue: [moment(), moment()],
              })(
                <RangePicker
                  disabled={loading}
                  allowClear={false}
                  format={dateFormat}
                  style={{ width: "100%" }}
                  placeholder=""
                />
              )}
            </Form.Item>
          </Col>
          <Col {...columnConfig}>
            <Form.Item
              label="Даатгуулагч код"
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              {getFieldDecorator("CustID")(<Input disabled={loading} />)}
            </Form.Item>
          </Col>
          <Col {...columnConfig}>
            <Form.Item
              label="Даатгуулагч нэр"
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              {getFieldDecorator("CustName")(<Input disabled={loading} />)}
            </Form.Item>
          </Col>
          <Col {...columnConfig}>
            <Form.Item
              label="Төлөв"
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              {getFieldDecorator("Status", { initialValue: "-1" })(
                <Select disabled={loading}>
                  {baseData &&
                    baseData.isContractSheet_Status &&
                    baseData.isContractSheet_Status.map(
                      (isContractSheet_Status) => (
                        <Option key={isContractSheet_Status.ConstKey}>
                          {isContractSheet_Status.ValueStr1}
                        </Option>
                      )
                    )}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...columnConfig}>
            <Form.Item
              label="Бүтээгдэхүүн"
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              {getFieldDecorator("ProductID")(
                <Select
                  disabled={loading}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 500 }}
                  showSearch
                  optionFilterProp="children"
                >
                  {baseData &&
                    baseData.Product &&
                    baseData.Product.map((product) => (
                      <Option key={product.ProductID}>
                        {product.ProductName}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...columnConfig}>
            <Form.Item {...formButtonLayout}>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                disabled={loading}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

class Donut extends React.Component {
  render() {
    const { data } = this.props;
    const { DataView } = DataSet;
    const { Html } = Guide;
    const dv = new DataView();

    data &&
      dv.source(data).transform({
        type: "aggregate",
        fields: ["ContractNo"],
        operations: ["count"],
        as: ["ContractCount"],
        groupBy: ["StatusName"],
      });
    const cols = {
      ContractCount: {
        formatter: (val) => {
          return val;
        },
      },
    };
    return (
      <div>
        <Chart padding={[0, 0, 40, 0]} height={240} data={dv} forceFit>
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="ContractCount" />
          <Legend />
          <Tooltip showTitle={false} />
          <Geom
            type="intervalStack"
            position="ContractCount"
            color="StatusName"
            style={{
              lineWidth: 1,
              stroke: "#fff",
            }}
          >
            <Label
              content="ContractCount"
              formatter={(val, item) => {
                return item.point.StatusName + ": " + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

class Groupedcolumn extends React.Component {
  render() {
    const { data } = this.props;
    const result = [];
    data &&
      data.reduce(function (res, value) {
        const month = value.ContractDate.slice(0, 7);
        if (!res[month]) {
          res[month] = { month, PremiumAmt: 0, PaidAmt: 0 };
          result.push(res[month]);
        }
        res[month].PremiumAmt += value.PremiumAmt;
        res[month].PaidAmt += value.PaidAmt;
        return res;
      }, {});

    const ds = new DataSet();
    const dv = result && ds.createView().source(result);
    dv &&
      dv.transform({
        type: "fold",
        fields: ["PremiumAmt", "PaidAmt"],
        key: "amtType",
        value: "amtValue",
      });
    return (
      <div>
        <Chart
          padding={["auto", "auto", 60, "auto"]}
          scale={{
            amtValue: {
              formatter: (value) => {
                {
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
              },
            },
          }}
          height={240}
          data={dv}
          forceFit
        >
          <Axis name="month" />
          <Axis name="amtValue" />
          <Legend
            itemFormatter={(val) => {
              switch (val) {
                case "PremiumAmt":
                  return "Хураамж";
                case "PaidAmt":
                  return "Орлого";
                default:
              }
            }}
          />
          <Tooltip showTitle={false} />
          <Geom
            type="interval"
            position="month*amtValue"
            color={"amtType"}
            tooltip={[
              "amtValue*amtType",
              (amtValue, amtType) => {
                const value = amtValue
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                switch (amtType) {
                  case "PremiumAmt":
                    return {
                      name: "Хураамж",
                      value: value,
                    };
                  case "PaidAmt":
                    return {
                      name: "Орлого",
                      value: value,
                    };
                  default:
                }
              },
            ]}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32,
              },
            ]}
          />
        </Chart>
      </div>
    );
  }
}

const WrappedFilterForm = Form.create({ name: "filter_form" })(FilterForm);

export default class ContractSheetList extends Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      searchText: "",
      searchedColumn: "",
    };
  }

  componentDidMount() {
    request
      .post("SheetList_Initialize", {
        token: this.state.LoggedSysuser.token,
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

        const {
          smQueryDetail,
          isContractSheet_Status,
          Product,
        } = res.data.retData;
        const columns = [];

        if (smQueryDetail) {
          smQueryDetail.forEach((detail) => {
            var align;
            switch (detail.TextAlign) {
              case "Center":
                align = "center";
                break;
              case "Far":
                align = "right";
                break;
              default:
                align = "left";
            }
            columns.push({
              title: detail.Caption,
              width: detail.Width,
              dataIndex: detail.FieldName,
              key: detail.FieldName,
              className: "column-header-center",
              align,
              ellipsis: true,
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
                    value={selectedKeys[0]}
                    onChange={(e) =>
                      setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                      this.onSearchColumn(
                        selectedKeys,
                        confirm,
                        detail.FieldName
                      )
                    }
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                  />
                  <Button
                    type="primary"
                    onClick={() =>
                      this.onSearchColumn(
                        selectedKeys,
                        confirm,
                        detail.FieldName
                      )
                    }
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                  >
                    Шүүх
                  </Button>
                  <Button
                    onClick={() => this.onResetSearchColumn(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Цуцлах
                  </Button>
                </div>
              ),
              filterIcon: (filtered) => (
                <Icon
                  type="search"
                  style={{ color: filtered ? "#1890ff" : undefined }}
                />
              ),
              onFilter: (value, record) =>
                record[detail.FieldName]
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                  setTimeout(() => this.searchInput.select());
                }
              },
              render: (text) => {
                if (detail.FieldName === "ContractNo")
                  return (
                    <Button
                      style={{
                        padding: 0,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textAlign: "left",
                      }}
                      type="link"
                      onClick={() => {
                        this.onSelectContract(text);
                      }}
                      block
                    >
                      {text}
                    </Button>
                  );
                if (detail.TextFormat && detail.TextFormat.includes("#")) {
                  let opt = {
                    value: text,
                    displayType: "text",
                    thousandSeparator: true,
                  };
                  if (detail.TextFormat.includes("."))
                    opt = { ...opt, decimalScale: 2, fixedDecimalScale: true };
                  return <NumberFormat {...opt} />;
                }
                return text;
              },
            });
          });

          isContractSheet_Status &&
            isContractSheet_Status.unshift({
              ConstKey: -1,
              ValueStr1: "-- Бүгд --",
            });
          Product &&
            Product.unshift({ ProductID: null, ProductName: "-- Бүгд --" });
        }

        columns.push({
          title: "",
        });

        this.setState({ baseData: res.data.retData, columns, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  onSubmitForm = (e) => {
    e && e.preventDefault();
    const { form } = this.formRef.props;
    form.validateFields({ first: true }, (err, values) => {
      if (!err) {
        var BusinessObject = [];
        Object.entries(values).forEach(([key, value]) => {
          if (key === "Date") {
            BusinessObject.push({
              FieldName: "BeginDate",
              Value: moment(value[0]).format(dateFormat),
            });
            BusinessObject.push({
              FieldName: "EndDate",
              Value: moment(value[1]).format(dateFormat),
            });
          } else BusinessObject.push({ FieldName: key, Value: value });
        });
        this.setState({ loading: true });
        const replacer = (key, value) =>
          typeof value === "undefined" ? null : value;
        request
          .post("SheetList_Search", {
            token: this.state.LoggedSysuser.token,
            json: JSON.stringify({ BusinessObject }, replacer),
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
            this.setState({ filterResult: data.retData, loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false });
            console.error(err);
          });
      }
    });
  };

  onSelectContract = (ContractNo) => {
    this.setState({ showContract: true, ContractNo });
  };

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  onResizeColumn = (index) => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  onSearchColumn = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  onResetSearchColumn = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  onCancelContract = () => {
    this.setState({ showContract: false });
  };

  render() {
    const columns =
      this.state.columns &&
      this.state.columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
          width: column.width,
          onResize: this.onResizeColumn(index),
        }),
      }));

    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 24 }, //≥576px
      md: { span: 12 }, //≥768px
    };

    return (
      <div className="container">
        <Spin indicator={loadingIcon} spinning={this.state.loading}>
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            baseData={this.state.baseData}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
          />
          <Row gutter={[16, 16]}>
            <Col {...columnConfig}>
              <Card title="Гэрээний тоо" size="small" style={{ height: 300 }}>
                <Donut data={this.state.filterResult} />
              </Card>
            </Col>
            <Col {...columnConfig}>
              <Card
                title="Хураамж, орлого"
                size="small"
                style={{ height: 300 }}
              >
                <Groupedcolumn data={this.state.filterResult} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Table
                bordered
                components={this.components}
                columns={columns}
                rowKey="ContractNo"
                dataSource={this.state.filterResult}
                size="small"
                scroll={{ x: 100, y: 400 }}
                pagination={{ pageSize: 50 }}
              />
            </Col>
          </Row>
          <Modal
            bodyStyle={{ padding: 0, overflowY: "scroll", height: 720 }}
            width="auto"
            destroyOnClose
            centered
            visible={this.state.showContract}
            title="Баталгаа"
            footer={null}
            onCancel={this.onCancelContract}
          >
            <ContractSheet ContractNo={this.state.ContractNo} />
          </Modal>
        </Spin>
      </div>
    );
  }
}
