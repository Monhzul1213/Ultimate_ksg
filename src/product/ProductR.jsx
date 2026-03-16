import React, { Component } from "react";
import {
  Input,
  Button,
  Select,
  Checkbox,
  Typography,
  Form,
  Spin,
  Row,
  Col,
  Card,
  notification,
  InputNumber,
  Modal,
  Upload,
  Table,
} from "antd";
import { Field } from "ant-design-pro/lib/Charts";
import "./ProductR.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "./Editable";
import GridView from "../base/GridView";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const dateFormat = "YYYY.MM.DD";

const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};
class Product extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      baseData: undefined,
      baseData1: undefined,
      baseData2: undefined,
      baseData3: undefined,
      baseData4: undefined,
      baseData5: undefined,
      baseData6: undefined,
      loading: true,
      itemValid: false,
      editable: false,
      LoggedSysuser,
      cookieUser,
      fetching: false,
      bufferData: undefined,
      visible: false,
      cols: [],
      rows: [],
      errorMessage: null,
      map: {
        "Бар код": "BarCode",
        "Барааны категори": "MaterialType",
        "Барааны нэр": "Descr",
        "Барааны нэр/англи/": "DescrEng",
        "Барааны ангилал": "ClassID",
        "Импортолсон улс": "CountryID",
        Нийлүүлэгч: "VendID",
        "Хадгалах хугацаа": "ValidTime",
        "Хадгалах хугацаа/Төрөл/": "ValidType",
        "Барааны үндсэн байршил": "PrimaryBinCode",
        "Хэмжих нэгж": "BaseUnitID",
        "ПОС-ын үнэ": "PSPrice",
        "Гүйлгээний төлөв": "TranStatus",
        "НХАТ эсэх": "IsNHAT",
        "НӨАТ тооцох бараа эсэх": "isNoatus",
        "Ажилтан сонгох эсэх": "IsActionEmp",
        "Борлуулалтын хэмжих нэгж": "SalesUnitID",
        "Дотоод барааны код": "inInvtID",
      },
      columns: [
        {
          title: "Бар код",
          dataIndex: "BarCode",
          editable: true,
        },
        {
          title: "Барааны категори",
          dataIndex: "MaterialType",
          editable: true,
        },
        {
          title: "Барааны нэр",
          dataIndex: "Descr",
          editable: true,
        },
        {
          title: "Барааны нэр/англи/",
          dataIndex: "DescrEng",
          editable: true,
        },
        {
          title: "Барааны ангилал",
          dataIndex: "ClassID",
          editable: true,
        },
        {
          title: "Импортолсон улс",
          dataIndex: "CountryID",
          editable: true,
        },
        {
          title: "Нийлүүлэгч",
          dataIndex: "VendID",
          editable: true,
        },
        {
          title: "Хадгалах хугацаа",
          dataIndex: "ValidTime",
          editable: true,
        },
        {
          title: "Хадгалах хугацаа/Төрөл/",
          dataIndex: "ValidType",
          editable: true,
        },
        {
          title: "Барааны үндсэн байршил",
          dataIndex: "PrimaryBinCode",
          editable: true,
        },
        {
          title: "Хэмжих нэгж",
          dataIndex: "BaseUnitID",
          editable: true,
        },
        {
          title: "ПОС-ын үнэ",
          dataIndex: "PSPrice",
          editable: true,
        },
        {
          title: "Гүйлгээний төлөв",
          dataIndex: "TranStatus",
          editable: true,
        },
        {
          title: "НХАТ эсэх",
          dataIndex: "IsNHAT",
          editable: true,
        },
        {
          title: "НӨАТ тооцох бараа эсэх",
          dataIndex: "isNoatus",
          editable: true,
        },
        {
          title: "Ажилтан сонгох эсэх",
          dataIndex: "IsActionEmp",
          editable: true,
        },
        {
          title: "Борлуулалтын хэмжих нэгж",
          dataIndex: "SalesUnitID",
          editable: true,
        },
        {
          title: "Дотоод барааны код",
          dataIndex: "inInvtID",
          editable: true,
        },
      ],
    };
  }

  setInvoiceModeNormal() {
    this.setState({
      loading: false,
      invoiceMode: BaseInvoiceMode.Normal,
      bufferData: undefined,
    });
  }

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "IN_438" }),
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

        this.setState({ baseData: res.data.retData, loading: false });
      });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "IN_439" }),
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

        this.setState({ baseData1: res.data.retData, loading: false });
      });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "IN_440", ModuleID: "IN" }),
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

        this.setState({ baseData2: res.data.retData, loading: false });
      });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "IN_441",
          ModuleID: "IN",
          BusinessObject: [
            { FieldName: "SiteID", Value: this.state.cookieUser.SiteID },
          ],
        }),
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
        this.getInfo();
        this.setState({ baseData3: res.data.retData, loading: false });
      });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "IN_443", ModuleID: "IN" }),
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
        this.getInfo();
        this.setState({ baseData5: res.data.retData, loading: false });
      });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "IN_444" }),
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

        this.setState({ baseData6: res.data.retData, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  getInfo = () => {
    request
      .post("Get_Constants", {
        token: this.state.LoggedSysuser.token,
        ConstType: "inInventory_TranStatus",
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

        this.setState({ baseData4: res.data.retData, loading: false });
      });
    request
      .post("Get_Constants", {
        token: this.state.LoggedSysuser.token,
        ConstType: "ininventory_validtype",
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

        this.setState({ baseData7: res.data.retData, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  onPressEnterBarCode = (e) => {
    const BarCode = this.props.form.getFieldValue("BarCode");
    if (BarCode) this.getData(BarCode);
    else this.setInvoiceModeNormal();
  };

  getData = (BarCode) => {
    const { getFieldsValue, setFieldsValue, resetFields } = this.props.form;
    this.setState({ loading: true });
    var BusinessObject = [
      { FieldName: "Selection", Value: "BARCODE" },
      { FieldName: "BarCode", Value: BarCode },
      { FieldName: "SiteID", Value: this.state.cookieUser.SiteID },
    ];

    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: "IN_442", ModuleID: "IN", BusinessObject },
          replacer
        ),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          resetFields();
          setFieldsValue({ BarCode: BarCode });
          this.setInvoiceModeNormal();
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
          });
          return;
        }
        const { Table } = res.data.retData;
        let values = {};

        Object.keys(getFieldsValue()).forEach((key) => {
          switch (key) {
            case "BarCode":
            case "MaterialType":
            case "Descr":
            case "DescrEng":
            case "ClassID":
            case "VendID":
            case "CostExprireDate":
            case "BaseUnitID":
            case "PSPrice":
            case "TranStatus":
            case "CountryID":
            case "SalesUnitID":
            case "InvtID":
            case "ValidType":
            case "ValidTime":
            case "PrimaryBinCode":
            case "inInvtID":
              values[key] = Table[0][key];
              break;
            case "isNoatus":
            case "IsNHAT":
            case "IsActionEmp":
              values[key] = Table[0][key] === "Y";
          }
        });
        setFieldsValue(values);
        this.setState({
          bufferData: res.data.retData,
          invoiceMode: BaseInvoiceMode.View,
          loading: false,
          itemValid: true,
          editable: Table[0].Status !== "V",
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        resetFields();
        notification["error"]({
          message: "Бараа олдсонгүй.",
          description: "",
        });
      });
  };

  handleSubmit = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;

      const inInventory = [];
      inInventory.push(values);

      this.save(inInventory);
    });
  };

  save = (inInventory) => {
    this.setState({ loading: true });
    inInventory.forEach((inv) => {
      if (inv.InvtID === undefined) inv.RowStatus = "I";
      else if (inv.RowStatus !== "I") inv.RowStatus = "U";
      inv.IsNHAT = inv.IsNHAT === "Y" || inv.IsNHAT === true ? "Y" : "N";
      inv.isNoatus = inv.isNoatus === "Y" || inv.isNoatus === true ? "Y" : "N";
      inv.IsActionEmp =
        inv.IsActionEmp === "Y" || inv.IsActionEmp === true ? "Y" : "N";
      inv.PrimarySiteID = this.state.cookieUser.SiteID;
      inv.CpnyID = this.state.cookieUser.CompanyID;
    });

    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "IN_437",
          inInventory,
          ModuleID: "SM",
        }),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
          });
          return;
        }
        notification["success"]({
          message: "Амжилттай хадгаллаа.",
          description: "",
        });
        this.setState({
          invoiceMode: BaseInvoiceMode.Add,
          loading: false,
          visible: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };

  handleOk = (e) => {
    this.save(this.state.rows);
  };

  onClickNew = () => {
    const { form } = this.props;
    this.setState({ loading: true });
    form.resetFields();
    this.setState({
      invoiceMode: BaseInvoiceMode.Add,
      loading: false,
      editable: true,
    });
  };

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  };
  handleSelectChange = (value) => {
    this.props.form.setFieldsValue({
      SalesUnitID: `${value}`,
    });
  };

  fileHandler = (fileList) => {
    let fileObj = fileList;
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        if (resp.rows.length == 0)
          this.setState({
            errorMessage: "Файл хоосон байна.",
          });
        else {
          let errorMessage;
          Object.keys(this.state.map).forEach((key) => {
            if (!Object.values(resp.rows[0]).includes(key)) {
              errorMessage = key + " багана олдсонгүй.";
              return;
            }
          });
          if (errorMessage)
            notification["error"]({
              message: errorMessage,
              description: "",
            });
          else {
            resp.rows.slice(1).map((row, index) => {
              if (row && row !== "undefined") {
                let obj = {};
                Object.values(resp.rows[0]).forEach((value, index) => {
                  obj[this.state.map[value]] = row[index];
                });
                newRows.push(obj);
              }
            });
          }
          this.setState({
            cols: resp.rows[0],
            rows: newRows,
            errorMessage: null,
            visible: true,
          });
        }
      }
    });
    return false;
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      baseData,
      baseData1,
      baseData2,
      baseData3,
      baseData4,
      baseData5,
      baseData6,
      baseData7,
      bufferData,
    } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const disabledActive =
      this.state.loading ||
      [BaseInvoiceMode.Add, BaseInvoiceMode.Edit].includes(
        this.state.invoiceMode
      );
    const disabledEdit =
      this.state.loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;

    const formLayount = {
      labelCol: {
        span: 11,
      },
      wrapperCol: {
        span: 13,
      },
      labelAlign: "left",
    };
    const tailFormLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 14, offset: 11 },
      },
      style: {
        margin: "0 auto",
      },
    };
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    });

    const greaterThan = [
      {
        validator: (rule, value, callback) => {
          if (value > 0) {
            callback();
            return;
          }
          callback("0-ээс их утга оруулах  шаардлагатай.");
        },
        required: true,
      },
    ];
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return (
      <div style={{ margin: "15px" }}>
        <h3 style={{ marginBottom: "30px" }}>
          Бараа / Бүртгэл / <Text color="#6b747b">Бараа бүртгэл</Text>
        </h3>
        <Spin spinning={this.state.loading}>
          <Card>
            <Form {...formLayount} className="stepForm">
              <Form.Item label="Бар код" {...formItemLayout}>
                <Row gutter={8} className="kk">
                  <Col span={18}>
                    {getFieldDecorator("BarCode", {
                      rules: required,
                    })(<Input onPressEnter={this.onPressEnterBarCode} />)}
                  </Col>
                  <Col className="dd" span={3} style={{ textAlign: "right" }}>
                    <Button
                      shape="circle"
                      icon="plus"
                      onClick={this.onClickNew}
                      className="button2"
                    />
                  </Col>
                  <Col className="dd" span={3} style={{ textAlign: "right" }}>
                    <Upload
                      name="file"
                      beforeUpload={this.fileHandler}
                      onRemove={() => this.setState({ rows: [] })}
                      multiple={false}
                      className="aant-upload-list"
                    >
                      <Button
                        shape="circle"
                        icon="file-excel"
                        className="button2"
                      />
                    </Upload>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label="Барааны категори"
                className="ant-form-item-required::before"
                {...formItemLayout}
              >
                {getFieldDecorator("MaterialType", {
                  rules: required,
                })(
                  <Select
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    allowClear={true}
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData &&
                      baseData.Table &&
                      baseData.Table.map((item) => (
                        <Option key={item.Materialtype}>
                          {item.Materialtype} - {item.Descr}
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator("InvtID")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    type="hidden"
                  />
                )}
              </Form.Item>
              <Form.Item label="Барааны нэр" {...formItemLayout}>
                {getFieldDecorator("Descr", {
                  rules: required,
                })(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item label="Барааны нэр/англи/" {...formItemLayout}>
                {getFieldDecorator("DescrEng")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item label="Барааны ангилал" {...formItemLayout}>
                {getFieldDecorator("ClassID", {
                  rules: required,
                })(
                  <Select
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    allowClear={true}
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData1 &&
                      baseData1.Table &&
                      baseData1.Table.map((item) => (
                        <Option key={item.ClassID}>
                          {item.ClassID} - {item.Descr}
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Импортолсон улс" {...formItemLayout}>
                {getFieldDecorator("CountryID", {
                  rules: required,
                })(
                  <Select
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    allowClear={true}
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData6 &&
                      baseData6.Table &&
                      baseData6.Table.map((item) => (
                        <Option key={item.CountryID}>
                          {item.CountryID} - {item.CountryName}
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Нийлүүлэгч" {...formItemLayout}>
                {getFieldDecorator("VendID", {
                  rules: required,
                })(
                  <Select
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    allowClear={true}
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData2 &&
                      baseData2.Table &&
                      baseData2.Table.map((item) => (
                        <Option key={item.VendID}>
                          {item.VendID} - {item.VendName}
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Хадгалах хугацаа" style={{ marginBottom: 0 }}>
                <Form.Item
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                    marginBottom: "0px",
                  }}
                >
                  {getFieldDecorator("ValidTime", {
                    initialValue: 0,
                    rules: greaterThan,
                  })(
                    <InputNumber
                      onChange={this.onChangeControls}
                      disabled={disabledEdit}
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  )}
                </Form.Item>
                <span
                  style={{
                    display: "inline-block",
                    width: "24px",
                    textAlign: "center",
                    marginBottom: "0px",
                  }}
                >
                  -
                </span>
                <Form.Item
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 12px)",
                    marginBottom: "0px",
                  }}
                >
                  {getFieldDecorator("ValidType", {
                    initialValue: baseData7 && baseData7[1].ConstKey,
                  })(
                    <Select
                      onChange={this.onChangeControls}
                      disabled={disabledEdit}
                      allowClear={true}
                      showSearch
                      optionFilterProp="children"
                    >
                      {baseData7 &&
                        baseData7.map((item) => (
                          <Option key={item.ConstKey}>{item.ValueStr1}</Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Form.Item>
              <Form.Item label="Барааны үндсэн байршил" {...formItemLayout}>
                {getFieldDecorator("PrimaryBinCode", {
                  rules: required,
                })(
                  <Select
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData3 &&
                      baseData3.Table &&
                      baseData3.Table.map((item) => (
                        <Option key={item.BinCode}>{item.Descr}</Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Хэмжих нэгж" {...formItemLayout}>
                {getFieldDecorator("BaseUnitID", {
                  rules: required,
                })(
                  <Select
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    onChange={this.handleSelectChange}
                    showSearch
                    optionFilterProp="children"
                  >
                    {baseData5 &&
                      baseData5.Table.filter((Status) =>
                        ["Гр", "Кг", "М", "Тн", "Шир"].includes(Status.UnitID)
                      ).map((item) => (
                        <Option key={item.UnitID}>{item.Descr}</Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator("SalesUnitID", {
                  initialValue:
                    baseData5 && baseData5.Table && baseData5.Table[2].UnitID,
                  rules: required,
                })(
                  <Input
                    type="hidden"
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item label="ПОС-ын үнэ" {...formItemLayout}>
                {getFieldDecorator("PSPrice", {
                  initialValue: 0,
                  rules: greaterThan,
                })(
                  <InputNumber
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                    style={{ width: "100%" }}
                    min={0}
                    precision={2}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                )}
              </Form.Item>
              <Form.Item label="Гүйлгээний төлөв" {...formItemLayout}>
                {getFieldDecorator("TranStatus", {
                  initialValue: baseData4 && baseData4[0].ConstKey,
                })(
                  <Select
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  >
                    {baseData4 &&
                      baseData4
                        .filter((TranStatus) =>
                          ["AC", "IN"].includes(TranStatus.ConstKey)
                        )
                        .map((item) => (
                          <Option key={item.ConstKey}>{item.ValueStr1}</Option>
                        ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Дотоод барааны код" {...formItemLayout}>
                {getFieldDecorator("inInvtID", {
                  rules: required,
                })(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator("IsNHAT", { valuePropName: "checked" })(
                  <Checkbox disabled={disabledEdit}>
                    Нийслэл хотын албан татвартай эсэх
                  </Checkbox>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator("isNoatus", { valuePropName: "checked" })(
                  <Checkbox disabled={disabledEdit}>
                    НӨАТ тооцох бараа эсэх
                  </Checkbox>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator("IsActionEmp", { valuePropName: "checked" })(
                  <Checkbox disabled={disabledEdit}>
                    Ажилтан сонгох эсэх
                  </Checkbox>
                )}
              </Form.Item>

              <Form.Item className="dd" {...tailFormLayout}>
                <Button
                  disabled={disabledEdit}
                  htmlType="submit"
                  onClick={this.handleSubmit}
                  className="button2"
                >
                  Хадгалах
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <div style={{ marginTop: 20 }}>
            <Modal
              width="90vw"
              okText="Хадгалах"
              cancelText="Болих"
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onOk={this.handleOk}
              bodyStyle={{
                padding: 0,
                overflowY: "scroll",
              }}
              style={{ height: "0 auto" }}
            >
              <Table
                className={
                  "table-head-withborder" + this.props.className
                    ? " " + this.props.className
                    : ""
                }
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-even" : "table-row-odd"
                }
                dataSource={this.state.rows}
                rowKey="BarCode"
                columns={columns}
                size={this.props.size ? this.props.size : "default"}
                scroll={{ x: "max-content" }}
                pagination={{ pageSize: 8 }}
                footer={() => (
                  <Field
                    label="Нийт бараа: "
                    value={this.state.rows && this.state.rows.length}
                  />
                )}
              />
            </Modal>
          </div>
        </Spin>
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(Product);

export default class ContractSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container">
        <WrappedContractForm />
      </div>
    );
  }
}
